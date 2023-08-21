"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const comparePassword = (password, hashedPassword) => {
    try {
        const isMatch = bcrypt_1.default.compareSync(password, hashedPassword);
        return isMatch;
    }
    catch (error) {
        throw new Error('Error comparing passwords');
    }
};
exports.comparePassword = comparePassword;
