// external import
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");

// internal imports
const books = require("../../database/brain-bank/books.json");
const { generateBarcode } = require("../../utils");
const db = require("../../models");

const UPLOAD_DIR = path.join(__dirname, "../../uploads/");

module.exports = {
  // ---------------------------------
  //        Get All Books
  // -----------------------------------------
  getBooks: (req, res, next) => {
    try {
      res.json(UPLOAD_DIR);
    } catch (err) {
      next(createError(500, "Failed to retrieve books"));
    }
  },

  // ---------------------------------
  //        Get Single Book
  // -----------------------------------------
  getBook: async (req, res, next) => {
    try {
      // get book id form url
      const bookId = req.params.id;
      if (!bookId) return next(createError(404, "Book id not found"));

      // check book existence
      const book = await db.Book.findOne({
        where: { id: bookId },
        include: [
          {
            model: db.Chapter,
            as: "chapters",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: db.Group,
                as: "groups",
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: db.Question,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    as: "questions",
                  },
                ],
              },
            ],
          },
        ],
      });
      if (!book) return next(createError(404, "Book not found"));

      // send response
      res.json(book);
    } catch (err) {
      next(createError(500, "Failed to retrieve book"));
    }
  },

  // ---------------------------------
  //        create new book
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      // generate barcode
      const barcode = generateBarcode();

      // 1. Create Book
      const book = await db.Book.create({ name: "Untitled" });

      // 2. Create Chapters for the Book
      const chapter = await db.Chapter.create({
        name: "Untitled Chapter 1",
        bookId: book.id,
      });

      // 3. Create Groups for a Chapter
      const group = await db.Group.create({
        name: "Untitled Group 1",
        barcode: barcode,
        chapterId: chapter.id,
      });

      res.status(201).json({
        status: "success",
        message: "New Book Created",
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Book creation failed"));
    }
  },

  // ---------------------------------
  //        update book
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      // get book id
      const bookId = req.params.id;
      if (!bookId) return next(createError(404, "Book id not found"));

      // check book existence
      const book = await db.Book.findOne({ where: { id: bookId } });
      if (!book) return next(createError(404, "Book not found"));

      const data = { ...req.body };
      if (req.file) {
        // Save new image path
        data.image = `/uploads/${req.file.filename}`;

        //Delete old image if it exists
        if (book.image) {
          const oldImagePath = path.join(UPLOAD_DIR, path.basename(book.image));
          console.log(oldImagePath);
          fs.access(oldImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Failed to delete old image:", err);
              });
            }
          });
        }
      }

      // update and response
      await book.update(data);
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  },

  // ---------------------------------
  //        delete book
  // -----------------------------------------
  delete: async (req, res, next) => {
    try {
      // get book id form request
      const bookId = req.params.id;
      if (!bookId) return next(createError(404, "Book not found"));

      // delete form database
      await db.Book.destroy({ where: { id: bookId } });

      // send response
      res.status(200).json({
        status: "success",
        message: "Book were deleted successfully.",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete book"));
    }
  },
};
