"use strict";
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
exports.verifyOTP = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const sequelize_query_helpers_1 = __importDefault(require("../../helpers/sequelize-query.helpers"));
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const otpRecord = yield sequelize_query_helpers_1.default.findTwoFactorSecret({
        email,
    });
    if (!otpRecord) {
        return false;
    }
    const isVerified = speakeasy_1.default.totp.verify({
        secret: otpRecord.secret,
        encoding: 'base32',
        digits: 6,
        step: 300,
        token: otp,
        window: 1,
    });
    return isVerified;
});
exports.verifyOTP = verifyOTP;
