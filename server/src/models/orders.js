'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Orders extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Orders.belongsTo(models.Customers, {
				foreignKey: 'customersId',
				as: 'customersData',
			});
			Orders.belongsTo(models.Restaurant, {
				foreignKey: 'restaurantId',
				as: 'restaurantData',
			});

			Orders.belongsTo(models.Drivers, {
				foreignKey: 'driversId',
				as: 'driversData',
			});

			Orders.belongsTo(models.Discounts, {
				foreignKey: 'discountsOffers',
				targetKey: 'title',
				as: 'discountsData',
			});

			Orders.belongsTo(models.Delivery_Options, {
				foreignKey: 'deliveryOptions',
				targetKey: 'priorityName',
				as: 'deliveryOptionsData',
			});
		}
	}
	Orders.init(
		{
			customersId: DataTypes.INTEGER,
			restaurantId: DataTypes.INTEGER,
			driversId: DataTypes.INTEGER,
			orderTotal: DataTypes.DECIMAL(10, 2),
			deliveryOptions: DataTypes.STRING,
			deliveryStatus: DataTypes.STRING,
			deliveryAddress: DataTypes.STRING,
			discountOffers: DataTypes.STRING,
			OrdersSummary: DataTypes.STRING,
			orderDate: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Orders',
		}
	);
	return Orders;
};
