// internal imports
const createError = require("http-errors");
const db = require("../../models");

const User = db.User;
const OtpRequest = db.OtpRequest;

module.exports = {
  // ---------------------------------
  //        GET USER BY ID
  // -----------------------------------------
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (!userId) return next(createError(400, "User ID is required"));

      const user = await User.findByPk(userId);
      if (!user) return next(createError(404, "User not found"));

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to retrieve user"));
    }
  },

  // ---------------------------------
  //        CREATE NEW USER
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      const { name, mobile } = req.body;

      // Validation
      if (!name) return next(createError(400, "Name is required"));
      if (!mobile) return next(createError(400, "Mobile number is required"));

      // Check OTP verification
      const otpRecord = await OtpRequest.findOne({
        where: { phone: mobile },
        order: [["createdAt", "DESC"]],
      });

      if (!otpRecord) {
        return next(createError(400, "Please verify OTP before registration"));
      }

      if (!otpRecord.isVerified) {
        return next(createError(400, "Phone number is not verified"));
      }

      // Create user
      const user = await User.create({
        name,
        mobile,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      console.log("CREATE USER ERROR:", err);
      next(createError(500, "Failed to create user"));
    }
  },

  // ---------------------------------
  //        UPDATE USER
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (!userId) return next(createError(400, "User ID is required"));

      const user = await User.findByPk(userId);
      if (!user) return next(createError(404, "User not found"));

      const { name, mobile, city, address } = req.body;

      if (name !== undefined) user.name = name;
      if (mobile !== undefined) user.mobile = mobile;
      if (city !== undefined) user.city = city;
      if (address !== undefined) user.address = address;

      await user.save();

      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: user,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update user"));
    }
  },

  // ---------------------------------
  //        DELETE USER
  // -----------------------------------------
  delete: async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (!userId) return next(createError(400, "User ID is required"));

      const rows = await User.destroy({ where: { id: userId } });

      if (rows === 0) return next(createError(404, "User not found"));

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete user"));
    }
  },
};
