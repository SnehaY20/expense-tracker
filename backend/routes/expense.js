const express = require("express");
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require("../controllers/expense.js");
const auth = require("../middleware/auth");

router.get("/", auth, getExpenses);
router.post("/:id", auth, createExpense);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);

module.exports = router;
