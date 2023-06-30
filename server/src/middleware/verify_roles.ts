import { NextFunction, Request, Response } from 'express';
import { notAuth } from './handle_errors';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const { role_code } = req.user;
	if (role_code !== 'RAD') return notAuth('Required role Admin', res);
	next();
};

export const isModeratorOrAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { role_code } = req.user;
	if (role_code !== 'RAD' && role_code !== 'RM')
		return notAuth('Required role Admin or Moderator', res);
	next();
};
