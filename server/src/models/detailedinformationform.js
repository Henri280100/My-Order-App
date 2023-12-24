'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class DetailedInformationForm extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			DetailedInformationForm.belongsTo(models.Restaurant, {
				foreignKey: 'restaurantName',
				targetKey: 'name',
				as: 'restaurantData',
			});

			DetailedInformationForm.belongsTo(models.OwnerInformation, {
				foreignKey: 'ownerId',
				targetKey: 'id',
				as: 'ownerInformationData',
			});

			DetailedInformationForm.belongsTo(models.ContractInformation, {
				foreignKey: 'cardId',
				targetKey: 'idCard',
				as: 'cardInformationData',
			});

			DetailedInformationForm.belongsTo(models.BankInformation, {
				foreignKey: 'bankId',
				targetKey: 'accountOwner',
				as: 'bankInformationData',
			});
		}
	}
	DetailedInformationForm.init(
		{
			restaurantName: DataTypes.STRING,
			ownerId: DataTypes.INTEGER,
			cardId: DataTypes.INTEGER,
			bankId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'DetailedInformationForm',
		}
	);
	return DetailedInformationForm;
};
