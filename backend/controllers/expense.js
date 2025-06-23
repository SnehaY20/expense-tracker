const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const User = require("../models/user.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");
const category = require("../models/category.js");

/**
 * @desc      Get all expenses
 * @route     GET /api/v1/expense
 * @access    Private
 */
exports.getExpenses = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: expenses.length,
    data: expenses,
  });
});

/**
 * @desc      Get expenses by category id
 * @route     GET /api/v1/expense/id
 * @access    Private
 */
exports.getExpensesByCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new ErrorResponse("Category not found", 404));
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
});

/**
 * @desc      Create expense
 * @route     POST /api/v1/expense/categoryId
 * @access    Private
 */
exports.createExpense = asyncHandler(async (req, res, next) => {
  const { title, amount, note } = req.body;
  const categoryId = req.params.id;

  const expense = await Expense.find({
    user: req.user.id,
    category: categoryId,
  });

  if (!expense) {
    return next(new ErrorResponse("Invalid Credentials", 404));
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
});

/**
 * @desc      Update expense by id
 * @route     PUT /api/v1/expense/id
 * @access    Private
 */
exports.updateExpense = asyncHandler(async (req, res, next) => {
  const { title, amount, note } = req.body;
  const expenseId = req.params.id;

  let expense = await Expense.findById(expenseId);

  if (!expense) {
    return next(new ErrorResponse("Expense doesn't exist", 404));
  }

  //   if (expense.user.toString() !== req.user.id) {
  //     return next(
  //       new ErrorResponse("Not authorized to update this expense", 401)
  //     );
  //   }

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
});

/**
 * @desc      Delete expense by id
 * @route     DELETE /api/v1/expense/id
 * @access    Private
 */
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const expenseId = req.params.id;

  let expense = await Expense.findById(expenseId);

  if (!expense) {
    return next(new ErrorResponse("Expense doesn't exist", 404));
  }

  // if(expense.user.toString() !== req.user.id){
  //     return next(new ErrorResponse("Not authorized to delete this expense", 401))
  // }
  expense = await Expense.findByIdAndDelete(expenseId);

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});
