import express from 'express';
import { Cookie } from 'express-session';

declare global {
	namespace Express {
		interface Request {
			user?: Record<any>;
		}

		interface Session {
			token?: string;
		}
	}
}

type FileNameCallback = (error: Error | null, filename: string) => void;
