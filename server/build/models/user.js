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
            User.belongsTo(models.Role, {
                foreignKey: 'role_code',
                targetKey: 'code',
                as: 'roleData',
            });
            User.belongsTo(models.TwoFactorSecret, {
                foreignKey: 'email',
                sourceKey: 'email',
            });
        }
    }
    User.init({
        fullname: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        confirmpassword: DataTypes.STRING,
        avatar: DataTypes.STRING,
        role_code: DataTypes.STRING,
        secret_code: DataTypes.STRING,
        refresh_token: DataTypes.STRING,
        verificationStatus: DataTypes.STRING,
        twoFactorEnabled: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
