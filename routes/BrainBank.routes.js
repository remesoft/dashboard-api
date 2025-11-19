// external imports
const express = require("express");
const upload = require("../middlewares/upload");

// controllers
const books = require("../controllers/brain-bank/Book.Controller");
const chapter = require("../controllers/brain-bank/Chapter.Controller");
const groups = require("../controllers/brain-bank/Group.Controller");
const questions = require("../controllers/brain-bank/Question.Controller");
const extra = require("../controllers/brain-bank/Extra.Controller");
const download = require("../controllers/brain-bank/Download.Controller");
const otpRequest = require("../controllers/brain-bank/OtpRequest.Controller");
const user = require("../controllers/brain-bank/User.controller");

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
router.get("/chapters/:id/groups", chapter.getGroup);
router.post("/chapters/create", chapter.create);
router.delete("/chapters/:id", chapter.delete);
router.patch("/chapters/:id", chapter.update);

// groups related routes
router.get("/groups/:id", groups.getGroup);
router.post("/groups/create", groups.create);
router.patch("/groups/:id", groups.update);
router.delete("/groups/:id", groups.delete);

// questions related routes
router.get("/questions/:groupId", questions.getQuestions);
router.post("/questions/create", questions.create);
router.patch("/questions/:id", questions.update);
router.delete("/questions/:id", questions.delete);

// extra information related routes
router.get("/extras/:questionId", extra.getExtra);
router.post("/extras/create", extra.createOrUpdate);
router.patch("/extras/:questionId", extra.update);
router.delete("/extras/:questionId", extra.delete);

// otp request related routes
router.post("/otp/create", otpRequest.create);
router.patch("/otp/verify", otpRequest.verify);

// register routes
router.post("/auth/register", user.create);

// download database
router.get("/download/database", download.database);

// export route
module.exports = router;
