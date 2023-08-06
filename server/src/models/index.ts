// 'use strict';
import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';

const databaseConnection = require('../config/database');

const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/database.json')[env];

const dbHost = databaseConnection.host;
const dbUserName = databaseConnection.username;
const dbPassword = databaseConnection.password;
const database = databaseConnection.database;
const dbDialect = databaseConnection.dialect;

const sequelize = new Sequelize(database, dbUserName, dbPassword, {
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
} catch (error) {
	if (error instanceof Error)
		console.error('Unable to connect to the database:', error.message);
}
const db: any = { sequelize, Sequelize };
try {
	fs.readdirSync(__dirname)
		.filter((file) => {
			return (
				file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
			);
		})
		.forEach((file) => {
			const model = require(path.join(__dirname, file))(sequelize, DataTypes);
			db[model.name] = model;
		});
} catch (error) {
	if (error instanceof Error)
		console.log('Unable to read the data file', error.message);
}

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

export default db;
