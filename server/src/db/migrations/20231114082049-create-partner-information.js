'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('PartnerInformations', {
			id: {
				allowNull: false,
				// autoIncrement: true,
				primaryKey: true,
				type: Sequelize.STRING,
			},
			// restaurantId: {
			// 	type: Sequelize.INTEGER,
			// },
			contactName: {
				type: Sequelize.STRING,
			},
			phoneNo: {
				type: Sequelize.STRING,
			},
			storeName: {
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
			storeImg: {
				type: Sequelize.STRING,
			},
			kitchenImg: {
				type: Sequelize.STRING,
			},
			menuImg: {
				type: Sequelize.STRING,
			},
			businessCode: {
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
		await queryInterface.dropTable('PartnerInformations');
	},
};
