"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReviewReplay extends Model {
    static associate(models) {
      // define association here
      ReviewReplay.belongsTo(models.Review, {
        foreignKey: "reviewId",
        as: "review",
      });
    }
  }
  ReviewReplay.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      replay: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ReviewReplay",
    }
  );
  return ReviewReplay;
};
