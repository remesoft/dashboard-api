// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // create group
  create: async (req, res, next) => {
    try {
      // get data form body
      const groupId = req.body.id;
      if (!groupId) next(createError(404, "Group ID not found"));

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
      next(createError(500, "Failed to create Question"));
    }
  },

  // update group
  update: async (req, res, next) => {
    // get data form url
    const questionId = req.params.id;
    if (!questionId) next(createError(404, "Question ID not found"));

    const question = await db.Question.findByPk(questionId);

    // if group not found in database
    if (!question) next(createError(404, "Question not found"));

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
  },

  // delete group
  delete: async (req, res, next) => {
    try {
      //   // get book id form request
      //   const groupId = req.params.id;
      //   // if group id not found
      //   if (!groupId) next(createError(404, "Group ID not found"));
      //   // delete form database
      //   await db.Group.destroy({ where: { id: groupId } });
      //   // send response
      //   res.status(200).json({
      //     status: "success",
      //     message: "Group were deleted successfully.",
      //   });
    } catch (err) {
      next(createError(500, "Failed to delete Group"));
    }
  },
};
