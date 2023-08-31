import jwt from 'jsonwebtoken';
import { SequelizeHelper } from '../helpers/sequelize-query.helpers';
import {
	ForgotPasswordResponse,
	LoginResponse,
	LogoutResponse,
	RefreshTokenResponse,
	RegisterResponse,
	ResetPasswordResponse,
	VerifyEmailResponse,
} from '../utils/response.utils';
import {
	emailVerifyGen,
	resetPasswordGen,
} from '../utils/mail-generator.utils';
import { hashPassword } from '../utils/hash-password.utils';
import { comparePassword } from '../utils/compared-password.utils';
import { sendingMail } from '../utils/mailing.utils';
import * as dotenv from 'dotenv';
import db from '../models';
dotenv.config({ path: __dirname + '/.env' });

const dataHelper = new SequelizeHelper(db.User);
export const RegisterService = ({
	fullname,
	email,
	password,
	confirmpassword,
	genders,
}: {
	fullname: string;
	email: string;
	password: string;
	confirmpassword: string;
	genders: 'Male' | 'Female' | '';
}): Promise<RegisterResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			let avatarUrl: string | undefined;
			if (genders === 'Male') {
				avatarUrl = '../assets/user_ava/man_2.png';
			} else if (genders === 'Female') {
				avatarUrl = '../assets/user_ava/woman_4.png';
			} else {
				avatarUrl = '../assets/user_ava/default_avatar.png';
			}

			const userData = await dataHelper.findOrCreate(
				{
					email: email,
					confirmpassword: confirmpassword,
				},
				{
					fullname: fullname,
					email: email,
					password: hashPassword(password),
					avatar: avatarUrl,
				}
			);

			const checkDuplicatedUsernameEmail = await dataHelper.findOne(
				{
					fullname: fullname,
				},
				['id', 'fullname']
			);

			const isDuplicatedUsernameEmail =
				userData && checkDuplicatedUsernameEmail;

			const accessToken = userData
				? jwt.sign(
						{
							id: userData.id,
							email: userData.email,
							role_code: userData.role_code,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn: '24h' }
				  )
				: null;

			const refreshToken = userData
				? jwt.sign(
						{
							id: userData.id,
						},
						process.env.JWT_SECRET_REFRESH_TOKEN as string,
						{ expiresIn: '15d' }
				  )
				: null;

			const mail = await sendingMail({
				from: process.env.EMAIL_ID,
				to: `${email}`,
				subject: 'Account verification',
				html: emailVerifyGen({
					fullname,
					id: userData.id,
					accessToken,
				}),
			});

			resolve({
				err: userData ? 0 : 1,
				mess: userData
					? 'Registered successfully'
					: isDuplicatedUsernameEmail
					? 'Full name is already taken'
					: 'Email is already registered',
				'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
				'refresh token': refreshToken ? `Bearer ${refreshToken}` : refreshToken,
				'Sending mail': accessToken ? mail : null,
			});

			if (refreshToken) {
				await dataHelper.update(
					{ refresh_token: refreshToken },
					{ id: userData.id }
				);
			}
		} catch (error) {
			reject(error);
		}
	});

export const LogoutService = (userId: number): Promise<LogoutResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const numRowsUpdated = await dataHelper.update(
				{ refresh_token: null },
				{ id: userId }
			);

			if (!numRowsUpdated) {
				resolve({
					err: 1,
					mess: 'Logout failed',
				});
			}

			resolve({
				err: 0,
				mess: 'Logout successfully',
			});
		} catch (error) {
			reject(error);
		}
	});

export const LoginService = ({
	email,
	password,
	rememberMe = false,
}: {
	email: string;
	password: string;
	rememberMe?: boolean;
}): Promise<LoginResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const [checkEmailIsVerified, response] = await Promise.all([
				dataHelper.findOne(
					{
						email: email,
					},
					['id', 'email', 'verificationStatus']
				),
				dataHelper.findOne(
					{
						email: email,
					},
					['id', 'email', 'password', 'confirmpassword']
				),
			]);

			const isChecked =
				response && comparePassword(password, response.password);

			const expiresIn = rememberMe ? '7d' : '24h';

			const accessToken = isChecked
				? jwt.sign(
						{
							id: response.id,
							email: response.email,
							role_code: response.role_code,
						},
						process.env.JWT_SECRET as string,
						{ expiresIn }
				  )
				: null;

			const refreshToken = isChecked
				? jwt.sign(
						{
							id: response.id,
						},
						process.env.JWT_SECRET_REFRESH_TOKEN as string,
						{ expiresIn }
				  )
				: null;

			//check if user has already verified?
			if (response && checkEmailIsVerified?.verificationStatus === 'pending') {
				resolve({
					success: false,
					err: 0,
					mess: 'Please verify your email before login',
				});
			} else {
				resolve({
					success: accessToken ? true : false,
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
				await dataHelper.update(
					{ refresh_token: refreshToken },
					{ id: response?.id }
				);
			}
		} catch (error) {
			reject(error);
		}
	});

export const RefreshTokenService = (
	refresh_token: string
): Promise<RefreshTokenResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await dataHelper.findOne(
				{
					refresh_token: refresh_token,
				},
				['id', 'refresh_token']
			);

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

export const VerifyEmailService = (
	userId: any,
	accessToken: any
): Promise<VerifyEmailResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await dataHelper.findAndUpdate(accessToken, {
				id: userId,
			});
			if (!response) {
				resolve({
					err: 0,
					mess: 'Invalid verification token',
				});
			} else {
				const user = await dataHelper.findOne(
					{
						id: userId,
					},
					['id']
				);

				if (!user) {
					resolve({
						err: 0,
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else if (user.verificationStatus === 'verified') {
					resolve({
						err: 0,
						mess: 'Your email has been already verified, now you can login',
					});
				} else {
					const updated = await dataHelper.update(
						{ verificationStatus: 'verified' },
						{ id: response.id }
					);

					if (!updated) {
						resolve({
							err: 0,
							mess: 'Please verified your email',
						});
					} else {
						resolve({
							err: 1,
							mess: 'User email verified successfully',
						});
					}
				}
			}
		} catch (error) {
			if (error instanceof Error)
				throw new Error(`Error at ${error.message}, ${reject(error)}`);
			// reject(error);
		}
	});

export const ForgotPasswordService = (
	email: string
): Promise<ForgotPasswordResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const user = await dataHelper.findOne({ email: email }, ['id', 'email']);

			if (!user) {
				resolve({
					err: 0,
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
					err: 1,
					mess: 'Sending mail successfully',
					'Sending mail': accessToken ? mail : null,
				});
			}
		} catch (error) {
			reject(error);
		}
	});

export const ResetPasswordService = (
	accessToken: any,
	id: number,
	{ password, confirmpassword }: { password: string; confirmpassword: string }
): Promise<ResetPasswordResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await dataHelper.findAndUpdate(accessToken, {
				id: id,
			});

			if (!response) {
				resolve({
					err: 1,
					mess: 'Invalid verification token',
				});
			} else {
				const user = await dataHelper.findOne(
					{
						id: id,
					},
					['id']
				);
				if (!user) {
					resolve({
						err: 1,
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else {
					const updated = await dataHelper.update(
						{
							confirmpassword: confirmpassword,
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
