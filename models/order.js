"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Optional: If you have a Client model
      Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });

      // Optional: If you have a Product model
      Order.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  Order.init(
    {
      // user can checkout without account
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Customer snapshot fields
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerCity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      // Payment & status
      paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: "cash-on-delivery",
      },
      paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      orderStatus: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },

      // Financial
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
