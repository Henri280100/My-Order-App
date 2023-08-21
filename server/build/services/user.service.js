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
exports.getOne = void 0;
const models_1 = __importDefault(require("../models"));
const getOne = (userId) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield models_1.default.User.findOne({
            where: { id: userId },
            attributes: {
                exclude: [
                    'password',
                    'role_code',
                    'createdAt',
                    'updatedAt',
                    'refresh_token',
                ],
            },
            include: [
                {
                    model: models_1.default.Role,
                    as: 'roleData',
                    attributes: ['id', 'code', 'value'],
                },
            ],
        });
        console.log(222, response);
        resolve({
            err: response ? 0 : 1,
            mess: response ? 'Avaliable user' : 'Invalid user',
            userData: response,
        });
    }
    catch (error) {
        if (error instanceof Error)
            reject(error);
    }
}));
exports.getOne = getOne;
