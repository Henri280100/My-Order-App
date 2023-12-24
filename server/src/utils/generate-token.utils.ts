import jwt, { JwtPayload } from 'jsonwebtoken';

export const GenerateToken = (payload: JwtPayload, expiresIn: string) => {
	return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
};
