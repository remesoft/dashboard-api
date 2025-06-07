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
      questionId: DataTypes.INTEGER,
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
