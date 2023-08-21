"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 8;
const hashPassword = (password) => {
    const salt = bcrypt_1.default.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt_1.default.hashSync(password, salt);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
