const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const logger = require("../config/logger.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Get summary statistics (total expenses, average, etc.)
 * @route     GET /api/v1/analytics/summary
 * @access    Private
 */
exports.getSummaryStats = async (req, res) => {
  const TAG = "[getSummaryStats]";
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get expenses for the period
    const expenses = await Expense.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: now },
    });

    // Calculate statistics
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const averageExpense =
      expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const expenseCount = expenses.length;

    // Get previous period for comparison
    const previousStartDate = new Date(
      startDate.getTime() - (now.getTime() - startDate.getTime())
    );
    const previousExpenses = await Expense.find({
      user: userId,
      createdAt: { $gte: previousStartDate, $lt: startDate },
    });
    const previousTotal = previousExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const percentageChange =
      previousTotal > 0
        ? ((totalExpenses - previousTotal) / previousTotal) * 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        averageExpense: Math.round(averageExpense * 100) / 100,
        expenseCount,
        percentageChange: Math.round(percentageChange * 100) / 100,
        period,
      },
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Get top spending categories
 * @route     GET /api/v1/analytics/top-categories
 * @access    Private
 */
exports.getTopCategories = async (req, res) => {
  const TAG = "[getTopCategories]";
  try {
    const userId = req.user.id;
    const { limit = 5, period = "month" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Aggregate expenses by category
    const topCategories = await Expense.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$categoryInfo.name",
          totalAmount: { $round: ["$totalAmount", 2] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topCategories,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Get expense distribution for pie chart
 * @route     GET /api/v1/analytics/expense-distribution
 * @access    Private
 */
exports.getExpenseDistribution = async (req, res) => {
  const TAG = "[getExpenseDistribution]";
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get all categories for the user
    const categories = await Category.find({ user: userId });

    // Get expense distribution
    const distribution = await Expense.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          categoryName: "$categoryInfo.name",
          amount: { $round: ["$totalAmount", 2] },
          _id: 0,
        },
      },
    ]);

    // Add categories with zero expenses
    const categoryMap = new Map(
      distribution.map((item) => [item.categoryName, item.amount])
    );
    const allCategories = categories.map((cat) => ({
      categoryName: cat.name,
      amount: categoryMap.get(cat.name) || 0,
    }));

    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Get monthly trend data
 * @route     GET /api/v1/analytics/monthly-trend
 * @access    Private
 */
exports.getMonthlyTrend = async (req, res) => {
  const TAG = "[getMonthlyTrend]";
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - parseInt(months) + 1,
      1
    );

    // Aggregate expenses by month
    const monthlyData = await Expense.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: { if: { $lt: ["$_id.month", 10] }, then: "0", else: "" },
              },
              { $toString: "$_id.month" },
            ],
          },
          amount: { $round: ["$totalAmount", 2] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};
