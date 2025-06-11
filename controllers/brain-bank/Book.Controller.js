// internal imports
const book = require("../../database/brain-bank/book.json");
const books = require("../../database/brain-bank/books.json");
const createError = require("http-errors");
const { generateBarcode } = require("../../utils");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        Get All Books
  // -----------------------------------------
  getBooks: (req, res, next) => {
    try {
      res.json(books);
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
        attributes: { exclude: ["createdAt", "updatedAt"] },
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
  //        delete book
  // -----------------------------------------
  update: async (req, res, next) => {
    try {
      // get book id form url
      const bookId = req.params.id;
      if (!bookId) return next(createError(404, "Book id not found"));

      // check book existence
      const book = await db.Book.findByPk(bookId);
      if (!book) return next(createError(404, "Book not found"));

      // set data for update
      const { name, image, isPublished } = req.body;
      if (name !== undefined) book.name = name;
      if (image !== undefined) book.image = image;
      if (isPublished !== undefined) book.isPublished = isPublished;

      // update book record
      await book.save();

      // send response
      res.status(200).json({
        status: "success",
        message: "Book updated successfully",
      });
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update book"));
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
