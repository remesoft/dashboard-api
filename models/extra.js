"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Extra extends Model {
    static associate(models) {
      // define association here
      Extra.belongsTo(models.Question, {
        foreignKey: "questionId",
        as: "question",
      });
    }
  }
  Extra.init(
    {
      questionId: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      type: DataTypes.ENUM("video", "article"),
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Extra",
    }
  );
  return Extra;
};
