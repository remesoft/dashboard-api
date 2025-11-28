const { body, param, query } = require("express-validator");
const handleValidationErrors = require("@/middlewares/validation-handler.js");

module.exports = {
  // Validation for creating a new order
  storeOrder: [
    body("productId").notEmpty().withMessage("Product ID is required").isInt(),
    body("customerName").notEmpty().withMessage("Customer name is required"),
    body("customerPhone").notEmpty().withMessage("Customer phone is required"),
    body("customerCity").notEmpty().withMessage("Customer city is required"),
    body("customerAddress")
      .notEmpty()
      .withMessage("Customer address is required"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 }),
    body("paymentMethod").optional().isString(),
    body("userId").optional().isInt().withMessage("User ID must be an integer"),
    handleValidationErrors,
  ],

  // Validation for updating an order
  updateOrder: [
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("paymentStatus").optional().isIn(["pending", "paid", "failed"]),
    body("orderStatus")
      .optional()
      .isIn(["pending", "processing", "completed", "cancelled"]),
    handleValidationErrors,
  ],

  // Validation for fetching a single order
  showOrder: [
    param("id")
      .notEmpty()
      .withMessage("Order ID is required")
      .isInt()
      .withMessage("Order ID must be an integer"),
    handleValidationErrors,
  ],

  // Validation for fetching orders of a user
  userOrders: [
    param("userId")
      .notEmpty()
      .withMessage("User ID is required")
      .isInt()
      .withMessage("User ID must be an integer"),
    handleValidationErrors,
  ],

  // Example: Notification validation (conditional)
  createNotification: [
    body("title").notEmpty().withMessage("Title is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("target")
      .notEmpty()
      .withMessage("Target is required")
      .isIn(["personal", "global"])
      .withMessage("Target must be either 'personal' or 'global'"),
    body("userId")
      .if(body("target").equals("personal"))
      .notEmpty()
      .withMessage("userId is required for personal target")
      .isInt(),
    body("actionUrl").optional().isString(),
    body("meta").optional().isObject(),
    handleValidationErrors,
  ],
};
