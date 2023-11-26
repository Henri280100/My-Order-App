'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class RegisterStatus extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			RegisterStatus.belongsTo(models.RestaurantAuth, {
				foreignKey: 'restaurantAuthId',
				targetKey: 'email',
			});
		}
	}
	RegisterStatus.init(
		{
			partnerEmail: DataTypes.STRING,
			isPartner: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'RegisterStatus',
		}
	);
	return RegisterStatus;
};
