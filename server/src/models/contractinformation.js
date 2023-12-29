'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ContractInformation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// ContractInformation.belongsTo(models.PartnerInformation, {
			// 	foreignKey: 'partnerInformationId',
			// });

			ContractInformation.hasOne(models.OwnerInformation, {
				foreignKey: 'idCard',
			});

			// ContractInformation.hasOne(models.DetailedInformationForm, {
			// 	foreignKey: 'cardId',
			// });
		}
	}
	ContractInformation.init(
		{
			fullname: DataTypes.STRING,
			idCard: DataTypes.INTEGER,
			dateOfIssue: DataTypes.STRING,
			permanentAddress: DataTypes.STRING,
			phoneNo: DataTypes.INTEGER,
			email: DataTypes.STRING,
			position: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'ContractInformation',
		}
	);
	return ContractInformation;
};
