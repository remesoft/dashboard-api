const { validationResult } = require("express-validator");
const createError = require("http-errors");

// validation handler
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(createError(400, firstError.msg || "Validation failed"));
  }
  next();
};
