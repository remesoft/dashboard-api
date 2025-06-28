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
      const bookId = req.params.id;
      if (!bookId) return next(createError(404, "Book id not found"));

      const book = await db.Book.findOne({
        where: { id: bookId },
        include: [
          {
            model: db.Chapter,
            as: "chapters",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      if (!book) return next(createError(404, "Book not found"));

      // add full image URL
      const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
      const bookData = book.toJSON();
      bookData.image = `${BASE_URL}/uploads/${book.image}`;

      res.json(bookData);
    } catch (err) {
      next(createError(500, "Failed to retrieve book"));
    }
  },

  // ---------------------------------
  //        create new book
  // -----------------------------------------
  create: async (req, res, next) => {
    try {
      const file = req.file;
      const name = req.body.name;

      if (!name || !file) {
        return res
          .status(400)
          .json({ message: "Name and image are required." });
      }

      const imagePath = file.filename;
      const book = await db.Book.create({
        name: name,
        image: imagePath,
      });

      res.json(book);
    } catch (error) {
      console.log(error);
      console.log("something went wrong");
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
