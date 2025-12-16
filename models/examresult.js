"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamResult extends Model {
    static associate(models) {
      // ExamResult belongs to a User
      ExamResult.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // If you have a Group model
      ExamResult.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  ExamResult.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wrong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unanswered: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ExamResult",
      tableName: "ExamResults",
    }
  );

  return ExamResult;
};
