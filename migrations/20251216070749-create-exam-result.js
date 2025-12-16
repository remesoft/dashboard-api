"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ExamResults", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      correct: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wrong: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unanswered: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    // Add indexes for better query performance
    await queryInterface.addIndex("ExamResults", ["userId", "groupId"], {
      name: "idx_user_group",
    });

    await queryInterface.addIndex("ExamResults", ["userId", "isDeleted"], {
      name: "idx_user_deleted",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ExamResults");
  },
};
