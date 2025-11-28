"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      // nullable now, global notifications won't have a userId
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      type: {
        type: Sequelize.STRING,
        defaultValue: "info",
      },

      target: {
        type: Sequelize.ENUM("personal", "global"),
        allowNull: false,
        defaultValue: "personal",
      },

      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      isSeen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      actionUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      meta: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Notifications");
  },
};

// TODO: Implement that for mysql.
// updatedAt: {
//   allowNull: false,
//   type: Sequelize.DATE,
//   defaultValue: Sequelize.literal(
//     "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
//   ),
// },
