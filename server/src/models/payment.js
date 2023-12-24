'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Payment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Payment.belongsTo(models.Orders, {
				foreignKey: 'orderId',
				as: 'orderData',
			});

			Payment.belongsTo(models.Payment_Types, {
				foreignKey: 'paymentMethod',
				targetKey: 'methods',
				as: 'paymentMethodsData',
			});
		}
	}
	Payment.init(
		{
			orderId: DataTypes.INTEGER,
			paymentMethod: DataTypes.STRING,
			amount: DataTypes.DECIMAL(10, 2),
			status: DataTypes.STRING,
			paymentDate: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Payment',
		}
	);
	return Payment;
};
