const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  // LIST ALL REVIEWS WITH PAGINATION
  // ---------------------------------
  index: async (req, res, next) => {
    try {
      // Get query params for pagination, with defaults
      const page = parseInt(req.query.page) || 1; // current page
      const limit = parseInt(req.query.limit) || 10; // items per page
      const offset = (page - 1) * limit;

      // Fetch reviews with limit & offset
      const { count, rows: reviews } = await db.Review.findAndCountAll({
        include: [
          { model: db.Product, as: "product" },
          {
            model: db.User,
            as: "user",
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      // Total pages
      const totalPages = Math.ceil(count / limit);
      res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully",
        data: reviews,
        pagination: {
          total: count,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.log(error);
      next(createError(500, "Failed to retrieve Reviews"));
    }
  },

  // ---------------------------------
  //        GET SINGLE REVIEW
  // ---------------------------------
  show: async (req, res, next) => {
    try {
      const reviewId = req.params.id;

      const review = await db.Review.findByPk(reviewId, {
        include: [
          { model: db.Product, as: "product" },
          {
            model: db.User,
            as: "user",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      if (!review) {
        return next(createError(404, "Review not found"));
      }

      res.status(200).json({
        success: true,
        message: "Review retrieved successfully",
        data: review,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to fetch Review"));
    }
  },

  // ---------------------------------
  //        CREATE NEW REVIEW
  // ---------------------------------
  store: async (req, res, next) => {
    try {
      const { productId, userId, rating, review } = req.body;

      const newReview = await db.Review.create({
        productId,
        userId,
        rating,
        review,
      });

      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: newReview,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create Review"));
    }
  },

  // ---------------------------------
  //        UPDATE REVIEW
  // ---------------------------------
  update: async (req, res, next) => {
    try {
      const reviewId = req.params.id;
      const { rating, review, status } = req.body;

      const existingReview = await db.Review.findByPk(reviewId);
      if (!existingReview) {
        return next(createError(404, "Review not found"));
      }

      await existingReview.update({
        rating: rating ?? existingReview.rating,
        review: review ?? existingReview.review,
        status: status ?? existingReview.status,
      });

      res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: existingReview,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update Review"));
    }
  },

  // ---------------------------------
  //        DELETE REVIEW
  // ---------------------------------
  destroy: async (req, res, next) => {
    try {
      const reviewId = req.params.id;

      const existingReview = await db.Review.findByPk(reviewId);
      if (!existingReview) {
        return next(createError(404, "Review not found"));
      }

      await existingReview.destroy();

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete Review"));
    }
  },

  // ---------------------------------
  //        Get Product Reviews
  // ---------------------------------
  productReview: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: reviews } = await db.Review.findAndCountAll({
        where: { productId },
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: db.ReviewReplay,
            as: "replies",
            attributes: ["id", "replay", "createdAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      res.status(200).json({
        success: true,
        message: "Product reviews retrieved successfully",
        data: reviews,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1,
        },
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to retrieve product reviews"));
    }
  },
};
