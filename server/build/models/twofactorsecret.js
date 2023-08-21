'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TwoFactorSecret extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // TwoFactorSecret.belongsTo(models.User, {
            // 	foreignKey: 'email',
            // 	targetKey: 'email',
            // 	as: 'user',
            // });
        }
    }
    TwoFactorSecret.init({
        email: DataTypes.STRING,
        secret: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'TwoFactorSecret',
    });
    return TwoFactorSecret;
};
