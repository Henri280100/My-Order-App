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
import upload from '../middleware/upload.middleware';
import { ROLES } from '../helpers/roles_enum.helpers';

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
				role_code: joi.string().default(ROLES.User),
			})
			.validate(req.body);
		if (error) return badRequest(error.details[0].message, res);
		upload(req, res, async (err: any) => {
			if (err instanceof Error) {
				return res.status(400).json({
					error: err.message,
				});
			}
			const userData = {
				fullname: req.body.fullname,
				email: req.body.email,
				password: req.body.password,
				confirmpassword: req.body.confirmpassword,
				genders: req.body.genders,
				avatar: req.file ? req.file.filename : undefined,
				role_code:
					req.body.role_code === ROLES.User ? ROLES.Admin : req.body.role_code,
			};
			const response = await services.RegisterService(userData);
			return res.status(200).json(response);
		});
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error at ${err.message}, ${internalServerError(res)}`);
	}
};

export const loginCtrl = async (req: Request, res: Response) => {
	try {
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

		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error at ${err.message}, ${internalServerError(res)}`);
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
			throw new Error(`Error at ${err.message}, ${internalServerError(res)}`);
	}
};

export const logoutUserCtrl = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const result = await services.LogoutService(userId);
		return res.status(200).json(result);
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error at ${err.message}, ${internalServerError(res)}`);
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
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error at ${err.message}, ${internalServerError(res)}`);
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
			throw new Error(`Error at ${err.message}, ${internalServerError(res)}`);
	}
};
