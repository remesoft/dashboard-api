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
      const bookId = req.body.bookId;
      if (!bookId) return next(createError(404, "Book ID not found"));

      // create new question
      const chapter = await db.Chapter.create({
        bookId: bookId,
        name: "Untitled",
      });

      // send response
      res.status(200).json(chapter);
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
      // get chapter id form request
      const chapterId = req.params.id;
      if (!chapterId) return next(createError(404, "Chapter Id not found"));

      // delete form database
      await db.Chapter.destroy({ where: { id: chapterId } });

      // send response
      res.status(200).json({
        status: "success",
        message: "Chapter were deleted successfully.",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete Group"));
    }
  },
};
