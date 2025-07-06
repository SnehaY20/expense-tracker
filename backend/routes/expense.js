const express = require("express");
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense, getExpensesByCategory, getTotalExpenses } = require("../controllers/expense.js");
const auth = require("../middleware/auth");

router.get("/", auth, getExpenses);
router.get("/total", auth, getTotalExpenses);
router.post("/:id", auth, createExpense);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);
router.get("/category/:id", auth, getExpensesByCategory);

module.exports = router;
