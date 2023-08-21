"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.resetPasswordCtrl = exports.forgotPasswordCtrl = exports.verificationCtrl = exports.logoutUserCtrl = exports.refreshTokenCtrl = exports.loginCtrl = exports.registerCtrl = void 0;
const services = __importStar(require("../services/index.service"));
const handle_errors_middleware_1 = require("../middleware/handle-errors.middleware");
const joi_schema_helpers_1 = require("../helpers/joi_schema.helpers");
const joi_1 = __importDefault(require("joi"));
const verify_otp_utils_1 = require("../libs/utils/verify-otp.utils");
const registerCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = joi_1.default
            .object({
            fullname: joi_schema_helpers_1.fullname,
            email: joi_schema_helpers_1.email,
            password: joi_schema_helpers_1.password,
            confirmpassword: joi_schema_helpers_1.confirmpassword,
        })
            .validate(req.body);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield services.register(req.body);
        return res.status(200).json(response);
    }
    catch (err) {
        return (0, handle_errors_middleware_1.internalServerError)(res);
    }
});
exports.registerCtrl = registerCtrl;
const loginCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = joi_1.default
            .object({ email: joi_schema_helpers_1.email, password: joi_schema_helpers_1.password, validateOTP: joi_schema_helpers_1.validateOTP })
            .validate(req.body);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield services.login(req.body);
        return res.status(200).json(response);
    }
    catch (err) {
        return (0, handle_errors_middleware_1.internalServerError)(res);
    }
});
exports.loginCtrl = loginCtrl;
const refreshTokenCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = joi_1.default.object({ validateRefreshToken: joi_schema_helpers_1.validateRefreshToken }).validate(req.body);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield services.refreshToken(req.body.refreshToken);
        return res.status(200).json(response);
    }
    catch (err) {
        return (0, handle_errors_middleware_1.internalServerError)(res);
    }
});
exports.refreshTokenCtrl = refreshTokenCtrl;
const logoutUserCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const result = yield services.logout(userId);
        return res.status(200).json(result);
    }
    catch (err) {
        return (0, handle_errors_middleware_1.internalServerError)(res);
    }
});
exports.logoutUserCtrl = logoutUserCtrl;
const verificationCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.accessToken;
        const id = req.params.id;
        const { error } = joi_1.default.object({ validateEmailVerification: joi_schema_helpers_1.validateEmailVerification }).validate(token);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield services.verifyEmail(id, token);
        console.log(response);
        return res.status(200).json(response);
    }
    catch (error) {
        return (0, handle_errors_middleware_1.internalServerError)(res);
    }
});
exports.verificationCtrl = verificationCtrl;
const forgotPasswordCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = joi_1.default.object({ email: joi_schema_helpers_1.email }).validate(req.body);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield services.forgotPassword(req.body.email);
        return res.status(200).json(response);
    }
    catch (error) {
        return (0, handle_errors_middleware_1.internalServerError)(res);
    }
});
exports.forgotPasswordCtrl = forgotPasswordCtrl;
const resetPasswordCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = joi_1.default
            .object({
            password: joi_schema_helpers_1.password,
            confirmpassword: joi_schema_helpers_1.confirmpassword,
        })
            .validate(req.body);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield services.resetPassword(req.params.accessToken, req.params.id, req.body);
        return res.status(200).json(response);
    }
    catch (error) { }
});
exports.resetPasswordCtrl = resetPasswordCtrl;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, secret_code } = req.body;
        const { error } = joi_1.default.object({ email, validateOTP: joi_schema_helpers_1.validateOTP }).validate(req.body);
        if (error)
            return (0, handle_errors_middleware_1.badRequest)(error.details[0].message, res);
        const response = yield (0, verify_otp_utils_1.verifyOTP)(email, secret_code);
        return res.status(200).json(response);
    }
    catch (error) { }
});
exports.verifyOtp = verifyOtp;
