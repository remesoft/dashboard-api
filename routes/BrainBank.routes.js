// external imports
const express = require("express");
const upload = require("../middlewares/upload");

// controllers
const books = require("../controllers/brain-bank/Book.Controller");
const chapter = require("../controllers/brain-bank/Chapter.Controller");
const groups = require("../controllers/brain-bank/Group.Controller");
const questions = require("../controllers/brain-bank/Question.Controller");
const extra = require("../controllers/brain-bank/Extra.Controller");

// declaration
const router = express.Router();

// books related routes
router.get("/books", books.getBooks);
router.get("/books/:id", books.getBook);
router.post("/books/create", upload.single("cover"), books.create);
router.delete("/books/:id", books.delete);
router.patch("/books/:id", upload.single("cover"), books.update);

// chapter related routes
router.get("/chapters/:id", chapter.getChapters);
router.post("/chapters/create", chapter.create);
router.delete("/chapters/:id", chapter.delete);

// groups related routes
router.get("/groups/:id", groups.getGroup);
router.post("/groups/create", groups.create);
router.patch("/groups/:id", groups.update);
router.delete("/groups/:id", groups.delete);

// questions related routes
router.post("/questions/create", questions.create);
router.put("/questions/:id", questions.update);
router.delete("/questions/:id", questions.delete);

// extra information related routes
router.get("/extras/:id", extra.getExtra);
router.post("/extras/create", extra.create);
router.put("/extras/:id", extra.update);
router.post("/extras/:id", extra.delete);

// export route
module.exports = router;
