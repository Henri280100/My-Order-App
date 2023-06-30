import { Request, Response } from 'express';
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
