"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OtpRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OtpRequest.init(
    {
      phone: DataTypes.STRING,
      otp: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      attempts: DataTypes.INTEGER,
      maxAttempts: DataTypes.INTEGER,
      resendCount: DataTypes.INTEGER,
      isVerified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "OtpRequest",
    }
  );
  return OtpRequest;
};
