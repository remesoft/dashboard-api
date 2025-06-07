// internal imports
// get data
const data = require("../../database/brain-bank/group.json");

module.exports = {
  // get groups information
  getGroup: (req, res, next) => {
    res.json(data);
  },
};
