import jwt from 'jsonwebtoken';

const verify = <T extends object>(token: string, secret: string): T => {
	return jwt.verify(token, secret) as T;
};

const sign = <T extends object>(payload: T, secret: string): string => {
	return jwt.sign(payload, secret);
};

export const MyJwt = {
	sign,
	verify,
};
