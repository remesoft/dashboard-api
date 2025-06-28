const multer = require("multer");
const path = require("path");
const UPLOADS_FOLDER = path.join(__dirname, "../uploads/");

const storage = multer.diskStorage({
  destination: UPLOADS_FOLDER,
  filename: (req, file, cb) => {
    console.log("working");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
module.exports = upload;
