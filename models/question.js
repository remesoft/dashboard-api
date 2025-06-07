"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });

      // One-to-one: Question hasOne Extra
      Question.hasOne(models.Extra, {
        foreignKey: "questionId",
        as: "extra",
      });
    }
  }
  Question.init(
    {
      groupId: DataTypes.INTEGER,
      answer: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
