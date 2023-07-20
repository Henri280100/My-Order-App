import bycrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import db from '../models';
import jwt from 'jsonwebtoken';
import { sendingMail } from '../../helpers/mailing';
import { emailVerifyGen } from '../../helpers/mail.generator';

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
				where: { fullname },
				raw: true,
			});

			const isDuplicatedUsernameEmail =
				response[0] && checkDuplicatedUsernameEmail;

			const accessToken = response[1]
				? jwt.sign(
						{
							id: response[0].id,
							email: response[0].email,
							role_code: response[0].role_code,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn: '24h' }
				  )
				: null;

			const refreshToken = response[1]
				? jwt.sign(
						{
							id: response[0].id,
						},
						process.env.JWT_SECRET_REFRESH_TOKEN as string,
						{ expiresIn: '15d' }
				  )
				: null;

			// const responseMail = {
			// 	body: {
			// 		name: `${fullname}`,
			// 		intro: 'Welcome to Order app!',
			// 		action: {
			// 			instructions:
			// 				'To continue to complete your profile, please verify your account here',
			// 			button: {
			// 				color: '#22BC66',
			// 				text: 'Confirm your verification',
			// 				link: `http://localhost:3000/api/v1/auth/verify/${response[0].id}/${accessToken}`,
			// 			},
			// 		},
			// 	},
			// };

			const mail = await sendingMail({
				from: process.env.EMAIL_ID,
				to: `${email}`,
				subject: 'Account verification',
				html: emailVerifyGen({ fullname, id: response[0].id, accessToken }),
			});

			resolve({
				err: response[1] ? 0 : 1,
				mess: response[1]
					? 'Registered is successfully'
					: isDuplicatedUsernameEmail
					? 'Full name is already taken'
					: 'Email is already registered',
				'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
				'refresh token': refreshToken ? `Bearer ${refreshToken}` : refreshToken,
				'Sending mail': accessToken ? mail : accessToken,
			});

			if (refreshToken) {
				await db.User.update(
					{
						refresh_token: refreshToken,
					},
					{
						where: { id: response[0].id },
					}
				);
			}
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

			const accessToken = isChecked
				? jwt.sign(
						{
							id: response.id,
							email: response.email,
							role_code: response.role_code,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn: '24h' }
				  )
				: null;

			const refreshToken = isChecked
				? jwt.sign(
						{
							id: response.id,
						},
						process.env.JWT_SECRET_REFRESH_TOKEN as string,
						{ expiresIn: '15d' }
				  )
				: null;

			resolve({
				err: accessToken ? 0 : 1,
				mess: accessToken
					? 'Login successfully'
					: response
					? 'Password is incorrect'
					: 'Email not found',
				'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
				'refresh token': refreshToken ? `Bearer ${refreshToken}` : refreshToken,
			});

			if (refreshToken) {
				await db.User.update(
					{
						refresh_token: refreshToken,
					},
					{
						where: { id: response.id },
					}
				);
			}
		} catch (error) {
			if (error instanceof Error) reject(error);
		}
	});

export const refreshToken = (refresh_token: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await db.User.findOne({
				where: { refresh_token },
			});

			if (response) {
				jwt.verify(
					refresh_token,
					process.env.JWT_SECRET_REFRESH_TOKEN as string,
					(err: any) => {
						if (err) {
							resolve({
								err: 1,
								mess: 'Refresh token is expired, please login',
							});
						} else {
							const accessToken = jwt.sign(
								{
									id: response.id,
									email: response.email,
									role_code: response.role_code,
								},
								process.env.JWT_SECRET as string,
								{ expiresIn: '2d' }
							);
							resolve({
								err: accessToken ? 0 : 1,
								mess: accessToken
									? 'Token created successfully'
									: 'Failed to generate new access token, please try again',
								'access token': accessToken
									? `Bearer ${accessToken}`
									: accessToken,
								'refresh token': refresh_token,
							});
						}
					}
				);
			}
		} catch (error) {
			if (error instanceof Error) reject(error);
		}
	});

export const verifyEmail = (accessToken: any, userId: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const token = accessToken;

			const userToken = await db.User.findOne({
				token,
				where: {
					id: userId,
				},
			});

			console.log(userToken);

			if (!userToken) {
				reject({ mess: 'Your verification link' });
			} else {
				const user = await db.User.findOne({
					where: { id: userId },
					raw: true,
				});
				if (!user) {
					reject({
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else if (user.is_verified) {
					resolve({
						mess: 'User has been already verified',
					});
				} else {
					const updated = await db.User.update(
						{
							is_verified: true,
						},
						{
							where: {
								id: userToken.id,
							},
						}
					);
					if (!updated) {
						reject({ mess: 'Check again' });
					} else {
						resolve({ mess: 'Your account has been successfully verified' });
					}
				}
			}
		} catch (error) {
			if (error instanceof Error) reject(error);
		}
	});

// TODO: Create forgot password function
export const forgotPassword = ({
	token,
	email,
	password,
	confirmPassword,
}: any) =>
	new Promise(async (resolve, reject) => {
		try {
			// is valid email
			const userEmail = await db.User.findOne({
				where: {
					email,
				},
				raw: true,
			});
			// always return ok response to prevent email enumeration
			if (!userEmail) return;

			const accessToken = userEmail
				? jwt.sign(
						{
							id: userEmail.id,
							email: userEmail.email,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn: '24h' }
				  )
				: null;

			const refreshToken = userEmail
				? jwt.sign(
						{
							id: userEmail.id,
						},
						process.env.JWT_SECRET_REFRESH_TOKEN as string,
						{ expiresIn: '15d' }
				  )
				: null;
		} catch (error) {
			reject(error);
		}
	});
