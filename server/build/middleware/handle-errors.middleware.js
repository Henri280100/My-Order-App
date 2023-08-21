"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTFAToken = exports.tokenIsExpired = exports.notAuth = exports.notFound = exports.isValidOTP = exports.isTFAEnable = exports.handleUserNotFound = exports.internalServerError = exports.badRequest = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const badRequest = (err, res) => {
    const error = http_errors_1.default.BadRequest(err);
    return res.status(error.status).json({
        err: 1,
        mess: error.message,
    });
};
exports.badRequest = badRequest;
const internalServerError = (res) => {
    const error = http_errors_1.default.InternalServerError('Somethings wrong please check the connection or data');
    return res.status(error.status).json({
        err: 1,
        mess: error.message,
    });
};
exports.internalServerError = internalServerError;
const handleUserNotFound = (req, res) => {
    const httpError = http_errors_1.default.Unauthorized('User not found');
    return res.status(httpError.status).json({
        err: 1,
        mess: httpError.message,
    });
};
exports.handleUserNotFound = handleUserNotFound;
const isTFAEnable = (req, res) => {
    const httpError = http_errors_1.default.BadRequest('Two factor authentication is not enabled for this user');
    return res.status(httpError.status).json({
        err: 1,
        mess: httpError.message,
    });
};
exports.isTFAEnable = isTFAEnable;
const isValidOTP = (req, res) => {
    const httpError = http_errors_1.default.BadRequest('Invalid OTP');
    return res.status(httpError.status).json({
        err: 1,
        mess: httpError.message,
    });
};
exports.isValidOTP = isValidOTP;
const notFound = (req, res) => {
    const error = http_errors_1.default.NotFound('Undefined route');
    return res.status(error.status).json({
        err: 1,
        mess: error.message,
    });
};
exports.notFound = notFound;
const notAuth = (err, res) => {
    const error = http_errors_1.default.Unauthorized(err);
    return res.status(error.status).json({
        err: 1,
        mess: error.message,
    });
};
exports.notAuth = notAuth;
const tokenIsExpired = (err, res, isTokenExpired) => {
    const error = http_errors_1.default.Unauthorized(err);
    return res.status(error.status).json({
        // 1: when the token is invalid
        // 2: when token is expired
        err: isTokenExpired ? 2 : 1,
        mess: error.message,
    });
};
exports.tokenIsExpired = tokenIsExpired;
const isValidTFAToken = (req, res) => {
    const error = http_errors_1.default.BadRequest('Invalid two factor authentication token');
    return res.status(error.status).json({
        err: 1,
        mess: error.message,
    });
};
exports.isValidTFAToken = isValidTFAToken;
