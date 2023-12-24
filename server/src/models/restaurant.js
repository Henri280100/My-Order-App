'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Restaurant extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Restaurant.hasMany(models.Menu, {
				foreignKey: 'restaurantId',
			});

			// Restaurant.belongsTo(models.Business, {
			// 	foreignKey: 'businessCode',
			// 	targetKey: 'code',
			// 	as: 'businessData',
			// });

			Restaurant.hasOne(models.PartnerInformation, {
				foreignKey: 'partnerId',
				as: 'partnerData',
			});

			Restaurant.belongsTo(models.Rating, {
				foreignKey: 'ratingId',
				targetKey: 'id',
				as: 'reviewsData',
			});
		}
	}
	Restaurant.init(
		{
			partnerId: DataTypes.INTEGER,
			name: DataTypes.STRING,
			address: DataTypes.STRING,
			city: DataTypes.STRING,
			district: DataTypes.STRING,
			wards: DataTypes.STRING,
			cuisine: DataTypes.STRING,
			statusOpen: DataTypes.INTEGER,
			branches: DataTypes.INTEGER,
			restaurantImg: DataTypes.STRING,
			ratingId: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: 'Restaurant',
		}
	);
	return Restaurant;
};
