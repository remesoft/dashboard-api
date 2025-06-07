// external imports
const express = require("express");

// controllers
const groups = require("../controllers/brain-bank/Group.Controller");
const books = require("../controllers/brain-bank/Book.Controller");

// declaration
const router = express.Router();

// routes
router.get("/books", books.getBooks);
router.get("/books/:id", books.getBook);
router.post("/books/create-book", books.create);
router.delete("/books/:id", books.delete);
router.put("/books/:id", books.update);

router.get("/groups/:id", groups.getGroup);

// export route
module.exports = router;
