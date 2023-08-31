import { SequelizeHelper } from '../helpers/sequelize-query.helpers';
import db from '../models';

const dataHelper = new SequelizeHelper(db.User);

export const getOne = (userId: number) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await db.User.findOne({
				where: { id: userId },
				attributes: {
					exclude: [
						'password',
						'role_code',
						'createdAt',
						'updatedAt',
						'refresh_token',
					],
				},
				include: [
					{
						model: db.Role,
						as: 'roleData',
						attributes: ['id', 'code', 'value'],
					},
				],
			});
			resolve({
				err: response ? 0 : 1,
				mess: response ? 'Avaliable user' : 'Invalid user',
				userData: response,
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: 1,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});

export const getAllUser = () =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await dataHelper.findAll();
			resolve({
				err: response ? 0 : 1,
				mess: response
					? 'All users retrieved successfully'
					: 'No users found 😥',
				userData: response,
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: 1,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});

export const updateUser = (userId: number, userData: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await dataHelper.update(userData, {
				id: userId,
			});
			resolve({
				err: response ? 0 : 1,
				mess: response ? 'Update user success' : 'Update user failed',
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: 1,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});
