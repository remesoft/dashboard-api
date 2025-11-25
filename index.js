// external imports
require("dotenv").config();
require("module-alias/register");
const express = require("express");
const cors = require("cors");
const path = require("path");

// internal imports
const {
  defaultErrorHandler,
  notFoundHandler,
} = require("./middlewares/error-handler");
const routes = require("./routes");

// define app
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes setup
app.use("/", routes);

// error handlers
app.use(notFoundHandler);
app.use(defaultErrorHandler);

// listener...
app.listen(8080, () => {
  console.log("Server listening....");
});
