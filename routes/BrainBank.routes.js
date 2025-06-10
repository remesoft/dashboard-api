// external imports
const express = require("express");

// controllers
const groups = require("../controllers/brain-bank/Group.Controller");
const books = require("../controllers/brain-bank/Book.Controller");
const questions = require("../controllers/brain-bank/Question.Controller");

// declaration
const router = express.Router();

// routes
router.get("/books", books.getBooks);
router.get("/books/:id", books.getBook);
router.post("/books/create", books.create);
router.delete("/books/:id", books.delete);
router.put("/books/:id", books.update);

router.get("/groups/:id", groups.getGroup);
router.post("/groups/create", groups.create);
router.put("/groups/:id", groups.update);
router.delete("/groups/:id", groups.delete);

router.post("/questions/create", questions.create);

// export route
module.exports = router;
