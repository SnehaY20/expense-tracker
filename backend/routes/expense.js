const express = require("express");
const router = express.Router();
const { getExpenses } = require("../controllers/expense.js");
const auth = require("../middleware/auth");

router.get("/", auth, getExpenses);

module.exports = router;
