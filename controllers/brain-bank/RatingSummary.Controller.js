// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        Rating summary
  // ---------------------------------
  index: async (req, res, next) => {
    try {
      const productId = req.params.productId;

      // Total reviews and average rating
      const totalReviews = await db.Review.count({ where: { productId } });

      const avgResult = await db.Review.findAll({
        where: { productId },
        attributes: [
          [db.Sequelize.fn("AVG", db.Sequelize.col("rating")), "average"],
        ],
        raw: true,
      });

      const averageRating = parseFloat(avgResult[0].average || 0).toFixed(1);

      // Distribution per star (optimized with GROUP BY)
      const distributionResults = await db.Review.findAll({
        where: { productId },
        attributes: [
          "rating",
          [db.Sequelize.fn("COUNT", db.Sequelize.col("rating")), "count"],
        ],
        group: ["rating"],
        raw: true,
      });

      // Convert to a 1–5 star map
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      distributionResults.forEach((row) => {
        distribution[row.rating] = parseInt(row.count);
      });

      // Send response
      res.status(200).json({
        success: true,
        message: "Rating summary retrieved successfully",
        data: {
          average: parseFloat(averageRating),
          total: totalReviews,
          distribution,
        },
      });
    } catch (error) {
      console.log(error);
      next(createError(500, "Failed to retrieve rating summary"));
    }
  },
};
