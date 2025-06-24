const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const User = require("../models/user.js");
const category = require("../models/category.js");

/**
 * @desc      Get all expenses
 * @route     GET /api/v1/expenses
 * @access    Private
 */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc      Get expenses by category id
 * @route     GET /api/v1/expenses/category/categoryId
 * @access    Private
 */
exports.getExpensesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }
    const expenses = await Expense.find({
      category: categoryId,
      user: req.user.id,
    });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc      Create expense
 * @route     POST /api/v1/expenses/categoryId
 * @access    Private
 */
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, note } = req.body;
    const categoryId = req.params.id;
    const expense = await Expense.find({
      user: req.user.id,
      category: categoryId,
    });
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid Credentials" });
    }
    const newExpense = await Expense.create({
      title,
      amount,
      note,
      category: categoryId,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc      Update expense by id
 * @route     PUT /api/v1/expenses/id
 * @access    Private
 */
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, note } = req.body;
    const expenseId = req.params.id;
    let expense = await Expense.findById(expenseId);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense doesn't exist" });
    }

    expense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        title,
        amount,
        note,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc      Delete expense by id
 * @route     DELETE /api/v1/expenses/id
 * @access    Private
 */
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    let expense = await Expense.findById(expenseId);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense doesn't exist" });
    }

    expense = await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
