import * as services from '../services';
import { Request, Response } from 'express';
import { badRequest, internalServerError } from '../middleware/handle_errors';
// import { email, password } from '../../helpers/joi_schema';
// import joi from 'joi';

export const getCurrent = async (req: Request, res: Response) => {
	try {
		const { id } = req.user;
		const response = await services.getOne(id);
		console.log({ id });
		return res.status(200).json(response);
	} catch (err) {
		return internalServerError(res);
	}
};
