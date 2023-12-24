'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Delivery_Options extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Delivery_Options.init({
    priorityName: DataTypes.STRING,
    priorityTimes: DataTypes.STRING,
    prices: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Delivery_Options',
  });
  return Delivery_Options;
};