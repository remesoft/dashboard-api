"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.BookRequest, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // required
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false, // required
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true, // optional
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true, // optional
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
