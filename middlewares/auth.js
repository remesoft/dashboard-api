// external imports
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// load secret key from env
const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";

// middleware function
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(createError(401, "Authorization header missing"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) return next(createError(401, "Token missing"));

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    next(createError(401, "Invalid or expired token"));
  }
};

module.exports = authMiddleware;
