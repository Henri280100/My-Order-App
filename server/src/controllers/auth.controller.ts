import joi from 'joi';
import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import * as services from '../services/index.service';
import {
	email,
	password,
	confirmpassword,
	validateRefreshToken,
	fullname,
} from '../helpers/joi_schema.helpers';
import {
	badRequest,
	internalServerError,
	tooManyRequest,
} from '../middleware/handle-errors.middleware';
import cloudinary from 'cloudinary';

const limiter = new RateLimiterMemory({
	points: 5, // Maximum number of failed login attempts before lockout
	duration: 15 * 60, // Lockout duration in seconds (15 minutes)
});

const rateLimiterMiddleware = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
});

const resendEmailLimiter = rateLimit({
	windowMs: 60000,
	max: 3, // 3 requests per minute
	message: 'Too many request. Please try again later.',
});

/**
 * Registered a user in.
 *
 * @param req The request object.
 * @param res The response object.
 *
 */
export const registerCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi
			.object({
				fullname,
				email,
				password,
				confirmpassword,
			})
			.options({ allowUnknown: true })
			.validate(req.body);
		if (error) {
			return badRequest(error.details[0].message, res);
		}
		const response = await services.RegisterService(req.body);

		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};

/**
 * Logs a user in.
 *
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware function.
 */
export const loginCtrl = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Check if user access token has been revoked
		// await checkIsAccessTokenRevoked(req, res, next);

		const { error } = joi.object({ email, password }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);

		// Limit and lock user when type wrong information
		const isLocked = await limiter.get(req.body.email);
		if (isLocked && isLocked.consumedPoints >= limiter.points) {
			return res.status(401).json({ error: 'Your account has been locked' });
		}

		const response = await services.LoginService(req.body);

		if (!response.success as boolean) {
			await limiter
				.consume(req.body.email)
				.then(() => {
					console.log('success');
				})
				.catch(() => {
					console.log('fail');
				});
		}

		req.session.cookie = response.headers;

		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};

export const rateLimitedLoginCtrl = [
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body;
			const isLocked = await limiter.get(email);
			if (isLocked && isLocked.consumedPoints >= limiter.points) {
				return res.status(401).json({
					error: 'Account locked',
				});
			}

			next();
		} catch (error) {
			if (error instanceof Error)
				throw new Error(
					`Error at: ${error.message}, ${internalServerError(res)}`
				);
		}
	},
	rateLimiterMiddleware,
	loginCtrl,
];

export const refreshTokenCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ validateRefreshToken }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);
		const response = await services.RefreshTokenService(req.body.refreshToken);

		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};

export const logoutUserCtrl = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const result = await services.LogoutService(userId);
		return res.status(200).json(result);
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};

export const verificationCtrl = async (req: Request, res: Response) => {
	try {
		const token = req.params.accessToken;
		const id = req.params.id;
		// const { error } = joi.object({ validateEmailVerification }).validate(token);
		// if (error) return badRequest(error.details[0].message, res);

		const response = await services.VerifyEmailService(id, token);

		return res.status(200).json(response);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`Cannot verification ${error.message}`);
	}
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
	try {
		const resendEmailAllowed = resendEmailLimiter;

		if (!resendEmailAllowed) {
			return tooManyRequest(res);
		}

		const response = await services.ResendVerificationEmail(req.body);
		return res.status(200).send(response);
	} catch (error) {
		if (error instanceof Error) throw new Error(`Error ${error.message}`);
	}
};

export const forgotPasswordCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ email }).validate(req.body);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.ForgotPasswordService(req.body);
		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};

export const resetPasswordCtrl = async (req: Request, res: Response) => {
	try {
		const { accessToken, id } = req.params;
		const { error } = joi
			.object({
				password,
				confirmpassword,
			})
			.validate(req.body);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.ResetPasswordService(
			accessToken,
			parseInt(id),
			req.body
		);
		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};

export const uploadAvatarCtrl = async (req: Request, res: Response) => {
	try {
		if (req.file) {
			res.send('File uploaded successfully');
		} else {
			res.status(400).send('Please upload a valid image');
		}
	} catch (err) {
		if (err instanceof Error)
			res.status(400).send({
				error: `Error at ${err.message}, ${internalServerError(res)}`,
			});
	}
};
