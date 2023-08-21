import { NextFunction, Request, Response } from 'express';
import { notAuth } from './handle-errors.middleware';
import { ROLES } from '../helpers/roles_enum.helpers';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const { role_code } = req.user;
	if (role_code !== ROLES.Admin) return notAuth('Required role Admin', res);
	next();
};

export const isModeratorOrAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { role_code } = req.user;
	if (role_code !== ROLES.Admin && role_code !== ROLES.Moderator)
		return notAuth('Required role Admin or Moderator', res);
	next();
};
