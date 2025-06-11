// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        CREATE NEW QUESTION
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      // get data form body
      const groupId = req.body.groupId;
      if (!groupId) return next(createError(404, "Group ID not found"));

      // create new question
      await db.Question.create({
        groupId: groupId,
        answer: 1,
      });

      // send response
      res.status(200).json({
        status: "success",
        message: "Question created successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create Question"));
    }
  },

  // ---------------------------------
  //        UPDATE THE QUESTIONS
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      // get data form url
      const questionId = req.params.id;
      if (!questionId) return next(createError(404, "Question ID not found"));

      // if group not found in database
      const question = await db.Question.findByPk(questionId);
      if (!question) return next(createError(404, "Question not found"));

      // set data for update
      const { answer } = req.body;
      if (answer !== undefined) question.answer = answer;

      // update book record
      await question.save();

      // send response
      res.status(200).json({
        status: "success",
        message: "Question updated successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create Question"));
    }
  },

  // ---------------------------------
  //        DELETE THE QUESTION
  // -----------------------------------------
  delete: async (req, res, next) => {
    try {
      // get book id form request
      const questionId = req.params.id;
      if (!questionId) return next(createError(404, "Question ID not found"));

      // delete form database
      await db.Question.destroy({ where: { id: questionId } });

      // send response
      res.status(200).json({
        status: "success",
        message: "Group were deleted successfully.",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete Group"));
    }
  },
};
