'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Drivers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			phone: {
				type: Sequelize.STRING,
			},
			location: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			vehicleTypes: {
				type: Sequelize.STRING,
			},
			availability: {
				type: Sequelize.STRING,
				defaultValue: 'no available',
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
		await queryInterface.dropTable('Drivers');
	},
};
