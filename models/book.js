"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.hasMany(models.Chapter, {
        foreignKey: "bookId",
        as: "chapters",
        onDelete: "CASCADE",
      });
    }
  }
  Book.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      isPublished: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
