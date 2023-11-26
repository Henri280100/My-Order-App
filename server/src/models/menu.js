'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Menu extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Menu.belongsTo(models.Restaurant, {
				foreignKey: 'restaurantId',
			});
		}
	}
	Menu.init(
		{
			name: DataTypes.STRING,
			description: DataTypes.STRING,
			price: DataTypes.STRING,
			menuImg: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Menu',
		}
	);
	return Menu;
};
