'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('RestaurantAuths', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: {
				type: Sequelize.STRING,
			},
			phoneNo: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			confirmPassword: {
				type: Sequelize.STRING,
			},
			refreshToken: { type: Sequelize.STRING },
			verificationStatus: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'pending',
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
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('RestaurantAuths');
	},
};
