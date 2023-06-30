import bycrypt from 'bcrypt';
import * as dotenv from 'dotenv';

import db from '../models';
import jwt from 'jsonwebtoken';

dotenv.config({ path: __dirname + '/.env' });

const hashPassword = (password: any) =>
	bycrypt.hashSync(password, bycrypt.genSaltSync(8));

export const register = ({ fullname, email, password, confirmpassword }: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await db.User.findOrCreate({
				where: { email, confirmpassword },
				defaults: {
					fullname,
					email,
					password: hashPassword(password),
				},
			});

			const checkDuplicatedUsernameEmail = await db.User.findOne({
				where: { fullname: fullname },
				raw: true,
			});

			const isDuplicatedUsernameEmail =
				response[0] && checkDuplicatedUsernameEmail;

			const token = response[1]
				? jwt.sign(
						{
							id: response[0].id,
							email: response[0].email,
							role_code: response[0].role_code,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn: '5d' }
				  )
				: null;

			resolve({
				err: response[1] ? 0 : 1,
				mess: response[1]
					? 'Registered is successfuly'
					: isDuplicatedUsernameEmail
					? 'Fullname is already taken'
					: 'Email is already registered',
				'access token': token ? `Bearer ${token}` : token,
			});

			resolve({
				err: 0,
				mess: 'register service',
			});
		} catch (error) {
			if (error instanceof Error) reject(error);
		}
	});

export const login = ({ email, password }: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await db.User.findOne({
				where: { email },
				raw: true,
			});

			const isChecked =
				response && bycrypt.compareSync(password, response.password);
			const token = isChecked
				? jwt.sign(
						{
							id: response.id,
							email: response.email,
							role_code: response.role_code,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn: '5d' }
				  )
				: null;

			resolve({
				err: token ? 0 : 1,
				mess: token
					? 'Login successfuly'
					: response
					? 'Password incorrect'
					: 'Email not found',
				'access token': token ? `Bearer ${token}` : token,
			});

			resolve({
				err: 0,
				mess: 'register service',
			});
		} catch (error) {
			if (error instanceof Error) reject(error);
		}
	});
