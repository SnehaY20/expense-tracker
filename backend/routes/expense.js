const express = require("express");
const router = express.Router();
const { getExpenses, createExpense, updateExpense } = require("../controllers/expense.js");
const auth = require("../middleware/auth");

router.get("/", auth, getExpenses);
router.post("/:id", auth, createExpense);
router.put("/:id", auth, updateExpense);

module.exports = router;
