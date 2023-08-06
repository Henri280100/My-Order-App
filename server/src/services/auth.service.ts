import bycrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import db from '../models';
import jwt from 'jsonwebtoken';
import { sendingMail } from '../helpers/mailing';
import { emailVerifyGen, resetPasswordGen } from '../helpers/mail.generator';
import queryData from '../helpers/sequelize_query';

dotenv.config({ path: __dirname + '/.env' });

const hashPassword = (password: any) =>
	bycrypt.hashSync(password, bycrypt.genSaltSync(8));

export const register = ({ fullname, email, password, confirmpassword }: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findOrCreateNewData(
				{
					email,
					confirmpassword,
				},
				{ fullname, email, password: hashPassword(password) }
			);

			const checkDuplicatedUsernameEmail = await queryData.findData({
				fullname,
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

			const mail = await sendingMail({
				from: process.env.EMAIL_ID,
				to: `${email}`,
				subject: 'Account verification',
				html: emailVerifyGen({ fullname, id: response[0].id, accessToken }),
			});

			resolve({
				err: response[1] ? 0 : 1,
				mess: response[1]
					? 'Registered successfully'
					: isDuplicatedUsernameEmail
					? 'Full name is already taken'
					: 'Email is already registered',
				'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
				'refresh token': refreshToken ? `Bearer ${refreshToken}` : refreshToken,
				'Sending mail': accessToken ? mail : null,
			});

			if (refreshToken) {
				await queryData.updateData(
					{ refreshToken: refreshToken },
					{ id: response[0].id }
				);
			}
		} catch (error) {
			reject(error);
		}
	});

export const login = ({ email, password }: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const checkEmailIsVerified = await db.User.findOne({
				where: {
					email,
				},
			});

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

			//check if user has already verified?

			if (response && checkEmailIsVerified.verificationStatus === 'pending') {
				resolve({
					mess: 'Please verify your email before login',
				});
			} else {
				resolve({
					err: accessToken ? 0 : 1,
					mess: accessToken
						? 'Login successfully'
						: response
						? 'Invalid password'
						: 'Invalid email',
					'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
					'refresh token': refreshToken
						? `Bearer ${refreshToken}`
						: refreshToken,
				});
			}

			if (refreshToken) {
				await queryData.updateData(
					{ refreshToken: refreshToken },
					{ id: response.id }
				);
			}
		} catch (error) {
			reject(error);
		}
	});

export const refreshToken = (refresh_token: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findData({
				refreshToken,
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
			reject(error);
		}
	});

export const verifyEmail = (userId: any, accessToken: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findOldData(accessToken, { userId });

			if (!response) {
				resolve({
					mess: 'Invalid verification token',
				});
			} else {
				const user = await queryData.findData({
					userId,
				});
				if (!user) {
					resolve({
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else if (user.verificationStatus === 'verified') {
					resolve({
						mess: 'Your email has been already verified, now you can login',
					});
				} else {
					const updated = await queryData.updateData(
						{ verificationStatus: 'verified' },
						{ id: response.id }
					);
					if (!updated) {
						resolve({
							mess: 'Please verified your email',
						});
					} else {
						resolve({
							mess: 'User email verified successfully',
						});
					}
				}
			}
		} catch (error) {
			reject(error);
		}
	});

export const forgotPassword = (email: any) =>
	new Promise(async (resolve, reject) => {
		try {
			const user = await queryData.findData({ email });

			if (!user) {
				resolve({
					mess: 'Email not found',
				});
			} else {
				const accessToken = jwt.sign(
					{
						id: user.id,
						email: user.email,
						role_code: user.role_code,
					},
					process.env.JWT_SECRET as string,
					{ expiresIn: '24h' }
				);

				const mail = await sendingMail({
					from: process.env.EMAIL_ID,
					to: `${email}`,
					subject: 'Reset password',
					html: resetPasswordGen({
						email,
						id: user.id,
						accessToken,
					}),
				});

				resolve({
					mess: 'Sending mail successfully',
					'Sending mail': accessToken ? mail : accessToken,
				});
			}
		} catch (error) {
			reject(error);
		}
	});

export const resetPassword = (
	accessToken: any,
	id: any,
	{ password, confirmpassword }: any
) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findOldData(accessToken, { id });

			if (!response) {
				resolve({
					mess: 'Invalid verification token',
				});
			} else {
				const user = await queryData.findData({
					id,
				});
				if (!user) {
					resolve({
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else {
					const updated = await queryData.updateData(
						{
							confirmpassword,
							password: hashPassword(password),
						},
						{ id: response.id }
					);
					resolve({
						err: updated ? 0 : 1,
						mess: updated
							? 'Reset your password successfully'
							: "Invalid email or you haven't verified your email",
					});
				}
			}
		} catch (error) {
			reject(error);
		}
	});
