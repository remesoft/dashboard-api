// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        GET EXTRA INFO
  // -----------------------------------------
  getExtra: async (req, res, next) => {
    try {
      // exarate extra id
      const extraId = req.params.id;
      if (!extraId) return next(createError(404, "Extra id not found"));

      // get data form database
      const extra = await db.Extra.findByPk(extraId);
      res.json(extra);
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to get extra information"));
    }
  },

  // ---------------------------------
  //       CREATE EXTRA INFO
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      // get data form url
      const { questionId, type, content } = req.body;
      if (!questionId) return next(createError(404, "Question Id not found"));

      // create new question
      await db.Extra.create({
        questionId: questionId,
        type: type,
        content: content,
      });

      // send response
      res.status(200).json({
        status: "success",
        message: "Extra created successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create Extra"));
    }
  },

  // ---------------------------------
  //        UPDATE EXTRA INFO
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      // get data form url
      const questionId = req.params.id;
      if (!questionId) return next(createError(404, "Question Id not found"));

      // check book existence
      const extra = await db.Extra.findOne({ where: { questionId } });
      if (!extra) return next(createError(404, "Extra not found"));

      //Update Extra info
      const { type, content } = req.body;
      if (type !== undefined) extra.type = type;
      if (content !== undefined) extra.content = content;
      await extra.save();

      // send response
      res.status(200).json({
        status: "success",
        message: "Extra updated successfully",
      });
    } catch (err) {
      next(createError(500, "Failed to create Extra"));
    }
  },

  // ---------------------------------
  //        DELETE EXTRA INFO
  // -----------------------------------------
  delete: async (req, res, next) => {
    try {
      // exarate extra id
      const extraId = req.params.id;
      if (!extraId) return next(createError(404, "Extra id not found"));

      // delete form database
      await db.Extra.destroy({ where: { id: extraId } });

      // send response
      res.status(200).json({
        status: "success",
        message: "Extra were deleted successfully.",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete Extra"));
    }
  },
};
