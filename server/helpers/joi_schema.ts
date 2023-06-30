import joi from 'joi';

export const email = joi
	.string()
	.pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'))
	.required();
export const password = joi.string().min(6).label('password').required();

export const fullname = joi
	.string()
	.min(3)
	.label('fullname')
	.max(30)
	.required();

export const confirmpassword = joi
	.any()
	.equal(joi.ref('password'))
	.required()
	.options({ messages: { 'any.only': '{{#label}} does not match' } });
