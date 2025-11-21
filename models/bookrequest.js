"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookRequest extends Model {
    static associate(models) {
      // define association here
      BookRequest.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  BookRequest.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BookRequest",
    }
  );
  return BookRequest;
};
