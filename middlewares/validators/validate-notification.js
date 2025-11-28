const { body } = require("express-validator");
const handleValidationErrors = require("@/middlewares/validation-handler.js");

module.exports = [
  // Required title & message
  body("title").notEmpty().withMessage("Title is required"),
  body("message").notEmpty().withMessage("Message is required"),

  // Validate target type
  body("target")
    .notEmpty()
    .withMessage("target is required")
    .isIn(["personal", "global"])
    .withMessage("target must be either 'personal' or 'global'"),

  // Validate userId only when target = personal
  body("userId").optional().isInt().withMessage("userId must be an integer"),

  // Optional fields
  body("actionUrl")
    .optional()
    .isString()
    .withMessage("actionUrl must be a string"),

  // optional meta information
  body("meta").optional().isObject().withMessage("meta must be an object"),

  // Validation handler
  handleValidationErrors,
];
