"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert one sample product
    return queryInterface.bulkInsert(
      "Products",
      [
        {
          id: 1,
          name: "SEED : ICT Interactive MCQs",
          description: "Demo description for ICT Interactive MCQs application",
          price: 150.0,
          discountedPrice: 120.0,
          categoryId: 1,
          additionalInfo: JSON.stringify({
            videoLessons: "200+",
            audioLessons: "100+",
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Delete the seeded product
    return queryInterface.bulkDelete("Products", { id: 1 }, {});
  },
};
