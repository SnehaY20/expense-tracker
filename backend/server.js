const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const { Console } = require("console");
const connectDb = require("./config/db.js");

///Users/snehayadav/Desktop/Projects/expense-tracker/backend/.env

dotenv.config({path: "./.env"})

connectDb();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    console.log("route hit");
    res.status(200).send("Hello Sneha here")
})

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})