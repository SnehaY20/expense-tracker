const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db.js");
const logger = require("./config/logger.js");
const reqLogger = require("./middleware/reqLogger.js");
const routes = require("./routes/auth.js");
const errorHandler = require('./middleware/errorHandler.js')
const cors = require("cors");

dotenv.config({ path: "./.env" });

connectDb();

const app = express();

app.use(express.json());
app.use(reqLogger);

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);

app.use("/api/v1", routes);


const PORT = process.env.PORT || 5000;



app.get("/", (req, res) => {
  logger.info("route hit");
  res.status(200).send("Hello Sneha here");
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
