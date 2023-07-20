import { Application, Request, Response } from 'express';
import auth from './auth';
import user from './user';
import { internalServerError, notFound } from '../middleware/handle_errors';

const initRoutes = (app: Application) => {
	app.use('/api/v1/auth', auth);
	app.use('/api/v1/user', user);

	app.use('/', notFound);
};

export default initRoutes;
