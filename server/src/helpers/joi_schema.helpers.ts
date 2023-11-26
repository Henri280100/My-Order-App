import joi from 'joi';

const email = joi
	.string()
	.pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'))
	.required()
	.email();

const password = joi.string().min(6).label('password').required();

const fullname = joi.string().min(3).label('fullname').max(30).required();

const confirmPassword = joi
	.any()
	.equal(joi.ref('password'))
	.required()
	.options({ messages: { 'any.only': '{{#label}} does not match' } });

const confirmpassword = joi
	.any()
	.equal(joi.ref('password'))
	.required()
	.options({ messages: { 'any.only': '{{#label}} does not match' } });

const validateRefreshToken = joi.string().required();

const validateEmailVerification = joi.string().required().email();

const role_code = joi.string().required();

const avatar = joi.string();

export {
	email,
	fullname,
	password,
	confirmpassword,
	confirmPassword,
	validateEmailVerification,
	validateRefreshToken,
	role_code,
	avatar,
};
