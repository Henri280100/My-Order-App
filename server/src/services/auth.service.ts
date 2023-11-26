import {
	ForgotPasswordResponse,
	LoginResponse,
	LogoutResponse,
	RefreshTokenResponse,
	RegisterResponse,
	ResendEmailResponse,
	ResetPasswordResponse,
	VerifyEmailResponse,
	comparePassword,
	emailVerifyGen,
	hashPassword,
	resetPasswordGen,
	sendingMail,
} from '../utils';
import jwt from 'jsonwebtoken';
import queryData from '../helpers/sequelize-query.helpers';
import * as dotenv from 'dotenv';
import db from '../models';
import cloudinary from 'cloudinary';
import { ErrorCodes, Genders, ROLES, Status } from '../enums';
import splitTokenUtils from '../utils/split-token.utils';
import queueUtils from '../utils/queue.utils';

dotenv.config({ path: __dirname + '/.env' });
/**
 * This register function is for admin and user usage, not for restaurant and driver auth
 */
export const RegisterService = ({
	fullname,
	email,
	password,
	confirmpassword,
	genders,
	role_code,
}: {
	fullname: any;
	email: any;
	password: any;
	confirmpassword: any;
	genders: Genders.M | Genders.F | Genders.O;
	role_code: ROLES.Admin | ROLES.Moderator;
}): Promise<RegisterResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			let avatarUrl: string | undefined;
			if (genders === Genders.M) {
				avatarUrl = '../assets/user_ava/man_2.png';
			} else if (genders === Genders.F) {
				avatarUrl = '../assets/user_ava/woman_4.png';
			} else {
				avatarUrl = '../assets/user_ava/default_avatar.png';
			}

			const isUserExisted = await queryData.findOne(db.User, {
				fullname,
				email,
			});

			const userData = await queryData.findOrCreate(
				db.User,
				{
					email: email,
					confirmpassword: confirmpassword,
				},
				{
					fullname: fullname,
					email: email,
					password: hashPassword(password),
					avatar: avatarUrl,
					genders: genders,
					role_code: role_code ? role_code : ROLES.User,
				}
			);

			if (isUserExisted) {
				resolve({
					success: false,
					err: ErrorCodes.USER_IS_ALREADY_EXISTED,
					mess: 'User is already existed',
				});
			} else {
				const accessToken = userData
					? jwt.sign(
							{
								id: userData.id,
								email: userData.email,
								fullname: userData.fullname,
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
							{ expiresIn: '30d' }
					  )
					: null;

				if (
					userData.role_code === ROLES.Admin ||
					userData.role_code === ROLES.Moderator
				) {
					queueUtils.addJob({
						name: 'Sending an verification email',
						data: {
							from: process.env.EMAIL_ID,
							to: `${email}`,
							subject: 'Admin Account verification',
							html: emailVerifyGen({
								fullname,
								id: userData.id,
								accessToken,
							}),
						},
					});

					const mail = queueUtils.processJobs((job) => {
						sendingMail(job.data);
					});
					resolve({
						success: true,
						err: ErrorCodes.SUCCESS,
						mess: 'Registered successfully',
						accessToken: accessToken ? `Bearer ${accessToken}` : accessToken,
						refreshToken: refreshToken
							? `Bearer ${refreshToken}`
							: refreshToken,
						authSendingMail: accessToken ? mail : null,
						result: userData,
					});
				} else if (userData.role_code === ROLES.User) {
					queueUtils.addJob({
						name: 'Sending an verification email',
						data: {
							from: process.env.EMAIL_ID,
							to: `${email}`,
							subject: 'Account verification',
						},
					});
				}

				if (refreshToken) {
					await queryData.update(
						db.User,
						{ refresh_token: refreshToken },
						{ id: userData.id }
					);
				}
			}
		} catch (error) {
			if (error instanceof Error) throw new Error(`Error at ${error.message}`);
		}
	});

export const LogoutService = (userId: number): Promise<LogoutResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const numRowsUpdated = await queryData.update(
				db.User,
				{ refresh_token: null },
				{ id: userId }
			);

			if (!numRowsUpdated) {
				resolve({
					success: false,
					err: ErrorCodes.FAILED,
					mess: 'Logout failed',
				});
			}

			resolve({
				success: true,
				err: ErrorCodes.SUCCESS,
				mess: 'Logout successfully',
			});
		} catch (error) {
			if (error instanceof Error) throw new Error(`Error at ${error.message}`);
		}
	});

export const LoginService = ({
	email,
	password,
	rememberMe = false,
}: {
	email: any;
	password: any;
	rememberMe?: boolean;
}): Promise<LoginResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const [checkEmailIsVerified, response] = await Promise.all([
				await queryData.findOne(db.User, {
					email: email,
				}),
				await queryData.findOne(db.User, {
					email: email,
				}),
			]);

			const isChecked =
				response && comparePassword(password, response?.password);

			console.log(isChecked);

			const expiresIn = rememberMe ? '24h' : '30d';

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
			if (
				response?.verificationStatus &&
				checkEmailIsVerified?.verificationStatus === Status.Pending
			) {
				resolve({
					success: false,
					err: ErrorCodes.EMAIL_NOT_VERIFIED,
					mess: 'Please verify your email before login',
				});
			} else {
				resolve({
					success: accessToken ? true : false,
					err: accessToken ? ErrorCodes.SUCCESS : ErrorCodes.FAILED,
					mess: accessToken
						? 'Login successfully'
						: response
						? 'Invalid password'
						: 'Invalid email',
					accessToken: accessToken ? `Bearer ${accessToken}` : accessToken,
					refreshToken: refreshToken ? `Bearer ${refreshToken}` : refreshToken,
					result: response,
					headers: `Bearer ${accessToken}`,
				});
			}

			if (refreshToken) {
				await queryData.update(
					db.User,
					{ refresh_token: refreshToken },
					{ id: response?.id }
				);
			}
		} catch (error) {
			if (error instanceof Error) throw new Error(`Error at ${error.message}`);
		}
	});

export const RefreshTokenService = (
	refresh_token: string
): Promise<RefreshTokenResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findOne(db.User, {
				refresh_token: refresh_token,
			});

			if (response) {
				jwt.verify(
					refresh_token,
					process.env.JWT_SECRET_REFRESH_TOKEN as string,
					(err: any) => {
						if (err) {
							resolve({
								success: false,
								err: ErrorCodes.IS_EXPIRED,
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
								{ expiresIn: '24h' }
							);
							resolve({
								success: true,
								err: accessToken ? ErrorCodes.FAILED : ErrorCodes.SUCCESS,
								mess: accessToken
									? 'Token created successfully'
									: 'Failed to generate new access token, please try again',
								accessToken: accessToken
									? `Bearer ${accessToken}`
									: accessToken,
								refreshToken: refresh_token,
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
			const response = await queryData.findAndUpdate(db.User, accessToken, {
				id: userId,
			});

			if (!response) {
				resolve({
					success: false,
					err: ErrorCodes.INVALID_TOKEN,
					mess: 'Invalid verification token',
				});
			} else {
				const user = await queryData.findOne(db.User, {
					id: userId,
				});

				if (!user) {
					resolve({
						success: true,
						err: ErrorCodes.USER_NOT_FOUND,
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else if (user.verificationStatus === Status.Verified) {
					resolve({
						success: false,
						err: ErrorCodes.ACCOUNT_ALREADY_VERIFIED,
						mess: 'Your email has been already verified, now you can login',
					});
				} else {
					const updated = await queryData.update(
						db.User,
						{ verificationStatus: Status.Verified },
						{ id: response.id }
					);

					if (!updated) {
						resolve({
							success: false,
							err: ErrorCodes.EMAIL_NOT_VERIFIED,
							mess: 'Please verified your email',
						});
					} else {
						resolve({
							success: true,
							err: ErrorCodes.SUCCESS,
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

export const ResendVerificationEmail = ({
	email,
}: {
	email: string;
}): Promise<ResendEmailResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findOne(db.User, {
				email: email,
			});

			if (!response || response?.verificationStatus === Status.Verified) {
				resolve({
					success: false,
					err: ErrorCodes.FAILED,
					mess: 'Invalid email address or user has already been verified',
				});
			} else {
				const accessToken = jwt.sign(
					{
						id: response.id,
						email: response.email,
						role_code: response.role_code,
					},
					process.env.JWT_SECRET as string,
					{ expiresIn: '24h' }
				);

				queueUtils.addJob({
					name: 'Resend verification email',
					data: {
						from: process.env.EMAIL_ID,
						to: `${email}`,
						subject: 'Account verification',
						html: emailVerifyGen({
							fullname: response.fullname,
							id: response.id,
							accessToken: accessToken,
						}),
					},
				});

				const mail = queueUtils.processJobs((job) => {
					sendingMail(job.data);
				});

				resolve({
					success: true,
					err: ErrorCodes.SUCCESS,
					mess: 'Sending mail successfully',
					resendEmail: accessToken ? mail : null,
				});
			}
		} catch (error) {
			if (error instanceof Error) throw new Error(`Error at ${error.message}`);
		}
	});

export const ForgotPasswordService = ({
	email,
}: {
	email: string;
}): Promise<ForgotPasswordResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const user = await queryData.findOne(db.User, { email: email });

			if (!user) {
				resolve({
					success: false,
					err: ErrorCodes.EMAIL_NOT_FOUND,
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

				queueUtils.addJob({
					name: 'Sending an reset password email',
					data: {
						from: process.env.EMAIL_ID,
						to: `${email}`,
						subject: 'Reset password',
						html: resetPasswordGen({
							email,
							id: user.id,
							token: accessToken,
						}),
					},
				});

				const mail = queueUtils.processJobs((job) => {
					sendingMail(job.data);
				});

				resolve({
					success: true,
					err: ErrorCodes.SUCCESS,
					mess: 'Sending mail successfully',
					fpSendingMail: accessToken ? mail : null,
				});
			}
		} catch (error) {
			if (error instanceof Error) throw new Error(`Error at ${error.message}`);
		}
	});

export const ResetPasswordService = (
	accessToken: any,
	id: number,
	{ password, confirmpassword }: { password: string; confirmpassword: string }
): Promise<ResetPasswordResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await queryData.findAndUpdate(db.User, accessToken, {
				id: id,
			});

			if (!response) {
				resolve({
					success: false,
					err: ErrorCodes.INVALID_TOKEN,
					mess: 'Invalid verification token',
				});
			} else {
				const user = await queryData.findOne(db.User, {
					id: id,
				});
				if (!user) {
					resolve({
						success: false,
						err: ErrorCodes.USER_NOT_FOUND,
						mess: 'We were unable to find a user for this verification. Please signup',
					});
				} else {
					const updated = await queryData.update(
						db.User,
						{
							confirmpassword: confirmpassword,
							password: hashPassword(password),
						},
						{ id: response.id }
					);
					resolve({
						success: true,
						err: updated ? ErrorCodes.SUCCESS : ErrorCodes.FAILED,
						mess: updated
							? 'Reset your password successfully'
							: "Invalid email or you haven't verified your email",
					});
				}
			}
		} catch (error) {
			if (error instanceof Error) throw new Error(`Error at ${error.message}`);
		}
	});
