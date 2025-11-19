// internal imports
const createError = require("http-errors");
const db = require("../../models");

const OtpRequest = db.OtpRequest;

module.exports = {
  // ---------------------------------
  //   CREATE NEW OTP REQUEST
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      const { phone } = req.body;
      if (!phone) return next(createError(400, "Phone number is required"));

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      const existing = await OtpRequest.findOne({
        where: { phone },
        order: [["createdAt", "DESC"]],
      });

      if (existing) {
        await existing.update({
          otp,
          expiresAt,
          attempts: 0,
          resendCount: (existing.resendCount || 0) + 1,
          isVerified: false,
        });
      } else {
        await OtpRequest.create({
          phone,
          otp,
          expiresAt,
          attempts: 0,
          maxAttempts: 3,
          resendCount: 0,
          isVerified: false,
        });
      }

      res.status(201).json({
        success: true,
        message: "OTP sent successfully",
        otp, // REMOVE THIS IN PRODUCTION
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to generate OTP"));
    }
  },

  // ---------------------------------
  //   VERIFY OTP
  // -----------------------------------------
  verify: async (req, res, next) => {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return next(createError(400, "Phone and OTP are required"));
      }

      const otpRequest = await OtpRequest.findOne({
        where: { phone },
        order: [["createdAt", "DESC"]],
      });

      if (!otpRequest) return next(createError(404, "OTP request not found"));

      // Check expiry
      if (otpRequest.expiresAt < new Date()) {
        return next(createError(410, "OTP expired"));
      }

      // Too many attempts
      if (otpRequest.attempts >= otpRequest.maxAttempts) {
        return next(createError(429, "Too many attempts. Request new OTP"));
      }

      // Incorrect OTP
      if (otpRequest.otp !== otp) {
        await otpRequest.update({
          attempts: otpRequest.attempts + 1,
        });
        return next(createError(400, "Incorrect OTP"));
      }

      // OTP Verified
      await otpRequest.update({
        isVerified: true,
        otp: null, // prevent reuse
        attempts: 0,
      });

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to verify OTP"));
    }
  },
};
