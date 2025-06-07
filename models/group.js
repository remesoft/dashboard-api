"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.Chapter, {
        foreignKey: "chapterId",
        as: "chapter",
      });

      // Correct: Group has many Questions
      Group.hasMany(models.Question, {
        foreignKey: "groupId",
        as: "questions",
      });
    }
  }

  Group.init(
    {
      chapterId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      barcode: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Group",
    }
  );

  return Group;
};
