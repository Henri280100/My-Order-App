import { NextFunction, Request, Response } from 'express';
import NodeCache from 'node-cache';
import { internalServerError } from './handle-errors.middleware';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.utils';

const cache = new NodeCache();
const config = {
	loginLimiter: {
		windowMs: 15 * 60 * 1000,
		max: 5,
		lockoutDuration: 15 * 60 * 1000,
	},
	generalLimiter: {
		windowMs: 15 * 60 * 1000,
		max: 100,
	},
};

export const LoginLimiter = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	const { windowMs, max, lockoutDuration } = config.loginLimiter;

	try {
		const failedAttempts = (cache.get(email) as number) || 0;
		if (failedAttempts >= max) {
			const remainingLockout = (cache.get(`${email}_lockout`) as number) || 0;
			if (remainingLockout > Date.now()) {
				return res
					.status(429)
					.json({ error: 'Too many requests. Account locked.' });
			} else {
				cache.del(`${email}_lockout`);
			}
		}
		next();
	} catch (error) {
		logger.error('Login limiter error:', error);
		return internalServerError(res);
	}
};

export const GeneralLimiter = rateLimit(config.generalLimiter);
