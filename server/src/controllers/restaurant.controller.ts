import joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { badRequest, internalServerError } from '../middleware';
import {
	email,
	password,
	confirmPassword,
} from '../helpers/joi_schema.helpers';

import {
	EmailVerificationService,
	PartnerRegisterService,
} from '../services/restaurant.service';

export const partnerRegisterCtrl = async (req: Request, res: Response) => {
	try {
		const { error } = joi
			.object({
				email,
				phoneNo: joi.string().custom((value, helpers) => {
					const phoneNumber =
						require('libphonenumber-js').parsePhoneNumberFromString(
							value,
							'ZZ'
						);
					if (!phoneNumber || !phoneNumber.isValid()) {
						return helpers.error('any.invalid');
					}
					return value;
				}, 'Phone number format validation'),
				password,
				confirmPassword,
			})
			.validate(req.body);
		if (error) {
			return badRequest(error.details[0].message, res);
		}

		await PartnerRegisterService(req.body)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((err) => {
				return res.status(400).send(`${err}`);
			});
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).send({
				error: `Error at ${error.message}, ${error.name}, ${internalServerError(
					res
				)}`,
			});
		}
	}
};

export const verifyEmailCtrl = async (req: Request, res: Response) => {
	try {
		const { partnerId, accessToken } = req.body;

		await EmailVerificationService(partnerId, accessToken)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((err) => {
				return res.status(400).send(`${err}`);
			});
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).send({
				error: `Error at ${error.message}, ${error.name}, ${internalServerError(
					res
				)}`,
			});
		}
	}
};
