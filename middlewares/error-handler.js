// external import
const createError = require("http-errors");

// not found handler
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Not Found"));
};

// default error handler
const defaultErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

// export modules
module.exports = { notFoundHandler, defaultErrorHandler };
