'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('Users', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                fullname: {
                    type: Sequelize.STRING,
                },
                email: {
                    type: Sequelize.STRING,
                },
                password: {
                    type: Sequelize.STRING,
                },
                confirmpassword: {
                    type: Sequelize.STRING,
                },
                role_code: { type: Sequelize.STRING, defaultValue: 'RU' },
                avatar: { type: Sequelize.STRING },
                refresh_token: { type: Sequelize.STRING },
                verificationStatus: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'pending',
                },
                secret_code: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                twoFactorEnabled: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Users');
        });
    },
};
