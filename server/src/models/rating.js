'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Rating extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// Rating.belongsTo(models.Customers, {
			// 	foreignKey: 'customersId',
			// 	as: 'customersData',
			// });
			// Rating.belongsTo(models.Restaurant, {
			// 	foreignKey: 'restaurantId',
			// 	as: 'restaurantData',
			// });
		}
	}
	Rating.init(
		{
			reviewersName: DataTypes.STRING,
			rating: DataTypes.FLOAT,
			comments: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Rating',
		}
	);
	return Rating;
};
