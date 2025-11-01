const mongoose = require('mongoose');

let connected = false;

const connectDb = async () => {
  try {
    if (connected) {
      console.log("mongoDB already connected");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("connected to mongodb database - ".bold.green, `${mongoose.connection.host}`.blue);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

module.exports = connectDb;