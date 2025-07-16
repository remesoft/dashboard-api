// External imports
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");

module.exports = {
  // ---------------------------------
  //        Download SQLite Database
  // ---------------------------------
  database: async (req, res, next) => {
    try {
      const dbPath = path.resolve(__dirname, "../../dev.sqlite3");

      // Check if file exists before attempting download
      if (!fs.existsSync(dbPath)) {
        return next(createError(404, "Database file not found"));
      }

      // Initiate file download
      res.download(dbPath, "backup.sqlite", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          return next(createError(500, "Failed to download database"));
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      next(createError(500, "Server error while handling database download"));
    }
  },
};
