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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const handle_errors_middleware_1 = require("./handle-errors.middleware");
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token)
        return (0, handle_errors_middleware_1.notAuth)('Authorization is required', res);
    const accessToken = token.split(' ')[1];
    jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const isChecked = err instanceof jsonwebtoken_1.TokenExpiredError;
            if (!isChecked)
                return (0, handle_errors_middleware_1.tokenIsExpired)('Access token may be expired or invalid', res, isChecked);
            if (err)
                return (0, handle_errors_middleware_1.tokenIsExpired)('Access token is expired or invalid', res, isChecked);
        }
        req.user = user;
        next();
    });
};
exports.default = verifyToken;
