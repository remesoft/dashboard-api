"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // One product belongs to one category
      Product.belongsTo(models.ProductCategory, {
        foreignKey: "categoryId",
        as: "category",
      });

      // One product can have many images
      Product.hasMany(models.Image, {
        foreignKey: "productId",
        as: "images",
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },

      discountedPrice: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      additionalInfo: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
