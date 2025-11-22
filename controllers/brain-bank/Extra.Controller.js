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
      const questionId = req.params.questionId;
      if (!questionId) return next(createError(404, "Question id not found!"));

      // get data form database
      const extra = await db.Extra.findOne({
        where: { questionId },
      });

      res.json(extra);
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to get extra information"));
    }
  },

  // ---------------------------------
  //       CREATE EXTRA INFO
  // -----------------------------------------
  createOrUpdate: async (req, res, next) => {
    try {
      const { questionId, type, content } = req.body;
      if (!questionId) return next(createError(400, "Question ID is required"));

      // Check if related question exists
      const question = await db.Question.findByPk(questionId);
      if (!question) {
        return next(createError(404, "Referenced question does not exist"));
      }

      // Either upsert or do find+update/create
      await db.Extra.upsert({ questionId, type, content });

      res.status(200).json({
        status: "success",
        message: "Extra created or updated successfully",
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to create or update Extra"));
    }
  },

  // ---------------------------------
  //        UPDATE EXTRA INFO
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      // get data form url
      const questionId = req.params.questionId;
      if (!questionId) return next(createError(404, "Question id not found"));

      // check book existence
      const extra = await db.Extra.findOne({
        where: { questionId: questionId },
      });
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
      const questionId = req.params.questionId;
      if (!questionId) return next(createError(404, "Extra not found"));

      // delete form database
      await db.Extra.destroy({ where: { questionId } });

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
