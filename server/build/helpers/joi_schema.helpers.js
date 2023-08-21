"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTP = exports.validateEmailVerification = exports.validateRefreshToken = exports.confirmpassword = exports.fullname = exports.password = exports.email = void 0;
const joi_1 = __importDefault(require("joi"));
exports.email = joi_1.default
    .string()
    .pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'))
    .required()
    .email();
exports.password = joi_1.default.string().min(6).label('password').required();
exports.fullname = joi_1.default
    .string()
    .min(3)
    .label('fullname')
    .max(30)
    .required();
exports.confirmpassword = joi_1.default
    .any()
    .equal(joi_1.default.ref('password'))
    .required()
    .options({ messages: { 'any.only': '{{#label}} does not match' } });
exports.validateRefreshToken = joi_1.default.string().required();
exports.validateEmailVerification = joi_1.default.string().required().email();
exports.validateOTP = joi_1.default.string().required();
