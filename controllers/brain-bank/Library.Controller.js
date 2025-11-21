// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        LIST ALL PRODUCTS
  // ---------------------------------
  index: async (req, res, next) => {
    try {
      const products = await db.Product.findAll({
        attributes: ["id", "name"], // Only essential fields
        include: [
          {
            model: db.Image,
            as: "images",
            attributes: ["path"],
            where: { isPrimary: true }, // Only primary image
            required: false,
          },
        ],
      });

      const formatted = products.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.images?.[0]?.path || null,
      }));

      res.json({
        success: true,
        message: "Books retrieved successfully",
        data: formatted,
      });
    } catch (error) {
      next(createError(500, "Failed to retrieve products"));
    }
  },
};
