// internal imports
const createError = require("http-errors");
const db = require("../../models");
const ReviewReplay = db.ReviewReplay;
const Review = db.Review;

module.exports = {
  // ---------------------------------
  //        CREATE NEW REPLAY
  // ---------------------------------
  store: async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { replay } = req.body;

      // Validate
      if (!replay) {
        return next(createError(400, "Replay message is required"));
      }

      // Check if review exists
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return next(createError(404, "Review not found"));
      }

      // Create replay
      const newReplay = await ReviewReplay.create({
        reviewId,
        replay,
      });

      res.status(201).json({
        success: true,
        message: "Replay created successfully",
        data: newReplay,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create replay"));
    }
  },

  // ---------------------------------
  //        UPDATE REPLAY
  // ---------------------------------
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { replay } = req.body;

      if (!replay) {
        return next(createError(400, "Replay message is required"));
      }

      const existingReplay = await ReviewReplay.findByPk(id);
      if (!existingReplay) {
        return next(createError(404, "Replay not found"));
      }

      await existingReplay.update({ replay });

      res.status(200).json({
        success: true,
        message: "Replay updated successfully",
        data: existingReplay,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update replay"));
    }
  },

  // ---------------------------------
  //        DELETE REPLAY
  // ---------------------------------
  destroy: async (req, res, next) => {
    try {
      const { id } = req.params;

      const replay = await ReviewReplay.findByPk(id);
      if (!replay) {
        return next(createError(404, "Replay not found"));
      }

      await replay.destroy();

      res.status(200).json({
        success: true,
        message: "Replay deleted successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete replay"));
    }
  },
};
