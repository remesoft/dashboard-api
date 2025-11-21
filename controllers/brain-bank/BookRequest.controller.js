// internal imports
const createError = require("http-errors");
const db = require("../../models");
const { getBook } = require("./Book.Controller");

const User = db.User;
const BookRequest = db.BookRequest;

module.exports = {
  // ---------------------------------
  //        GET BOOK REQUESTS
  // -----------------------------------------
  getBookRequests: async (req, res, next) => {
    try {
      // Get all book requests
      const bookRequests = await BookRequest.findAll({});
      res.status(200).json({
        success: true,
        data: bookRequests,
      });
    } catch (err) {
      console.log("Get book requests:", err);
      next(createError(500, "Failed to retrieve book requests"));
    }
  },

  // ---------------------------------
  //        STORE BOOK REQUEST
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      const { userId, message } = req.body;

      // Validation
      if (!userId) return next(createError(400, "User ID is required"));
      if (!message) return next(createError(400, "Message is required"));

      // Create book request
      const bookRequest = await BookRequest.create({
        userId,
        message,
      });

      // Send response
      res.status(201).json({
        success: true,
        message: "Book request created successfully",
        data: bookRequest,
      });
    } catch (err) {
      console.log("Create book request:", err);
      next(createError(500, "Failed to create book request"));
    }
  },

  // ---------------------------------
  //        DELETE BOOK REQUEST
  // -----------------------------------------
  deleteBookRequest: async (req, res, next) => {
    try {
      // Get book request ID from params
      const bookRequestId = req.params.id;

      // Validation
      if (!bookRequestId) {
        return next(createError(400, "BookRequest ID is required"));
      }

      // Delete book request
      const rows = await BookRequest.destroy({ where: { id: bookRequestId } });
      if (rows === 0) return next(createError(404, "Book request not found"));

      // Send response
      res.status(200).json({
        status: "success",
        message: "Book request deleted successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete book request"));
    }
  },
};
