const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const User = require("../models/user.js")
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");

exports.getExpenses = asyncHandler(async (req, res, next) => {
    const expenses = await Expense.find({user: req.user.id})

    res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
    })
})