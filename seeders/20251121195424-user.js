"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          mobile: "01712345678",
          city: "Dhaka",
          address: "Dhanmondi, Dhaka",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Alice Smith",
          mobile: "01887654321",
          city: "Chittagong",
          address: "Pahartali, Chittagong",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
