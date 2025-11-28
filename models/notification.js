"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification belongs to a User (optional)
      Notification.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "info",
      },
      target: {
        type: DataTypes.ENUM("personal", "global"),
        allowNull: false,
        defaultValue: "personal",
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSeen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );

  return Notification;
};
