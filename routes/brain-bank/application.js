// external imports
const express = require("express");

// controllers
const otpRequest = require("@/controllers/brain-bank/OtpRequest.Controller");
const user = require("@/controllers/brain-bank/User.controller");
const bookRequest = require("@/controllers/brain-bank/BookRequest.controller");
const product = require("@/controllers/brain-bank/Product.Controller");
const library = require("@/controllers/brain-bank/Library.Controller");
const reviews = require("@/controllers/brain-bank/Review.Controller");
const reviewReplay = require("@/controllers/brain-bank/ReviewReplay.Controller");
const ratingSummary = require("@/controllers/brain-bank/RatingSummary.Controller");
const orderController = require("@/controllers/brain-bank/Order.Controller.js");

// declaration
const router = express.Router();

// otp request related routes
router.post("/otp/create", otpRequest.create);
router.patch("/otp/verify", otpRequest.verify);

// register routes
router.post("/auth/register", user.create);

// book request routes
router.get("/book-requests", bookRequest.getBookRequests);
router.post("/book-requests/create", bookRequest.create);
router.delete("/book-requests/:id", bookRequest.deleteBookRequest);

// product routes
router.get("/products", product.index);
router.get("/products/:id", product.show);
router.post("/products", product.store);
router.delete("/products/:id", product.destroy);

// library routes
router.get("/library", library.index);

// review routes
router.get("/reviews", reviews.index);
router.post("/reviews", reviews.store);
router.get("/products/:productId/reviews", reviews.productReview);

// review replay routes
router.post("/reviews/:reviewId/replays", reviewReplay.store);
router.patch("/reviews/replays/:id", reviewReplay.update);
router.delete("/reviews/replays/:id", reviewReplay.destroy);

// rating summary routes
router.get("/products/:productId/rating-summary", ratingSummary.index);

// orders routes
router.post("/orders", orderController.store);

// export route
module.exports = router;
