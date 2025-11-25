const express = require("express");
const router = express.Router();

// Import sub-routers
const applicationRoutes = require("./application");
const dashboardRoutes = require("./dashboard");

// handle sub-routes
router.use("/", applicationRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
