//(invalidate refresh token)

module.exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await User.update({ refreshToken: null }, { where: { refreshToken } });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
