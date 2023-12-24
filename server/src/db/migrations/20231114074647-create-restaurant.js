'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Restaurants', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			partnerId: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			address: {
				type: Sequelize.STRING,
			},
			city: {
				type: Sequelize.STRING,
			},
			district: {
				type: Sequelize.STRING,
			},
			wards: {
				type: Sequelize.STRING,
			},
			cuisine: {
				type: Sequelize.STRING,
			},
			statusOpen: {
				type: Sequelize.INTEGER,
			},
			branches: {
				type: Sequelize.INTEGER,
			},
			restaurantImg: {
				type: Sequelize.STRING,
			},
			rating: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
			reviewsId: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('Restaurants');
	},
};
