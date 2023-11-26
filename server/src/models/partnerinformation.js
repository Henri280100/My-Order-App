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
		}
	}
	PartnerInformation.init(
		{
			contactName: DataTypes.STRING,
			phoneNo: DataTypes.INTEGER,
			storeName: DataTypes.STRING,
			address: DataTypes.STRING,
			city: DataTypes.STRING,
			district: DataTypes.STRING,
			wards: DataTypes.STRING,
			storeImg: DataTypes.STRING,
			kitchenImg: DataTypes.STRING,
			menuImg: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'PartnerInformation',
		}
	);
	return PartnerInformation;
};
