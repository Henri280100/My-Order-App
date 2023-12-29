'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BankInformation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			BankInformation.hasOne(models.DetailedInformationForm, {
				foreignKey: 'bankId',
			});
		}
	}
	BankInformation.init(
		{
			accountOwner: DataTypes.STRING,
			accountNo: DataTypes.INTEGER,
			bankName: DataTypes.STRING,
			bankBranches: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'BankInformation',
		}
	);
	return BankInformation;
};
