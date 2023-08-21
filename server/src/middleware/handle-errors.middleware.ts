import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const badRequest = (err: any, res: Response) => {
	const error = createHttpError.BadRequest(err);
	return res.status(error.status).json({
		err: 1,
		mess: error.message,
	});
};

export const internalServerError = (res: Response) => {
	const error = createHttpError.InternalServerError(
		'Somethings wrong please check the connection or data'
	);
	return res.status(error.status).json({
		err: 1,
		mess: error.message,
	});
};

export const handleUserNotFound = (req: Request, res: Response) => {
	const httpError = createHttpError.Unauthorized('User not found');
	return res.status(httpError.status).json({
		err: 1,
		mess: httpError.message,
	});
};

export const isTFAEnable = (req: Request, res: Response) => {
	const httpError = createHttpError.BadRequest(
		'Two factor authentication is not enabled for this user'
	);
	return res.status(httpError.status).json({
		err: 1,
		mess: httpError.message,
	});
};

export const isValidOTP = (req: Request, res: Response) => {
	const httpError = createHttpError.BadRequest('Invalid OTP');
	return res.status(httpError.status).json({
		err: 1,
		mess: httpError.message,
	});
};

export const notFound = (req: Request, res: Response) => {
	const error = createHttpError.NotFound('Undefined route');
	return res.status(error.status).json({
		err: 1,
		mess: error.message,
	});
};

export const notAuth = (err: any, res: Response) => {
	const error = createHttpError.Unauthorized(err);
	return res.status(error.status).json({
		err: 1,
		mess: error.message,
	});
};

export const tokenIsExpired = (
	err: any,
	res: Response,
	isTokenExpired: any
) => {
	const error = createHttpError.Unauthorized(err);
	return res.status(error.status).json({
		// 1: when the token is invalid
		// 2: when token is expired
		err: isTokenExpired ? 2 : 1,
		mess: error.message,
	});
};

export const isValidTFAToken = (req: Request, res: Response) => {
	const error = createHttpError.BadRequest(
		'Invalid two factor authentication token'
	);
	return res.status(error.status).json({
		err: 1,
		mess: error.message,
	});
};
