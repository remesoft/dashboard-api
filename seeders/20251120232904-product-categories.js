"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert default product categories
    return queryInterface.bulkInsert(
      "ProductCategories",
      [
        {
          id: 1,
          name: "Books",
          description: "Printed and digital books",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Delete all categories (rollback)
    return queryInterface.bulkDelete("ProductCategories", null, {});
  },
};
