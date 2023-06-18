import { Sequelize } from 'sequelize';
// import dbConfig from '../config/database';

const dbConfig = require('../config/database');

const sequelize = new Sequelize(
	dbConfig.database,
	dbConfig.username,
	dbConfig.password,
	{
		host: dbConfig.host,
		dialect: 'mysql',
		port: dbConfig.port
	}
);

const connectionDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully!');
	} catch (error: any) {
		if (error instanceof Error)
			console.error('Unable to connect to the database', error.message);
	}
};

connectionDB();