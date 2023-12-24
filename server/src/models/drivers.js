'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Drivers extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Drivers.belongsTo(models.Vehicles, {
				foreignKey: 'vehiclesTypes',
				targetKey: 'types',
				as: 'vehicleTypesData',
			});

			// Drivers.belongsTo(models.Rating, {
			// 	foreignKey: 'vehiclesTypes',
			// 	targetKey: 'types',
			// 	as: 'vehicleTypesData',
			// });
		}
	}
	Drivers.init(
		{
			name: DataTypes.STRING,
			phone: DataTypes.STRING,
			location: DataTypes.STRING,
			email: DataTypes.STRING,
			vehicleTypes: DataTypes.STRING,
			licensePlates: DataTypes.STRING,
			vehicleBrands: DataTypes.STRING,
			availability: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Drivers',
		}
	);
	return Drivers;
};
