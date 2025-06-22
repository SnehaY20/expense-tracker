const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db.js");
const logger = require("./config/logger.js");
const reqLogger = require("./middleware/reqLogger.js");
const authRouter = require("./routes/auth.js");
const categoriesRouter = require("./routes/category.js");
const errorHandler = require('./middleware/errorHandler.js')

dotenv.config({ path: "./.env" });

connectDb();

const app = express();

app.use(express.json());
app.use(reqLogger);


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoriesRouter);


const PORT = process.env.PORT || 5000;



app.get("/api/v1", (req, res) => {
  res.status(200).send("API is live & running");
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );  
});
