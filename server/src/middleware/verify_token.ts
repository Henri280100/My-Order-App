import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { notAuth, tokenIsExpired } from './handle_errors';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) return notAuth('Authorization is required', res);
	const accessToken = token.split(' ')[1];

	jwt.verify(accessToken, process.env.JWT_SECRET as string, (err, user) => {
		if (err) {
			const isChecked = err instanceof TokenExpiredError;
			if (!isChecked)
				return tokenIsExpired(
					'Access token may be expired or invalid',
					res,
					isChecked
				);

			if (err)
				return tokenIsExpired('Access token is expired or invalid', res, isChecked);
		}
		req.user = user;

		next();
	});
};

export default verifyToken;
