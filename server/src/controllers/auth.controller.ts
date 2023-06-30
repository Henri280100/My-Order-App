import * as services from '../services';
import { Request, Response } from 'express';
import { badRequest, internalServerError } from '../middleware/handle_errors';
import {
	email,
	password,
	fullname,
	confirmpassword,
} from '../../helpers/joi_schema';
import joi from 'joi';

export const register = async (req: Request, res: Response) => {
	try {
		const { error } = joi
			.object({ fullname, email, password, confirmpassword })
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
		console.log(response);

		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};
