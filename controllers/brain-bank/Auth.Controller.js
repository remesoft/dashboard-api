// internal imports
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        REFRESH ACCESS TOKEN
  // ---------------------------------
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      // Validate refresh token presence
      if (!refreshToken) {
        return next(createError(401, "Refresh token missing"));
      }

      // Verify refresh token signature and expiration
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return next(
            createError(401, "Refresh token expired. Please login again.")
          );
        }
        return next(createError(401, "Invalid refresh token"));
      }

      console.log(decoded);

      // Check if user exists in database
      const user = await db.User.findOne({
        where: { id: decoded.userId },
        attributes: ["id", "email", "name", "role", "isActive"],
      });

      if (!user) {
        return next(createError(404, "User not found"));
      }

      // Check if user account is active
      if (!user.isActive) {
        return next(createError(403, "Account is deactivated"));
      }

      // Check if refresh token exists in database and is valid
      const storedToken = await db.RefreshToken.findOne({
        where: {
          token: refreshToken,
          userId: user.id,
          isRevoked: false,
        },
      });

      if (!storedToken) {
        return next(
          createError(401, "Refresh token not found or has been revoked")
        );
      }

      // Check if token is expired (additional database-level check)
      if (new Date() > new Date(storedToken.expiresAt)) {
        // Mark as revoked
        await storedToken.update({ isRevoked: true });
        return next(createError(401, "Refresh token expired"));
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "1m" }
      );

      // Generate new refresh token (token rotation for security)
      const newRefreshToken = jwt.sign(
        {
          userId: user.id,
          tokenVersion: Date.now(), // helps track token generations
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
      );

      // Calculate expiration date for new refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      // Revoke old refresh token
      await storedToken.update({ isRevoked: true });

      // Store new refresh token in database
      await db.RefreshToken.create({
        token: newRefreshToken,
        userId: user.id,
        expiresAt: expiresAt,
        isRevoked: false,
      });

      // Send response with new tokens
      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
    } catch (err) {
      console.error("Refresh token error:", err);
      return next(createError(500, "Failed to refresh token"));
    }
  },

  // ---------------------------------
  //        REVOKE REFRESH TOKEN
  // ---------------------------------
  revokeToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return next(createError(400, "Refresh token missing"));
      }

      // Find and revoke the token
      const token = await db.RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!token) {
        return next(createError(404, "Token not found"));
      }

      await token.update({ isRevoked: true });

      res.status(200).json({
        success: true,
        message: "Token revoked successfully",
      });
    } catch (err) {
      console.error("Revoke token error:", err);
      return next(createError(500, "Failed to revoke token"));
    }
  },

  // ---------------------------------
  //    REVOKE ALL USER TOKENS (Logout from all devices)
  // ---------------------------------
  revokeAllTokens: async (req, res, next) => {
    try {
      const userId = req.user.userId; // from auth middleware

      await db.RefreshToken.update(
        { isRevoked: true },
        {
          where: {
            userId: userId,
            isRevoked: false,
          },
        }
      );

      res.status(200).json({
        success: true,
        message: "All tokens revoked successfully",
      });
    } catch (err) {
      console.error("Revoke all tokens error:", err);
      return next(createError(500, "Failed to revoke tokens"));
    }
  },
};
