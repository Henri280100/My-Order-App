import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { notAuth } from './handle_errors';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) return notAuth('Authorization is required', res);
	const accessToken = token.split(' ')[1];

	jwt.verify(accessToken, process.env.JWT_SECRET as string, (err, user) => {
		if (err) return notAuth('Access token is expired or invalid', res);
		req.user = user;

		next();
	});
};

export default verifyToken;
