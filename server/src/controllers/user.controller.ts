import * as services from '../services/index.service';
import { Request, Response } from 'express';
import { internalServerError } from '../middleware/handle-errors.middleware';
import upload from '../middleware/upload.middleware';

export const getCurrentCtrl = async (req: Request, res: Response) => {
	try {
		const { id } = req.user;
		const response = await services.getOne(id);
		console.log({ id });
		return res.status(200).json(response);
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error at ${err}, ${internalServerError(res)}`);
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

export const getUserByIdCtrl = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const response = await services.findUserById(parseInt(id));
		console.log(response);
		return res.status(200).json(response);
	} catch (error) {
		throw new Error(`Error at ${error}, ${internalServerError(res)}`);
	}
};

export const updateUserCtrl = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;
		const userData = {
			name: req.body.fullname,
			email: req.body.email,
			avatar: req.file ? req.file.filename : undefined,
		};
		const response = await services.updateUser(parseInt(userId), userData);
		return res.status(200).json(response);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`Error at ${error}, ${internalServerError(res)}`);
	}
};

export const deleteUserCtrl = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const response = await services.deleteUserById(parseInt(id));
		return res.status(200).json(response);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`Error at ${error}, ${internalServerError(res)}`);
	}
};
