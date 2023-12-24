import jwt, { JwtPayload } from 'jsonwebtoken';
import queryData from '../helpers/sequelize-query.helpers';
import {
	InfoResponse,
	GenerateToken,
	PartnerRegisterResponse,
	StoreDetailInfoResponse,
	VerifyEmailResponse,
	comparePassword,
	emailVerifyGen,
	generateUUID,
	hashPassword,
	sendingMail,
	LoginResponse,
} from '../utils';

import * as dotenv from 'dotenv';
import db from '../models';
import { ErrorCodes, ErrorMessage, Status } from '../enums';
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

			if (isUserExisted && comparePassword(password, isUserExisted.password)) {
				return reject('Password is already in use');
			} else if (isUserExisted) {
				return reject('Email is already in use');
			} else {
				const partnerData = await queryData.create(db.RestaurantAuth, {
					id: generateUUID(),
					email: email,
					phoneNo: phoneNo,
					password: hashPassword(password),
					confirmPassword: confirmPassword,
				});
				const accessToken = partnerData
					? GenerateToken(
							{
								id: partnerData.id,
								email: partnerData.email,
							},
							'24h'
					  )
					: null;

				const refreshToken = partnerData
					? GenerateToken({ id: partnerData.id }, '30d')
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
			return reject(error);
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

export const LoginService = ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<LoginResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const isLogin = await queryData.findOne(db.RestaurantAuth, {
				email,
				password,
			});

			const isChecked = isLogin && comparePassword(password, isLogin?.password);

			const accessToken = isChecked
				? GenerateToken({ id: isLogin.id, email: isLogin.email }, '24h')
				: null;

			const refreshToken = isChecked
				? GenerateToken({ id: isLogin.id }, '30d')
				: null;

			if (isLogin?.verificationStatus === Status.Pending) {
				return reject('Please verify your email address before login');
			} else {
				resolve({
					success: true,
					err: ErrorCodes.FAILED,
					mess: accessToken
						? 'Login successfully'
						: isLogin
						? 'Invalid password'
						: 'Invalid email',
					headers: `${accessToken}`,
				});
			}

			if (refreshToken) {
				await queryData.update(
					db.RestaurantAuth,
					{
						refreshToken: refreshToken,
					},
					{ id: isLogin?.id }
				);
			}
		} catch (error) {
			return reject(error);
		}
	});

export const StoreDetailInfoService = ({
	contactName,
	phoneNo,
	storeName,
	address,
	city,
	district,
	wards,
	storeImg,
	kitchenImg,
	menuImg,
	businessCode,
}: {
	contactName: string;
	phoneNo: string;
	storeName: string;
	address: string;
	city: string;
	district: string;
	wards: string;
	storeImg: any;
	kitchenImg: any;
	menuImg: any;
	businessCode: string;
}): Promise<StoreDetailInfoResponse> =>
	new Promise(async (resolve, reject) => {
		try {
			const checkIsPartnerCreated = await queryData.findOne(db.RestaurantAuth, {
				phoneNo,
			});

			if (!checkIsPartnerCreated) {
				return reject(
					'Please finish the first step to complete the assignment'
				);
			} else {
				const createStore = await queryData.create(db.PartnerInformation, {
					id: generateUUID(),
					contactName,
					phoneNo,
					storeName,
					address,
					city,
					district,
					wards,
					storeImg,
					kitchenImg,
					menuImg,
					businessCode,
				});

				if (createStore) {
					resolve({
						success: true,
						mess: 'You have successfully fill up your store information, please continue fill up your detail information',
						err: ErrorCodes.SUCCESS,
						result: createStore,
					});
				} else {
					return reject('Failed to create your information, please try again');
				}
			}
		} catch (error) {
			return reject(error);
		}
	});

// Next step to detail info
export const createDetailInfo = ({
	restaurantData: { name, ...restaurantInfoData },
	ownerData: { idFrontFaceUrl, idBackFaceUrl },
	contractData: { fullname, ...contractInfoData },
	bankData: { accountOwner, ...bankInfoData },
}: {
	restaurantData: { name: string };
	ownerData: { idFrontFaceUrl: string; idBackFaceUrl: string };
	contractData: { fullname: string };
	bankData: { accountOwner: string };
}): Promise<InfoResponse> =>
	new Promise(async (resolve, reject) => {
		try {

		} catch (error) {
			return reject(error);
		}
	});
