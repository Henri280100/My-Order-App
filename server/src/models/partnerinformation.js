'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PartnerInformation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			PartnerInformation.belongsTo(models.Business, {
				foreignKey: 'businessCode',
				targetKey: 'code',
				as: 'businessData',
			});

			PartnerInformation.hasOne(models.RestaurantAuth, {
				foreignKey: 'phoneNo',
			});
		}
	}
	PartnerInformation.init(
		{
			// restaurantId: DataTypes.INTEGER,
			contactName: DataTypes.STRING,
			phoneNo: DataTypes.STRING,
			storeName: DataTypes.STRING,
			address: DataTypes.STRING,
			city: DataTypes.STRING,
			district: DataTypes.STRING,
			wards: DataTypes.STRING,
			storeImg: DataTypes.STRING,
			kitchenImg: DataTypes.STRING,
			menuImg: DataTypes.STRING,
			businessCode: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'PartnerInformation',
		}
	);
	return PartnerInformation;
};
