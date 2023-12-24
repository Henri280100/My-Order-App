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

const contactName = joi.string().min(3).label('contactName').max(30).required();
const storeName = joi.string().min(3).label('storeName').max(10).required();
const address = joi.string().min(3).label('address').max(50).required();
const city = joi.required();
const district = joi.string().min(3).label('district').max(5).required();
const wards = joi.string().min(3).label('wards').max(15).required();
const phoneNo = joi.string().custom((value, helpers) => {
	const phoneNumber = require('libphonenumber-js').parsePhoneNumberFromString(
		value,
		'ZZ'
	);
	if (!phoneNumber || !phoneNumber.isValid()) {
		return helpers.error('any.invalid');
	}
	return value;
}, 'Phone number format validation');

const businessCode = joi.required();
const kitchenImg = joi.required();
const menuImg = joi.required();
const storeImg = joi.required();
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
	kitchenImg,
	menuImg,
	contactName,
	storeName,
	address,
	city,
	district,
	wards,
	storeImg,
	phoneNo,
	businessCode,
};
