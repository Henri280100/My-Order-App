import { object, string } from 'zod';

export const loginSchema = object({
	email: string()
		.min(1, 'Please fill email address')
		.regex(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'))
		.email('Email is required'),
	password: string()
		.min(1, 'please fill password field')
		.min(6, 'Password must has 6 characters'),
});

export const registerSchema = object({
	fullname: string()
		.min(1, 'Please fill password')
		.min(3, 'Fullname must be more than 3 characters')
		.max(30, 'Fullname must be less than 32 characters'),

	email: string()
		.min(1, 'Email field is required')
		.regex(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'))
		.email('Email is required'),

	password: string()
		.min(1, 'please fill password field')
		.min(6, 'Password must has 6 characters'),

	confirmPassword: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
	path: ['confirmPassword'],
	message: 'Password does not match',
});
