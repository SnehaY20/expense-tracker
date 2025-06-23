const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const User = require("../models/user.js")
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");
const category = require("../models/category.js");

/**
 * @desc      Get all expenses
 * @route     GET /api/v1/expense
 * @access    Private
 */
exports.getExpenses = asyncHandler(async (req, res, next) => {
    const expenses = await Expense.find({user: req.user.id})

    res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
    })
})

/**
 * @desc      Create expense
 * @route     POST /api/v1/expense/categoryId
 * @access    Private
 */

exports.createExpense = asyncHandler (async(req, res, next) => {
    const {title, amount, note} = req.body;
    const categoryId = req.params.id;

    
    const expense = Expense.findOne({user: req.user.id, category: categoryId})

    if(!expense){
        return next (new ErrorResponse("Invalid Credentials", 404))
    }

    const newExpense = await Expense.create({
        title,
        amount,
        note,
        category: categoryId,
        user: req.user.id
    })

    res.status(201).json({
        success: true,
        message: "Expense created successfully",
        data: newExpense
    })
})
