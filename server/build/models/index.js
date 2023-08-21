"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 'use strict';
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const databaseConnection = require('../config/database');
const basename = path_1.default.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/database.json')[env];
const dbHost = databaseConnection.host;
const dbUserName = databaseConnection.username;
const dbPassword = databaseConnection.password;
const database = databaseConnection.database;
const dbDialect = databaseConnection.dialect;
const sequelize = new sequelize_1.Sequelize(database, dbUserName, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
}
catch (error) {
    if (error instanceof Error)
        console.error('Unable to connect to the database:', error.message);
}
const db = { sequelize, Sequelize: sequelize_1.Sequelize };
try {
    fs_1.default.readdirSync(__dirname)
        .filter((file) => {
        return (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');
    })
        .forEach((file) => {
        const model = require(path_1.default.join(__dirname, file))(sequelize, sequelize_1.DataTypes);
        db[model.name] = model;
    });
}
catch (error) {
    if (error instanceof Error)
        console.log('Unable to read the data file', error.message);
}
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
exports.default = db;
