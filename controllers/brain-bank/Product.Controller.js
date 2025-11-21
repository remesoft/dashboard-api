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
        include: [
          {
            model: db.Image,
            as: "images",
          },
        ],
      });

      res.json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      next(createError(500, "Failed to retrieve products"));
    }
  },

  // ---------------------------------
  //        GET SINGLE PRODUCT
  // ---------------------------------
  show: async (req, res, next) => {
    try {
      const productId = req.params.id;
      if (!productId) return next(createError(400, "Product ID is required"));

      const product = await db.Product.findByPk(productId);

      if (!product) return next(createError(404, "Product not found"));

      res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to fetch product"));
    }
  },

  // ---------------------------------
  //        CREATE NEW PRODUCT
  // ---------------------------------
  store: async (req, res, next) => {
    try {
      const requestBody = req.body;
      // TODO: Add validations here

      const product = await db.Product.create(requestBody);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create product"));
    }
  },

  // ---------------------------------
  //        UPDATE PRODUCT
  // ---------------------------------
  update: async (req, res, next) => {
    try {
      const productId = req.params.id;
      if (!productId) return next(createError(400, "Product ID is required"));

      const product = await db.Product.findByPk(productId);
      if (!product) return next(createError(404, "Product not found"));

      const updatedProduct = await product.update(req.body);

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update product"));
    }
  },

  // ---------------------------------
  //        DELETE PRODUCT
  // ---------------------------------
  destroy: async (req, res, next) => {
    try {
      const productId = req.params.id;
      if (!productId) return next(createError(400, "Product ID is required"));

      const deleted = await db.Product.destroy({ where: { id: productId } });
      if (!deleted) return next(createError(404, "Product not found"));

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete product"));
    }
  },
};
