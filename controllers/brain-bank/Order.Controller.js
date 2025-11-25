"use strict";

// internal imports
const createError = require("http-errors");
const db = require("../../models");
const Order = db.Order;
const Product = db.Product;

module.exports = {
  // ---------------------------------
  // LIST ALL ORDERS
  // ---------------------------------
  index: async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "discountedPrice"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to retrieve orders"));
    }
  },

  // ---------------------------------
  // GET SINGLE ORDER
  // ---------------------------------
  show: async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "discountedPrice"],
          },
        ],
      });

      if (!order) {
        return next(createError(404, "Order not found"));
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to fetch order"));
    }
  },

  // ---------------------------------
  // CREATE NEW ORDER
  // ---------------------------------
  store: async (req, res, next) => {
    try {
      const {
        userId,
        productId,
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
        paymentMethod,
        quantity,
      } = req.body;

      // Validation
      if (
        !productId ||
        !customerName ||
        !customerPhone ||
        !customerCity ||
        !customerAddress ||
        !quantity
      ) {
        return next(createError(400, "Missing required fields"));
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return next(createError(404, "Product not found"));
      }

      const totalAmount = quantity * product.price;

      const order = await Order.create({
        userId: userId || null,
        productId,
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
        paymentMethod: paymentMethod || "bkash",
        paymentStatus: "pending",
        orderStatus: "pending",
        quantity,
        price: product.price,
        totalAmount,
      });

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to create order"));
    }
  },

  // ---------------------------------
  // UPDATE ORDER
  // ---------------------------------
  update: async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return next(createError(404, "Order not found"));
      }

      // Update only fields provided in req.body
      await order.update(req.body);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to update order"));
    }
  },

  // ---------------------------------
  // DELETE ORDER
  // ---------------------------------
  destroy: async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return next(createError(404, "Order not found"));
      }

      await order.destroy();

      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to delete order"));
    }
  },
};
