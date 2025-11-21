"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Images", [
      {
        path: "uploads/brain-bank/products/seeds-image-01.jpg",
        altText: "Brain Bank: Interactive MCQs",
        isPrimary: true,
        sortOrder: 1,
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Images", null, {});
  },
};
