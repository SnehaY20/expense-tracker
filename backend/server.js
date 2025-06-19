const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db.js");
const logger = require("./config/logger.js");
const reqLogger = require("./middleware/reqLogger.js");

dotenv.config({ path: "./.env" });

connectDb();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(reqLogger);

app.get("/", (req, res) => {
  logger.info("route hit");
  res.status(200).send("Hello Sneha here");
});

app.listen(PORT, () => {
  logger.info(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
