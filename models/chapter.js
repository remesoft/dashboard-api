"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    static associate(models) {
      // define association here
      Chapter.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "book",
      });

      // Correct association to Group
      Chapter.hasMany(models.Group, {
        foreignKey: "chapterId",
        as: "groups",
        onDelete: "CASCADE",
      });
    }
  }
  Chapter.init(
    {
      bookId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Chapter",
    }
  );
  return Chapter;
};
