const express = require("express");
const router = express.Router();
const { getExpenses, createExpense } = require("../controllers/expense.js");
const auth = require("../middleware/auth");

router.get("/", auth, getExpenses);
router.post("/:id", auth, createExpense);

module.exports = router;
