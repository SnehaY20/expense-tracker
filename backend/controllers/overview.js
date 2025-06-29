const Expense = require("../models/expense.js");
const Category = require("../models/category.js");
const User = require("../models/user.js");
const logger = require("../config/logger.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Get recent expenses
 * @route     GET /api/v1/overview/recent-expenses
 * @access    Private
 */
exports.getRecentExpenses = async (req, res) => {
  const TAG = "[getRecentExpenses]";
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const recentExpenses = await Expense.find({ user: userId })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("title amount note createdAt category");

    res.status(200).json({
      success: true,
      data: recentExpenses,
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
 * @desc      Get comprehensive overview data (all insights in one call)
 * @route     GET /api/v1/overview
 * @access    Private
 */
exports.getOverviewData = async (req, res) => {
  const TAG = "[getOverviewData]";
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;

    // Get all overview data in parallel
    const [
      summaryStats,
      topCategories,
      expenseDistribution,
      monthlyTrend,
      recentExpenses,
      budgetStatus,
    ] = await Promise.all([
      // Summary stats
      (async () => {
        const now = new Date();
        let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        if (period === "week")
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (period === "year") startDate = new Date(now.getFullYear(), 0, 1);

        const expenses = await Expense.find({
          user: userId,
          createdAt: { $gte: startDate, $lte: now },
        });

        const totalExpenses = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const averageExpense =
          expenses.length > 0 ? totalExpenses / expenses.length : 0;

        return {
          totalExpenses: Math.round(totalExpenses * 100) / 100,
          averageExpense: Math.round(averageExpense * 100) / 100,
          expenseCount: expenses.length,
        };
      })(),

      // Top categories
      (async () => {
        const now = new Date();
        let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        if (period === "week")
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (period === "year") startDate = new Date(now.getFullYear(), 0, 1);

        return await Expense.aggregate([
          {
            $match: { user: userId, createdAt: { $gte: startDate, $lte: now } },
          },
          { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
          { $sort: { totalAmount: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          { $unwind: "$categoryInfo" },
          {
            $project: {
              categoryName: "$categoryInfo.name",
              amount: { $round: ["$totalAmount", 2] },
              _id: 0,
            },
          },
        ]);
      })(),

      // Expense distribution
      (async () => {
        const now = new Date();
        let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        if (period === "week")
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (period === "year") startDate = new Date(now.getFullYear(), 0, 1);

        const categories = await Category.find({ user: userId });
        const distribution = await Expense.aggregate([
          {
            $match: { user: userId, createdAt: { $gte: startDate, $lte: now } },
          },
          { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          { $unwind: "$categoryInfo" },
          {
            $project: {
              categoryName: "$categoryInfo.name",
              amount: { $round: ["$totalAmount", 2] },
              _id: 0,
            },
          },
        ]);

        const categoryMap = new Map(
          distribution.map((item) => [item.categoryName, item.amount])
        );
        return categories.map((cat) => ({
          categoryName: cat.name,
          amount: categoryMap.get(cat.name) || 0,
        }));
      })(),

      // Monthly trend
      (async () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        return await Expense.aggregate([
          {
            $match: { user: userId, createdAt: { $gte: startDate, $lte: now } },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              totalAmount: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $project: {
              month: {
                $concat: [
                  { $toString: "$_id.year" },
                  "-",
                  {
                    $cond: {
                      if: { $lt: ["$_id.month", 10] },
                      then: "0",
                      else: "",
                    },
                  },
                  { $toString: "$_id.month" },
                ],
              },
              amount: { $round: ["$totalAmount", 2] },
              _id: 0,
            },
          },
        ]);
      })(),

      // Recent expenses
      (async () => {
        return await Expense.find({ user: userId })
          .populate("category", "name")
          .sort({ createdAt: -1 })
          .limit(10)
          .select("title amount note createdAt category");
      })(),

      // Budget status
      (async () => {
        const user = await User.findById(userId).select(
          "monthlyBudget budgetPeriod"
        );
        const now = new Date();
        let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        if (user.budgetPeriod === "weekly")
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (user.budgetPeriod === "yearly")
          startDate = new Date(now.getFullYear(), 0, 1);

        const totalSpent = await Expense.aggregate([
          {
            $match: { user: userId, createdAt: { $gte: startDate, $lte: now } },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
        const budget = user.monthlyBudget || 0;
        const remaining = budget - spent;
        const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

        return {
          budget: Math.round(budget * 100) / 100,
          spent: Math.round(spent * 100) / 100,
          remaining: Math.round(remaining * 100) / 100,
          percentageUsed: Math.round(percentageUsed * 100) / 100,
          period: user.budgetPeriod || period,
          isOverBudget: remaining < 0,
        };
      })(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        summaryStats,
        topCategories,
        expenseDistribution,
        monthlyTrend,
        recentExpenses,
        budgetStatus,
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
