import * as services from '../services';
import { Request, Response } from 'express';
import { badRequest, internalServerError } from '../middleware/handle_errors';
import {
	email,
	password,
	fullname,
	confirmpassword,
	validateRefreshToken,
} from '../../helpers/joi_schema';
import joi from 'joi';

export const register = async (req: Request, res: Response) => {
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

		const response = await services.register(req.body);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ email, password }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);

		const response = await services.login(req.body);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const refreshTokenController = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ validateRefreshToken }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);
		const response = await services.refreshToken(req.body.refreshToken);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const logoutUser = async (req: Request, res: Response) => {
	try {
		req.session = null as any;
		res.clearCookie('refresh_token');

		return res.status(200).send({
			message: "You've been signed out!",
		});
	} catch (err) {
		return internalServerError(res);
	}
};

export const verification = async (req: Request, res: Response) => {
	try {
		const token = req.params.accessToken;
		const userId = req.params.id;

		const response = await services.verifyEmail(token, userId);

		return res.status(200).json(response);
	} catch (error) {
		return internalServerError(res);
	}
};
