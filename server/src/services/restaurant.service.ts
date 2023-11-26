import jwt, { JwtPayload } from 'jsonwebtoken';
import queryData from '../helpers/sequelize-query.helpers';
import {
	IsPartnerRegisteredResponse,
	PartnerRegisterResponse,
	VerifyEmailResponse,
	emailVerifyGen,
	hashPassword,
	sendingMail,
} from '../utils';
import * as dotenv from 'dotenv';
import db from '../models';
import { ErrorCodes, Status } from '../enums';
import queueUtils from '../utils/queue.utils';
dotenv.config({ path: __dirname + '/.env' });

export const PartnerRegisterService = ({
	email,
	phoneNo,
	password,
	confirmPassword,
}: {
	email: string;
	phoneNo: string;
	password: string;
	confirmPassword: string;
}): Promise<PartnerRegisterResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const isUserExisted = await queryData.findOne(db.RestaurantAuth, {
				email: email,
			});
			// console.log(isUserExisted.password === password);

			if (
				isUserExisted.password === password ||
				isUserExisted.email === email
			) {
				return reject('This user is already registered');
			}

			// const isPasswordExisted = await queryData.findOne(db.RestaurantAuth, {
			// 	password: password,
			// });

			// console.log(isPasswordExisted);

			// if (isPasswordExisted) {
			// 	return reject('This password is already in use');
			// }

			if (password !== confirmPassword) {
				return reject('The password and confirm password do not match');
			}

			if (!isUserExisted) {
				const partnerData = await queryData.create(db.RestaurantAuth, {
					email: email,
					phoneNo,
					confirmPassword: confirmPassword,
					password: hashPassword(password),
				});
				console.log(partnerData);

				if (!partnerData) {
					return reject('User data is null');
				}

				const accessToken = partnerData
					? jwt.sign(
							{
								id: partnerData.id,
								email: partnerData.email,
							},
							process.env.JWT_SECRET as string,
							{ expiresIn: '24h' }
					  )
					: null;

				const refreshToken = partnerData
					? jwt.sign(
							{ id: partnerData.id },
							process.env.JWT_SECRET_REFRESH_TOKEN as string,
							{ expiresIn: '30d' }
					  )
					: null;

				queueUtils.addJob({
					name: 'Sending verification email',
					data: {
						from: process.env.EMAIL_ID,
						to: `${email}`,
						subject: `Verify your account`,
						html: emailVerifyGen({
							id: partnerData.id,
							email: partnerData.email,
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
					mess: 'You have registered successfully',
					accessToken: accessToken ? `Bearer ${accessToken}` : accessToken,
					refreshToken: refreshToken ? `Bearer ${refreshToken}` : refreshToken,
					sendingVerificationMail: accessToken ? mail : null,
					result: partnerData,
				});

				if (refreshToken) {
					await queryData.update(
						db.RestaurantAuth,
						{
							refreshToken: refreshToken,
						},
						{ id: partnerData.id }
					);
				}
			}
		} catch (error) {
			if (error instanceof Error)
				reject(
					`This error: ${error.name} may cause by this ${error.message}, ${error.stack}`
				);
		}
	});

export const EmailVerificationService = (
	partnerId: number,
	accessToken: any
): Promise<VerifyEmailResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			// Check if user is exist
			const partnerIsExisted = await queryData.findOne(db.RestaurantAuth, {
				id: partnerId,
			});

			if (!partnerIsExisted) {
				return reject('User not found please signup');
			}
			// User is existed
			if (partnerIsExisted) {
				//Check if token is valid ?
				const decodedToken = jwt.verify(
					accessToken,
					process.env.JWT_SECRET as string
				) as JwtPayload;

				const updatePartnerId = await queryData.findAndUpdate(
					db.RestaurantAuth,
					decodedToken,
					{
						id: partnerId,
					}
				);
				if (!updatePartnerId) {
					return reject('Invalid verification token');
				} else {
					if (partnerIsExisted.verificationStatus === Status.Verified) {
						return reject('Account already verified');
					} else {
						const updatedUserAccount = await queryData.update(
							db.RestaurantAuth,
							{
								verificationStatus: Status.Verified,
							},
							{ id: updatePartnerId.id }
						);
						if (!updatedUserAccount) {
							return reject('Please verified your email');
						} else {
							resolve({
								success: true,
								err: ErrorCodes.SUCCESS,
								mess: 'User email verified successfully',
							});
						}
					}
				}
			}
		} catch (error) {
			if (error instanceof Error)
				return reject(
					`This error: ${error.name} may cause by this ${error.message}, ${error.stack}`
				);
		}
	});

// Check registration status
export const IsPartnerService = ({
	partnerEmail,
}: {
	partnerEmail: string;
}): Promise<IsPartnerRegisteredResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			// Is already registered?
			const isPartnerRegistered = await queryData.findOne(db.RestaurantStatus, {
				partnerEmail: partnerEmail,
			});

			//console.log(isPartnerRegistered.email);

			if (isPartnerRegistered) {
				if (isPartnerRegistered.isPartner) {
					return reject(
						'You are already a partner with us. Thank you for your support!'
					);
				} else {
					resolve({
						success: true,
						isPartner: false,
						err: ErrorCodes.NOT_ALREADY_A_PARTNER,
						mess: 'You are not a partner yet.',
					});
				}
				await queryData.update(
					db.RestaurantStatus,
					{
						isPartner: true,
					},
					{ id: isPartnerRegistered.id }
				);
			} else {
				return reject("We can't find the email address in our database.");
			}
		} catch (error) {
			if (error instanceof Error)
				return reject(
					`This error: ${error.name} may cause by this ${error.message}, ${error.stack}`
				);
		}
	});
