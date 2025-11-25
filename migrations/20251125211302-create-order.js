"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerAddress: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      paymentMethod: {
        type: Sequelize.STRING,
        defaultValue: "bkash",
      },
      paymentStatus: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      orderStatus: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },

      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    await queryInterface.dropTable("Orders");
  },
};
