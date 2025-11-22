"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Connect review to product
      Review.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

      // Optional: connect review to user
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // One to many relation
      Review.hasMany(models.ReviewReplay, {
        foreignKey: "reviewId",
        as: "replies",
        onDelete: "CASCADE",
      });
    }
  }

  Review.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "approved",
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );

  return Review;
};
