// internal imports
// get data
const data = require("../../database/brain-bank/group.json");
const { generateBarcode } = require("../../utils");
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        GET GROUP
  // -----------------------------------------
  getGroup: (req, res, next) => {
    res.json(data);
  },

  // ---------------------------------
  //        CREATE NEW GROUP
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      // get body data
      const barcode = generateBarcode();
      const { chapterId } = req.body;

      // data validation
      if (!chapterId) return next(createError(404, "Book not found"));

      // Create new group
      await db.Group.create({
        name: "Untitled Group",
        barcode: barcode,
        chapterId: chapterId,
      });

      // send response
      res.status(200).json({
        status: "success",
        message: "Chapter created successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create Group"));
    }
  },

  // ---------------------------------
  //        UPDATE THE GROUP
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      const groupId = req.params.id ?? next(createError(404, "Book not found"));
      const group = await db.Group.findByPk(groupId);

      // if group not found in database
      if (!group) return next(createError(404, "Group not found"));

      // set data for update
      const { name } = req.body;
      if (name !== undefined) group.name = name;

      // update book record
      await group.save();

      // send response
      res.status(200).json({
        status: "success",
        message: "Group updated successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update Group"));
    }
  },

  // ---------------------------------
  //        DELETE THE GROUP
  // -----------------------------------------
  delete: async (req, res, next) => {
    try {
      // get book id form request
      const groupId = req.params.id;
      if (!groupId) return next(createError(404, "Group ID not found"));

      // delete form database
      await db.Group.destroy({ where: { id: groupId } });

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
