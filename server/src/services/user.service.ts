import { ErrorCodes } from '../enums/errors.enums';
import queryData from '../helpers/sequelize-query.helpers';
import db from '../models';

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
				err: response ? ErrorCodes.SUCCESS : ErrorCodes.USER_NOT_FOUND,
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
			const response = await queryData.findAll(db.User);
			resolve({
				err: response ? ErrorCodes.SUCCESS : ErrorCodes.USER_NOT_FOUND,
				mess: response
					? 'All users retrieved successfully'
					: 'No users found 😥',
				userData: response,
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: ErrorCodes.INTERNAL_SERVER_ERROR,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});

export const updateUser = (userId: number, userData: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.update(db.User, userData, {
				id: userId,
			});
			resolve({
				err: response ? ErrorCodes.SUCCESS : ErrorCodes.UPDATED_FAILED,
				mess: response ? 'Update user success' : 'Update user failed',
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: ErrorCodes.INTERNAL_SERVER_ERROR,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});

export const findUserById = (userId: number) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findById(db.User, userId);
			resolve({
				error: response ? ErrorCodes.SUCCESS : ErrorCodes.INVALID_ID,
				mess: response ? `Available user ${userId}` : 'Invalid user id!',
				userData: response,
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: ErrorCodes.INTERNAL_SERVER_ERROR,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});

export const deleteUserById = (userId: number) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.delete(db.User, userId);
			resolve({
				error: response ? ErrorCodes.SUCCESS : ErrorCodes.FAILED,
				mess: response
					? `Delete user ${userId} successfully`
					: 'Unable to delete user',
			});
		} catch (error) {
			if (error instanceof Error)
				reject({
					err: ErrorCodes.INTERNAL_SERVER_ERROR,
					mess: 'Internal server error',
					error: error.message,
				});
		}
	});
