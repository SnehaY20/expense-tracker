const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const logger = require("../config/logger.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Get all expenses
 * @route     GET /api/v1/expenses
 * @access    Private
 */
exports.getExpenses = async (req, res) => {
  const TAG = "[getExpenses]";
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Get expenses by category id
 * @route     GET /api/v1/expenses/category/categoryId
 * @access    Private
 */
exports.getExpensesByCategory = async (req, res) => {
  const TAG = "[getExpensesByCategory]";
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      logger.error(`${TAG} Category not found: ${categoryId}`);
      return res
        .status(404)
        .json({ success: false, error: ERROR.CATEGORY.NOT_FOUND });
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
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Create expense
 * @route     POST /api/v1/expenses/categoryId
 * @access    Private
 */
exports.createExpense = async (req, res) => {
  const TAG = "[createExpense]";
  try {
    const { title, amount, note } = req.body;
    const categoryId = req.params.id;
    const expense = await Expense.find({
      user: req.user.id,
      category: categoryId,
    });
    if (!expense) {
      logger.error(`${TAG} Invalid credentials or category: ${categoryId}`);
      return res
        .status(404)
        .json({ success: false, error: ERROR.AUTH.INVALID_CREDENTIALS });
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
      message: ERROR.EXPENSE.CREATED,
      data: newExpense,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Update expense by id
 * @route     PUT /api/v1/expenses/id
 * @access    Private
 */
exports.updateExpense = async (req, res) => {
  const TAG = "[updateExpense]";
  try {
    const { title, amount, note } = req.body;
    const expenseId = req.params.id;
    let expense = await Expense.findById(expenseId);
    if (!expense) {
      logger.error(`${TAG} Expense doesn't exist: ${expenseId}`);
      return res
        .status(404)
        .json({ success: false, error: ERROR.EXPENSE.NOT_FOUND });
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
      message: ERROR.EXPENSE.UPDATED,
      data: expense,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Delete expense by id
 * @route     DELETE /api/v1/expenses/id
 * @access    Private
 */
exports.deleteExpense = async (req, res) => {
  const TAG = "[deleteExpense]";
  try {
    const expenseId = req.params.id;
    let expense = await Expense.findById(expenseId);
    if (!expense) {
      logger.error(`${TAG} Expense doesn't exist: ${expenseId}`);
      return res
        .status(404)
        .json({ success: false, error: ERROR.EXPENSE.NOT_FOUND });
    }

    expense = await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({
      success: true,
      message: ERROR.EXPENSE.DELETED,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};
