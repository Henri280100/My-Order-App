'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('ContractInformations', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			fullname: {
				type: Sequelize.STRING,
			},
			idCard: {
				type: Sequelize.INTEGER,
			},
			dateOfIssue: {
				type: Sequelize.STRING,
			},
			permanentAddress: {
				type: Sequelize.STRING,
			},
			phoneNo: {
				type: Sequelize.INTEGER,
			},
			email: {
				type: Sequelize.STRING,
			},
			position: {
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
		await queryInterface.dropTable('ContractInformations');
	},
};
