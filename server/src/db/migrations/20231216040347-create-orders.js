'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Orders', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			customersId: {
				type: Sequelize.INTEGER,
			},
			restaurantId: {
				type: Sequelize.INTEGER,
			},
			orderTotal: {
				type: Sequelize.DECIMAL,
			},
			deliveryOptions: {
				type: Sequelize.STRING,
			},
			deliveryStatus: {
				type: Sequelize.STRING,
			},
			deliveryAddress: {
				type: Sequelize.STRING,
			},
			discountOffers: {
				type: Sequelize.STRING, 
			},
			orderDate: {
				type: Sequelize.DATE,
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
		await queryInterface.dropTable('Orders');
	},
};
