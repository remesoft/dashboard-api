// external imports
const express = require("express");
const router = express.Router();

// import routes
const brainBankRoutes = require("./brain-bank");

// routing setup
router.use("/brain-bank", brainBankRoutes);

// export route
module.exports = router;
