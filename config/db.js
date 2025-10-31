const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mongodb database");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

module.exports = connectDb;