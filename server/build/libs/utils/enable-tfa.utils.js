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
exports.enableTFA = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const sequelize_query_helpers_1 = __importDefault(require("../../helpers/sequelize-query.helpers"));
const enableTFA = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = speakeasy_1.default.generateSecret({ length: 20 }).base32;
    const user = yield sequelize_query_helpers_1.default.createTwoFactorSecret({ email, secret });
    yield sequelize_query_helpers_1.default.updateData({ twoFactorEnabled: true, secret_code: secret }, { email: user.email });
    return secret;
});
exports.enableTFA = enableTFA;
