// external imports
const { check } = require("express-validator");
const createError = require("http-errors");

// internal imports
const db = require("../../models");

// check fields
module.exports = [
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a valid text value.")
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters."),

  check("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isNumeric()
    .withMessage("Salary must be a numeric value.")
    .isFloat({ min: 500, max: 20000 })
    .withMessage("Salary must be between 500 and 20,000."),

  check("prefer_gender")
    .notEmpty()
    .withMessage("Prefer gender is required")
    .isIn([1, 2, 3])
    .withMessage("Preferred gender must be Male, Female, or Any."),

  check("student_gender")
    .notEmpty()
    .withMessage("Student gender is required")
    .isIn([1, 2])
    .withMessage("Student gender must be Male or Female"),

  check("days")
    .notEmpty()
    .withMessage("Number of days is required.")
    .isNumeric()
    .withMessage("Days must be a numeric value.")
    .isFloat({ min: 1, max: 7 })
    .withMessage("Days must be between 1 and 7."),

  check("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isNumeric()
    .withMessage("Category must be a numeric value.")
    .custom(async (id) => {
      const record = await db.Category.findOne({ where: { id } });
      if (!record) throw createError(400, "Please select a valid category");
    }),

  check("course")
    .notEmpty()
    .withMessage("Course is required.")
    .isNumeric()
    .withMessage("Course must be a numeric value.")
    .custom(async (id, { req }) => {
      const category = req.body.category;
      const record = await db.Course.findOne({ where: { id } });
      if (!record || record.category != category) {
        throw createError(400, "Please select a valid course");
      }
    }),

  check("address")
    .notEmpty()
    .withMessage("Address is required.")
    .isString()
    .withMessage("Address must be a valid string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Address must be between 5 and 50 characters."),
];
