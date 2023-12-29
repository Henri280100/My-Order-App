import { configDotenv } from 'dotenv';
import queryData from '../helpers/sequelize-query.helpers';
import db from '../models';
import { CustomersResponse } from '../utils';
configDotenv({ path: __dirname + '/.env' });

export const OnCreateRating = ({}: {}): Promise<CustomersResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const createRating = await queryData.create(db.Rating, {});
		} catch (error) {}
	});
