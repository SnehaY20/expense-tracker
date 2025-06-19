
const mongoose = require("mongoose");
const logger = require("./logger");


const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error while connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;