import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ErrorCodes } from '../enums/errors-code.enums';

export const badRequest = (err: any, res: Response) => {
	const error = createHttpError.BadRequest(err);
	return res.status(error.status).json({
		err: ErrorCodes.BAD_REQUEST,
		mess: error.message,
	});
};

export const internalServerError = (res: Response) => {
	const error = createHttpError.InternalServerError(
		'Somethings wrong please check the connection or data'
	);
	return res.status(error.status).json({
		err: ErrorCodes.INTERNAL_SERVER_ERROR,
		mess: error.message,
	});
};

export const handleUserNotFound = (res: Response) => {
	const httpError = createHttpError.Unauthorized('User not found');
	return res.status(httpError.status).json({
		err: ErrorCodes.USER_NOT_FOUND,
		mess: httpError.message,
	});
};

export const tooManyRequest = (res: Response) => {
	const httpError = createHttpError.RequestTimeout(
		'Too many request. Please try again!'
	);
	return res.status(httpError.status).json({
		err: ErrorCodes.REQUEST_ERROR,
		mess: httpError.message,
	});
};

export const isTFAEnable = (res: Response) => {
	const httpError = createHttpError.BadRequest(
		'Two factor authentication is not enabled for this user'
	);
	return res.status(httpError.status).json({
		err: 1,
		mess: httpError.message,
	});
};

export const isValidOTP = (res: Response) => {
	const httpError = createHttpError.BadRequest('Invalid OTP');
	return res.status(httpError.status).json({
		err: ErrorCodes.INVALID_OTP,
		mess: httpError.message,
	});
};

export const notFound = (res: Response) => {
	const error = createHttpError.NotFound('Undefined route');
	return res.status(error.status).json({
		err: ErrorCodes.UNDEFINED_ROUTE,
		mess: error.message,
	});
};

export const notAuth = (err: any, res: Response) => {
	const error = createHttpError.Unauthorized(err);
	return res.status(error.status).json({
		err: ErrorCodes.NOT_AUTH,
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
		err: isTokenExpired ? ErrorCodes.IS_EXPIRED : ErrorCodes.INVALID_TOKEN,
		mess: error.message,
	});
};

export const isValidTFAToken = (res: Response) => {
	const error = createHttpError.BadRequest(
		'Invalid two factor authentication token'
	);
	return res.status(error.status).json({
		err: 1,
		mess: error.message,
	});
};
