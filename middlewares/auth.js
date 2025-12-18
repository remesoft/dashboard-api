// external imports
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// load secret key from env - use ACCESS_TOKEN_SECRET for access tokens
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your_access_secret";

// middleware function
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(createError(401, "Authorization header missing"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createError(401, "Token missing"));
  }

  try {
    // Verify using the same secret that was used to sign the token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    return next(createError(401, "Invalid token"));
  }
};
