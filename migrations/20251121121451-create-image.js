"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      altText: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isPrimary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          // FK to Products table
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        // if product is deleted => delete images
        onDelete: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Images");
  },
};
