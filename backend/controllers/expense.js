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

/**
 * @desc      Get total amount of all expenses
 * @route     GET /api/v1/expenses/total
 * @access    Private
 */
exports.getTotalExpenses = async (req, res) => {
  const TAG = "[getTotalExpenses]";
  try {
    const result = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const total = result[0]?.totalAmount || 0;

    res.status(200).json({
      success: true,
      data: total
    });
  } catch (error) {
    logger.error(`${TAG} Error while getting total expense: ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Get daily expenses for current month9-
 * @route     GET /api/v1/expenses/daily
 * @access    Private
 */
exports.getDailyExpenses = async (req, res) => {
  const TAG = "[getDailyExpenses]";
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          amount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Create array with all days of the month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const existingData = result.find(item => item._id === dateStr);
      dailyData.push({
        day: day,
        amount: existingData ? existingData.amount : 0
      });
    }

    res.status(200).json({
      success: true,
      data: dailyData
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

