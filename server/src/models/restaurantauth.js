'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class RestaurantAuth extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// RestaurantAuth.belongsTo(models.PartnerInformation, {
			// 	foreignKey: 'phoneNo',
			// 	//as: 'partnerDetailData',
			// });
			// RestaurantAuth.hasOne(models.PartnerInformation, {
			// 	foreignKey: 'phoneNo',
			// });
		}
	}
	RestaurantAuth.init(
		{
			email: DataTypes.STRING,
			phoneNo: DataTypes.STRING,
			password: DataTypes.STRING,
			confirmPassword: DataTypes.STRING,
			refreshToken: DataTypes.STRING,
			verificationStatus: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'RestaurantAuth',
		}
	);
	return RestaurantAuth;
};
