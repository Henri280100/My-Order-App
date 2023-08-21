import joi from 'joi';
import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import * as services from '../services/index.service';
import {
	email,
	password,
	fullname,
	confirmpassword,
	validateRefreshToken,
} from '../helpers/joi_schema.helpers';
import {
	badRequest,
	internalServerError,
} from '../middleware/handle-errors.middleware';

const limiter = new RateLimiterMemory({
	points: 5, // Maximum number of failed login attempts before lockout
	duration: 15 * 60, // Lockout duration in seconds (15 minutes)
});

const rateLimiterMiddleware = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
});

export const registerCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi
			.object({
				fullname,
				email,
				password,
				confirmpassword,
			})
			.validate(req.body);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.RegisterService(req.body);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const loginCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ email, password }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);
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

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
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
		return internalServerError(res);
	}
};

export const logoutUserCtrl = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const result = await services.LogoutService(userId);
		return res.status(200).json(result);
	} catch (err) {
		return internalServerError(res);
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

export const forgotPasswordCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ email }).validate(req.body);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.ForgotPasswordService(req.body.email);
		return res.status(200).json(response);
	} catch (error) {
		return internalServerError(res);
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
	} catch (error) {
		internalServerError(res);
	}
};
