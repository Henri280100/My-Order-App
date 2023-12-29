'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class OwnerInformation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// OwnerInformation.belongsTo(models.PartnerInformation, {
			// 	foreignKey: 'partnerInformationId',
			// });
			OwnerInformation.hasOne(models.DetailedInformationForm, {
				foreignKey: 'ownerId',
			});

			OwnerInformation.belongsTo(models.ContractInformation, {
				foreignKey: 'idFrontFace',
				targetKey: 'id',
				as: 'contractData',
			});
		}
	}
	OwnerInformation.init(
		{
			idFrontFace: DataTypes.STRING,
			idBackFace: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'OwnerInformation',
		}
	);
	return OwnerInformation;
};
