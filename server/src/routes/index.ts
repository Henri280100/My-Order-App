import { Application, NextFunction, Request, Response } from 'express';
import auth from './auth';
import user from './user';
import {
	internalServerError,
	notFound,
} from '../middleware/handle-errors.middleware';

const initRoutes = (app: Application) => {
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
		next();
	});

	
	app.use('/api/v1/auth', auth);
	app.use('/api/v1/user', user);

	app.use('/', notFound);
};

export default initRoutes;
