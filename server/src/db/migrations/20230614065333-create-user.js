'use strict';
/** @type {import('sequelize-cli').Migration} */
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
				// unique: true,
				// validate: {
				// 	isFullName: true,
				// },
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
			is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
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
