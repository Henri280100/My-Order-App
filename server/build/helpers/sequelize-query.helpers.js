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
const models_1 = __importDefault(require("../models"));
// class TwoFactorSecret
// 	extends Model<TwoFactorSecretAttributes>
// 	implements TwoFactorSecretAttributes
// {
// 	public id!: number;
// 	public email!: string;
// 	public secret!: string;
// 	public readonly createdAt!: Date;
// 	public readonly updatedAt!: Date;
// }
class SequelizeServiceHelper {
    findOrCreateNewData(whereClause, defaultsClause) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user, created] = yield models_1.default.User.findOrCreate({
                    where: whereClause,
                    defaults: defaultsClause,
                });
                return user.get({ plain: true });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.default.User.findAll();
            return users.map((user) => user.get({ plain: true }));
        });
    }
    findDataById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.default.User.findByPk(userId);
            if (!user) {
                return null;
            }
            return user.get({ plain: true });
        });
    }
    findData(whereClause) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.default.User.findOne({
                where: whereClause,
                include: [{ model: models_1.default.TwoFactorSecret }],
                raw: true,
            });
            if (!user) {
                return null;
            }
            return user;
        });
    }
    findOldData(oldData, whereClause) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.default.User.findOne({
                oldData,
                where: whereClause,
                raw: true,
            });
            // if (!user) {
            // 	return null;
            // }
            return user;
            // const updatedData = { ...user, ...oldData };
            // return updatedData;
        });
    }
    updateData(updateData, whereClause) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numRowsUpdated = yield models_1.default.User.update({ data: updateData }, {
                    where: whereClause,
                    returning: true,
                });
                return numRowsUpdated;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.default.User.findByPk(userId);
            if (!user) {
                return false;
            }
            yield (user === null || user === void 0 ? void 0 : user.destroy());
            return true;
        });
    }
    findTwoFactorSecret(whereClause) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield models_1.default.TwoFactorSecret.findOne({
                where: whereClause,
                raw: true,
            });
            if (!secret) {
                return null;
            }
            return secret;
        });
    }
    createTwoFactorSecret(whereClause) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSecret = yield models_1.default.TwoFactorSecret.create(whereClause);
            return newSecret.get({ plain: true });
        });
    }
    updateTwoFactorSecret(secret, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSecret = yield models_1.default.TwoFactorSecret.findOne({
                where: {
                    email,
                },
                raw: true,
            });
            if (!existingSecret)
                return null;
            yield existingSecret.update({ secret }, { where: { email } });
            return existingSecret.get({ plain: true });
        });
    }
    deleteTwoFactorSecret(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield models_1.default.TwoFactorSecret.findOne({
                where: { email },
            });
            if (!email)
                return false;
            if (secret !== null && secret !== undefined) {
                yield secret.destroy();
            }
            return true;
        });
    }
}
const queryData = new SequelizeServiceHelper();
exports.default = queryData;
