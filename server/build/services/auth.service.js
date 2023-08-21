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
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.refreshToken = exports.login = exports.logout = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_query_helpers_1 = __importDefault(require("../helpers/sequelize-query.helpers"));
const dotenv = __importStar(require("dotenv"));
const mailing_utils_1 = require("../libs/utils/mailing.utils");
const mail_generator_utils_1 = require("../libs/utils/mail-generator.utils");
const compared_password_utils_1 = require("../libs/utils/compared-password.utils");
const hash_password_utils_1 = require("../libs/utils/hash-password.utils");
const check_tfa_enabled_utils_1 = require("../libs/utils/check-tfa-enabled.utils");
const generate_otp_utils_1 = require("../libs/utils/generate-otp.utils");
const verify_otp_utils_1 = require("../libs/utils/verify-otp.utils");
dotenv.config({ path: __dirname + '/.env' });
const register = ({ fullname, email, password, confirmpassword }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, otpData } = yield (0, generate_otp_utils_1.generateOTP)(email);
        const userData = yield sequelize_query_helpers_1.default.findOrCreateNewData({
            email,
            confirmpassword,
        }, { fullname, email, password: (0, hash_password_utils_1.hashPassword)(password) });
        const checkDuplicatedUsernameEmail = yield sequelize_query_helpers_1.default.findData({
            fullname,
        });
        const isDuplicatedUsernameEmail = userData && checkDuplicatedUsernameEmail;
        const accessToken = userData
            ? jsonwebtoken_1.default.sign({
                id: userData.id,
                email: userData.email,
                role_code: userData.role_code,
            }, process.env.JWT_SECRET, { expiresIn: '24h' })
            : null;
        const refreshToken = userData
            ? jsonwebtoken_1.default.sign({
                id: userData.id,
            }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' })
            : null;
        const mail = yield (0, mailing_utils_1.sendingMail)({
            from: process.env.EMAIL_ID,
            to: `${email}`,
            subject: 'Account verification',
            html: (0, mail_generator_utils_1.emailVerifyGen)({
                fullname,
                id: userData.id,
                accessToken,
            }),
        });
        // await queryData.updateData({ otpId: otpData.id }, { id: userData.id });
        // const otpMail = await sendingMail({
        // 	from: process.env.EMAIL_ID,
        // 	to: `${email}`,
        // 	subject: 'OTP verification',
        // 	html: sendOTPEmail(email, otp),
        // });
        resolve({
            err: userData ? 0 : 1,
            mess: userData
                ? 'Registered successfully'
                : isDuplicatedUsernameEmail
                    ? 'Full name is already taken'
                    : 'Email is already registered',
            'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
            'refresh token': refreshToken ? `Bearer ${refreshToken}` : refreshToken,
            'Sending mail': accessToken ? mail : null,
            // otpRequired: true,
            // otpEmail: email,
            // otpId: otpData.id,
        });
        if (refreshToken) {
            yield sequelize_query_helpers_1.default.updateData({ refreshToken: refreshToken }, { id: userData.id });
        }
        console.log(refreshToken);
    }
    catch (error) {
        reject(error);
    }
}));
exports.register = register;
const logout = (userId) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield sequelize_query_helpers_1.default.updateData({ refresh_token: null }, { id: userId });
        if (!updated) {
            resolve({
                err: 1,
                mess: 'Logout failed',
            });
        }
        return {
            err: 0,
            mess: 'Logout successfully',
        };
    }
    catch (error) {
        reject(error);
    }
}));
exports.logout = logout;
const login = ({ email, password, otp }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkEmailIsVerified = yield sequelize_query_helpers_1.default.findData({
            email,
        });
        const response = yield sequelize_query_helpers_1.default.findData({
            email,
        });
        const isChecked = response && (0, compared_password_utils_1.comparePassword)(password, response.password);
        const isTFAEnabled = response === null || response === void 0 ? void 0 : response.twoFactorEnabled;
        let isOTPVerified = false;
        let isTFAVerified = false;
        if (isTFAEnabled) {
            isTFAVerified = yield (0, check_tfa_enabled_utils_1.checkTFAEnabled)(email, otp);
        }
        else {
            const { otp, otpData } = yield (0, generate_otp_utils_1.generateOTP)(email);
            // await sendingMail({
            // 	from: process.env.EMAIL_ID,
            // 	to: `${email}`,
            // 	subject: 'Account verification',
            // 	html: sendOTPEmail({ email, otp }),
            // });
            isOTPVerified = yield (0, verify_otp_utils_1.verifyOTP)(email, otp);
        }
        if (!isOTPVerified && !isTFAVerified) {
            resolve({
                err: 1,
                mess: 'Invalid OTP or TFA token',
            });
        }
        const accessToken = isChecked
            ? jsonwebtoken_1.default.sign({
                id: response.id,
                email: response.email,
                role_code: response.role_code,
            }, process.env.JWT_SECRET, { expiresIn: '24h' })
            : null;
        const refreshToken = isChecked
            ? jsonwebtoken_1.default.sign({
                id: response.id,
            }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' })
            : null;
        if (refreshToken) {
            yield sequelize_query_helpers_1.default.updateTwoFactorSecret(refreshToken, email);
        }
        //check if user has already verified?
        if (response && (checkEmailIsVerified === null || checkEmailIsVerified === void 0 ? void 0 : checkEmailIsVerified.verificationStatus) === 'pending') {
            resolve({
                mess: 'Please verify your email before login',
            });
        }
        else {
            resolve({
                err: accessToken ? 0 : 1,
                mess: accessToken
                    ? 'Login successfully'
                    : response
                        ? 'Invalid password'
                        : 'Invalid email',
                'access token': accessToken ? `Bearer ${accessToken}` : accessToken,
                'refresh token': refreshToken
                    ? `Bearer ${refreshToken}`
                    : refreshToken,
            });
        }
        if (refreshToken) {
            yield sequelize_query_helpers_1.default.updateData({ refreshToken: refreshToken }, { id: response === null || response === void 0 ? void 0 : response.id });
        }
    }
    catch (error) {
        reject(error);
    }
}));
exports.login = login;
const refreshToken = (refresh_token) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield sequelize_query_helpers_1.default.findData({
            refreshToken: exports.refreshToken,
        });
        if (response) {
            jsonwebtoken_1.default.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
                if (err) {
                    resolve({
                        err: 1,
                        mess: 'Refresh token is expired, please login',
                    });
                }
                else {
                    const accessToken = jsonwebtoken_1.default.sign({
                        id: response.id,
                        email: response.email,
                        role_code: response.role_code,
                    }, process.env.JWT_SECRET, { expiresIn: '2d' });
                    resolve({
                        err: accessToken ? 0 : 1,
                        mess: accessToken
                            ? 'Token created successfully'
                            : 'Failed to generate new access token, please try again',
                        'access token': accessToken
                            ? `Bearer ${accessToken}`
                            : accessToken,
                        'refresh token': refresh_token,
                    });
                }
            });
        }
    }
    catch (error) {
        reject(error);
    }
}));
exports.refreshToken = refreshToken;
const verifyEmail = (userId, accessToken) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        debugger;
        const response = yield sequelize_query_helpers_1.default.findOldData(accessToken, {
            userId,
        });
        console.log(123, response);
        if (!response) {
            resolve({
                mess: 'Invalid verification token',
            });
        }
        else {
            const user = yield sequelize_query_helpers_1.default.findData({
                userId,
            });
            if (!user) {
                resolve({
                    mess: 'We were unable to find a user for this verification. Please signup',
                });
            }
            else if (user.verificationStatus === 'verified') {
                resolve({
                    mess: 'Your email has been already verified, now you can login',
                });
            }
            else {
                const updated = yield sequelize_query_helpers_1.default.updateData({ verificationStatus: 'verified' }, { id: response.id });
                console.log('adasd', updated);
                if (!updated) {
                    resolve({
                        mess: 'Please verified your email',
                    });
                }
                else {
                    resolve({
                        mess: 'User email verified successfully',
                    });
                }
            }
        }
    }
    catch (error) {
        reject(error);
    }
}));
exports.verifyEmail = verifyEmail;
const forgotPassword = (email) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield sequelize_query_helpers_1.default.findData({ email });
        if (!user) {
            resolve({
                mess: 'Email not found',
            });
        }
        else {
            const accessToken = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role_code: user.role_code,
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            const mail = yield (0, mailing_utils_1.sendingMail)({
                from: process.env.EMAIL_ID,
                to: `${email}`,
                subject: 'Reset password',
                html: (0, mail_generator_utils_1.resetPasswordGen)({
                    email,
                    id: user.id,
                    accessToken,
                }),
            });
            resolve({
                mess: 'Sending mail successfully',
                'Sending mail': accessToken ? mail : accessToken,
            });
        }
    }
    catch (error) {
        reject(error);
    }
}));
exports.forgotPassword = forgotPassword;
const resetPassword = (accessToken, id, { password, confirmpassword }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield sequelize_query_helpers_1.default.findOldData(accessToken, { id });
        if (!response) {
            resolve({
                mess: 'Invalid verification token',
            });
        }
        else {
            const user = yield sequelize_query_helpers_1.default.findData({
                id,
            });
            if (!user) {
                resolve({
                    mess: 'We were unable to find a user for this verification. Please signup',
                });
            }
            else {
                const updated = yield sequelize_query_helpers_1.default.updateData({
                    confirmpassword,
                    password: (0, hash_password_utils_1.hashPassword)(password),
                }, { id: response.id });
                resolve({
                    err: updated ? 0 : 1,
                    mess: updated
                        ? 'Reset your password successfully'
                        : "Invalid email or you haven't verified your email",
                });
            }
        }
    }
    catch (error) {
        reject(error);
    }
}));
exports.resetPassword = resetPassword;
