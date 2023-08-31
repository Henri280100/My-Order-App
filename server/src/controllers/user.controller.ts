import * as services from '../services/index.service';
import { Request, Response } from 'express';
import {
	badRequest,
	internalServerError,
} from '../middleware/handle-errors.middleware';
import upload from '../middleware/upload.middleware';
import { ROLES } from '../helpers/roles_enum.helpers';

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

export const getALlUserCtrl = async (req: Request, res: Response) => {
	try {
		const response = await services.getAllUser();
		return res.status(200).json(response);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`Error at ${error}, ${internalServerError(res)}`);
	}
};

export const updateUserCtrl = async (req: Request, res: Response) => {
	try {
		upload(req, res, async (err: any) => {
			if (err instanceof Error) {
				return res.status(400).json({
					error: err.message,
				});
			}
			const userId = req.params.id;
			const userData = {
				name: req.body.fullname,
				email: req.body.email,
				avatar: req.file ? req.file.filename : undefined,
			};
			const response = await services.updateUser(parseInt(userId), userData);
			return res.status(200).json(response);
		});
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`Error at ${error}, ${internalServerError(res)}`);
	}
};

export const createUserCtrl = async (req: Request, res: Response) => {
	try {
		const userData = {
			fullname: req.body.name,
			email: req.body.email,
			password: req.body.password,
			confirmpassword: req.body.confirmpassword,
			role_code: req.body.role_code || ROLES.User,
		};
		if (userData.role_code === ROLES.User) {
			userData.role_code = ROLES.Admin;
		}
	} catch (error) {}
};
