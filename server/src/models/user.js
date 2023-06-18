'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// User.belongsToMany(models.Role, {
			// 	through: 'user_roles',
			// 	otherKey: 'roleId',
			// 	foreignKey: 'userId',
			// 	as: 'userData',
			// });
		}
	}
	User.init(
		{
			fullname: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			confirmpassword: DataTypes.STRING,
			avatar: DataTypes.STRING,
			role_code: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'User',
		}
	);
	return User;
};
