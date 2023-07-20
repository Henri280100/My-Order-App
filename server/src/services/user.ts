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
			console.log(222, response);
			resolve({
				err: response ? 0 : 1,
				mess: response ? 'Avaliable user' : 'Invalid user',
				userData: response,
			});
		} catch (error) {
			if (error instanceof Error) reject(error);
		}
	});
