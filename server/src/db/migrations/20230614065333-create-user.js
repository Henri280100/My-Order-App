'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
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
			rememberMe: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			genders: {
				type: Sequelize.STRING,
				defaultValue: 'Male' | 'Female' | '',
			},
			// secret_code: {
			// 	type: Sequelize.STRING,
			// 	allowNull: true,
			// },
			// twoFactorEnabled: {
			// 	type: Sequelize.BOOLEAN,
			// 	allowNull: false,
			// 	defaultValue: false,
			// },
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	},
};
