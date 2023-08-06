import * as services from '../services/index.service';
import { Request, Response } from 'express';
import { badRequest, internalServerError } from '../middleware/handle_errors';
import {
	email,
	password,
	fullname,
	confirmpassword,
	validateRefreshToken,
	validateEmailVerification,
} from '../helpers/joi_schema';
import joi from 'joi';
import db from '../models';
import bycrypt from 'bcrypt';

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

		const response = await services.register(req.body);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const loginCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ email, password }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);
		const response = await services.login(req.body);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const refreshTokenCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ validateRefreshToken }).validate(req.body);

		if (error) return badRequest(error.details[0].message, res);
		const response = await services.refreshToken(req.body.refreshToken);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};

export const logoutUserCtrl = async (req: Request, res: Response) => {
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

export const verificationCtrl = async (req: Request, res: Response) => {
	try {
		const token = req.params.accessToken;
		const id = req.params.id;
		const { error } = joi.object({ validateEmailVerification }).validate(token);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.verifyEmail(id, token);

		return res.status(200).json(response);
	} catch (error) {
		return internalServerError(res);
	}
};

export const forgotPasswordCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi.object({ email }).validate(req.body);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.forgotPassword(req.body.email);
		return res.status(200).json(response);
	} catch (error) {
		return internalServerError(res);
	}
};

export const resetPasswordCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi
			.object({
				password,
				confirmpassword,
			})
			.validate(req.body);
		if (error) return badRequest(error.details[0].message, res);

		const response = await services.resetPassword(
			req.params.accessToken,
			req.params.id,
			req.body
		);
		return res.status(200).json(response);
	} catch (error) {}
};
