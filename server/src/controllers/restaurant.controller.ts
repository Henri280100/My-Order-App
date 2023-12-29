import joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { badRequest } from '../middleware';
import {
	email,
	password,
	confirmPassword,
	storeImg,
	kitchenImg,
	menuImg,
	address,
	city,
	contactName,
	district,
	storeName,
	wards,
	phoneNo,
	businessCode,
	name,
	cuisine,
	statusOpen,
	branches,
	restaurantImg,
} from '../helpers/joi_schema.helpers';
import {
	CreateDetailInfo,
	EmailVerificationService,
	MerchantLoginService,
	OnCreateRestaurant,
	PartnerRegisterService,
	StoreDetailInfoService,
} from '../services/restaurant.service';

import {
	deleteImage,
	getResized,
	uploadToCloudinary,
} from '../utils/cloudinary.utils';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { LoginLimiter } from '../middleware/login-limiter.middleware';

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
});

const limiter = new RateLimiterMemory({
	points: 3,
	duration: 15 * 60,
});

const resendEmailLimiter = rateLimit({
	windowMs: 60000,
	max: 3,
	message: 'Too many requests. Please try again later.',
});

export const partnerRegisterCtrl = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { error } = joi
			.object({
				email,
				phoneNo,
				password,
				confirmPassword,
			})
			.validate(req.body);
		if (error) {
			return badRequest(error.details[0].message, res);
		}

		await PartnerRegisterService(req.body)
			.then((data) => {
				return res.status(200).json({ data });
			})
			.catch((err) => {
				return next(err);
			});
	} catch (error) {
		return res.status(400).json({ error: error });
	}
};

export const verifyEmailCtrl = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { partnerId, accessToken } = req.body;

		await EmailVerificationService(partnerId, accessToken)
			.then((data) => {
				return res.status(200).json({ data });
			})
			.catch((err) => {
				return next(err);
			});
	} catch (error) {
		return res.status(400).json({ error: error });
	}
};

export const resendEmail = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
	} catch (error) {}
};

export const merchantLoginCtrl = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		LoginLimiter(req, res, next);

		const { error } = joi.object({ email, password }).validate(req.body);

		if (error) {
			return badRequest(error.details[0].message, res);
		}

		await MerchantLoginService(req.body)
			.then((data) => {
				return res.status(200).json({ data });
			})
			.catch((err) => {
				return next(err);
			});
	} catch (error) {
		next(error);
	}
};

export const storeDetailInfoCtrl = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const fileData = req.files as {
			[fieldname: string]: Express.Multer.File[];
		};

		const { error } = joi
			.object({
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
			})
			.options({ allowUnknown: true })
			.validate({
				...req.body,
				storeImg: (fileData.storeImg || [])[0],
				kitchenImg: (fileData.kitchenImg || [])[0],
				menuImg: (fileData.menuImg || [])[0],
			});

		if (error) {
			return badRequest(error.details[0].message, res);
		}

		// Validate file types
		const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
		const invalidFiles = [];
		for (const file of fileData.storeImg) {
			if (!allowedFileTypes.includes(file.mimetype)) {
				invalidFiles.push(file.fieldname);
			}
		}
		for (const file of fileData.kitchenImg) {
			if (!allowedFileTypes.includes(file.mimetype)) {
				invalidFiles.push(file.fieldname);
			}
		}
		for (const file of fileData.menuImg) {
			if (!allowedFileTypes.includes(file.mimetype)) {
				invalidFiles.push(file.fieldname);
			}
		}

		if (invalidFiles.length > 0) {
			return badRequest(`Invalid file types: ${invalidFiles.join(', ')}`, res);
		}

		const [storeImgUrl, kitchenImgUrl, menuImgUrl] = await Promise.all([
			uploadToCloudinary((fileData.storeImg || [])[0]),
			uploadToCloudinary((fileData.kitchenImg || [])[0]),
			uploadToCloudinary((fileData.menuImg || [])[0]),
		]);

		await StoreDetailInfoService({
			...req.body,
			storeImg: getResized(storeImgUrl.secure_url),
			kitchenImg: getResized(kitchenImgUrl.secure_url),
			menuImg: getResized(menuImgUrl.secure_url),
		})
			.then((data) => {
				return res.status(200).json({
					data,
				});
			})
			.catch((err) => {
				return next(err);
			});
	} catch (error) {
		return next(error);
	}
};

export const restaurantCtrl = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const fileData = req.file;
	if (!fileData) {
		return res.status(404).send('Image not uploaded');
	}
	try {
		const { error } = joi
			.object({
				name,
				address,
				city,
				district,
				wards,
				cuisine,
				statusOpen,
				branches,
				restaurantImg,
			})
			.validate({ ...req.body, restaurantImg: fileData });

		if (error) {
			return badRequest(error.details[0].message, res);
		}

		const restaurantImgUrl = await uploadToCloudinary(fileData);

		await OnCreateRestaurant({
			...req.body,
			restaurantUrl: getResized(restaurantImgUrl.secure_url),
		})
			.then((data) => {
				return res.status(200).json({
					data,
				});
			})
			.catch((err) => {
				return next(err);
			});
	} catch (error) {
		return next(error);
	}
};

// export const createDetailedFormInfo = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const fileData = req.files as {
// 			[fieldname: string]: Express.Multer.File[];
// 		};
// 	} catch (error) {
// 		return next(error);
// 	}
// };
