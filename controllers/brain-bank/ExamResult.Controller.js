// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        LIST ALL EXAM RESULTS
  // ---------------------------------
  index: async (req, res, next) => {
    try {
      const userId = req.user.id; // From auth middleware

      const examResults = await db.ExamResult.findAll({
        where: {
          userId,
          isDeleted: false,
        },
        order: [["createdAt", "DESC"]],
      });

      res.json({
        success: true,
        message: "Exam results retrieved successfully",
        data: examResults,
      });
    } catch (error) {
      console.log(error);
      next(createError(500, "Failed to retrieve exam results"));
    }
  },

  // ---------------------------------
  //        GET SINGLE EXAM RESULT
  // ---------------------------------
  show: async (req, res, next) => {
    try {
      console.log(req);

      //   const userId = req.user.id;
      //   const { id } = req.params;

      //   const examResult = await db.ExamResult.findOne({
      //     where: {
      //       id,
      //       userId,
      //       isDeleted: false,
      //     },
      //   });

      //   if (!examResult) {
      //     return next(createError(404, "Exam result not found"));
      //   }

      res.json({
        success: true,
        message: "Exam result retrieved successfully",
        // data: examResult,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to fetch exam result"));
    }
  },

  // ---------------------------------
  //        CREATE NEW EXAM RESULT
  // ---------------------------------
  store: async (req, res, next) => {
    try {
      console.log(req.body);
      //   const userId = req.user.id;
      //   const { groupId, correct, wrong, unanswered } = req.body;
      //   // Validate input
      //   if (
      //     !groupId ||
      //     correct === undefined ||
      //     wrong === undefined ||
      //     unanswered === undefined
      //   ) {
      //     return next(createError(400, "Missing required fields"));
      //   }
      //   // Create exam result
      //   const examResult = await db.ExamResult.create({
      //     userId,
      //     groupId,
      //     correct,
      //     wrong,
      //     unanswered,
      //     isDeleted: false,
      //   });
      res.status(201).json({
        success: true,
        message: "Exam result saved successfully",
        //   data: examResult,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create exam result"));
    }
  },

  // ---------------------------------
  //        UPDATE EXAM RESULT
  // ---------------------------------
  update: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { groupId, correct, wrong, unanswered } = req.body;

      // Find exam result
      const examResult = await db.ExamResult.findOne({
        where: { id, userId },
      });

      if (!examResult) {
        return next(createError(404, "Exam result not found"));
      }

      // Update fields
      const updates = {};
      if (groupId !== undefined) updates.groupId = groupId;
      if (correct !== undefined) updates.correct = correct;
      if (wrong !== undefined) updates.wrong = wrong;
      if (unanswered !== undefined) updates.unanswered = unanswered;

      await examResult.update(updates);

      res.json({
        success: true,
        message: "Exam result updated successfully",
        data: examResult,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update exam result"));
    }
  },

  // ---------------------------------
  //        DELETE EXAM RESULT
  // ---------------------------------
  destroy: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Find exam result
      const examResult = await db.ExamResult.findOne({
        where: { id, userId },
      });

      if (!examResult) {
        return next(createError(404, "Exam result not found"));
      }

      // Soft delete
      await examResult.update({ isDeleted: true });

      res.json({
        success: true,
        message: "Exam result deleted successfully",
        data: examResult,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete exam result"));
    }
  },

  // ---------------------------------
  //        GET EXAM RESULTS BY GROUP
  // ---------------------------------
  getByGroup: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      const examResults = await db.ExamResult.findAll({
        where: {
          userId,
          groupId,
          isDeleted: false,
        },
        order: [["createdAt", "DESC"]],
      });

      res.json({
        success: true,
        message: "Exam results retrieved successfully",
        data: examResults,
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to fetch exam results by group"));
    }
  },

  // ---------------------------------
  //        GET USER STATISTICS
  // ---------------------------------
  getStats: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const stats = await db.ExamResult.findAll({
        where: {
          userId,
          isDeleted: false,
        },
        attributes: [
          [db.sequelize.fn("COUNT", db.sequelize.col("id")), "totalExams"],
          [db.sequelize.fn("SUM", db.sequelize.col("correct")), "totalCorrect"],
          [db.sequelize.fn("SUM", db.sequelize.col("wrong")), "totalWrong"],
          [
            db.sequelize.fn("SUM", db.sequelize.col("unanswered")),
            "totalUnanswered",
          ],
        ],
        raw: true,
      });

      res.json({
        success: true,
        message: "Statistics retrieved successfully",
        data: stats[0] || {
          totalExams: 0,
          totalCorrect: 0,
          totalWrong: 0,
          totalUnanswered: 0,
        },
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to fetch statistics"));
    }
  },
};
