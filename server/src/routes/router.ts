import { Application } from 'express';
import auth from './auth.routes';
import user from './user.routes';
import customer from './customers.routes';
import restaurant from './restaurant.routes';
import { notFound } from '../middleware/handle-errors.middleware';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const routes = [
	{ path: '/api/v1/auth', router: auth },
	{ path: '/api/v1/user', router: user },
	{ path: '/api/v1/customers', router: customer },
	{ path: '/api/v1/restaurant', router: restaurant },
	{ path: '/', router: notFound },
];

const initRoutes = (app: Application) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(helmet());
	app.use(cors());

	// app.use('/api/v1/driver')
	// app.use('/api/v1/payment')
	// app.use('/api/v1/order')

	// app.use('/', notFound);

	routes.forEach((route) => {
		app.use(route.path, route.router);
	});
};

export default initRoutes;
