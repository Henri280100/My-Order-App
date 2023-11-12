import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { notAuth, tokenIsExpired } from './handle-errors.middleware';

// This function will be used for check if user is Auth when access the protected resources
// such as admin or moderator
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	// Get access token from the req headers
	const token = req.headers.authorization;
	// If the access token is not present, return an error
	if (!token) return notAuth('Authorization is required', res);

	// Split the access token into the bearer token and the token itself
	// The second part the of the token is the payload
	const accessToken = token.split(' ')[1];

	// Verify the access token using JWT secret
	jwt.verify(accessToken, process.env.JWT_SECRET as string, (err, user) => {
		// if the access token is invalid, return an error response.
		if (err) {
			// check if the token is expired
			const isChecked = err instanceof TokenExpiredError;
			// If the token is expired, return an error
			// if (!isChecked)
			// 	return tokenIsExpired(
			// 		'Access token may be expired or invalid',
			// 		res,
			// 		isChecked
			// 	);

			if (err)
				return tokenIsExpired(
					'Access token is expired or invalid',
					res,
					isChecked
				);
		}
		req.user = user;

		next();
	});
};

export default verifyToken;
