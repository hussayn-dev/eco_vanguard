const mongoose = require("mongoose");
const startDatabase = () => {
  mongoose.connect(process.env.MONGO_URI);
};
module.exports = {
  startDatabase,
};
