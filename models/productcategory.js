"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      // One category has many products
      ProductCategory.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
      });
    }
  }

  ProductCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ProductCategory",
    }
  );

  return ProductCategory;
};
