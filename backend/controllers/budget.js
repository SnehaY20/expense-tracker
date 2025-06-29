const User = require("../models/user.js");
const Expense = require("../models/expense.js");
const logger = require("../config/logger.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Get budget status and remaining budget
 * @route     GET /api/v1/budget/status
 * @access    Private
 */
exports.getBudgetStatus = async (req, res) => {
  const TAG = "[getBudgetStatus]";
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;

    // Get user's budget settings
    const user = await User.findById(userId).select(
      "monthlyBudget budgetPeriod"
    );

    if (!user) {
      logger.error(`${TAG} User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        error: ERROR.AUTH.USER_NOT_FOUND,
      });
    }

    // Calculate date range based on budget period
    const now = new Date();
    let startDate;

    switch (user.budgetPeriod || period) {
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Calculate total spent in the period
    const totalSpent = await Expense.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
    const budget = user.monthlyBudget || 0;
    const remaining = budget - spent;
    const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        budget: Math.round(budget * 100) / 100,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentageUsed: Math.round(percentageUsed * 100) / 100,
        period: user.budgetPeriod || period,
        isOverBudget: remaining < 0,
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
 * @desc      Update user budget
 * @route     PUT /api/v1/budget
 * @access    Private
 */
exports.updateBudget = async (req, res) => {
  const TAG = "[updateBudget]";
  try {
    const userId = req.user.id;
    const { monthlyBudget, budgetPeriod } = req.body;

    if (
      monthlyBudget !== undefined &&
      (monthlyBudget < 0 || isNaN(monthlyBudget))
    ) {
      return res.status(400).json({
        success: false,
        error: ERROR.BUDGET.INVALID_AMOUNT,
      });
    }

    const updateData = {};
    if (monthlyBudget !== undefined) updateData.monthlyBudget = monthlyBudget;
    if (budgetPeriod !== undefined) updateData.budgetPeriod = budgetPeriod;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("monthlyBudget budgetPeriod");

    res.status(200).json({
      success: true,
      message: ERROR.BUDGET.UPDATED,
      data: updatedUser,
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
 * @desc      Get user's current budget settings
 * @route     GET /api/v1/budget/settings
 * @access    Private
 */
exports.getBudgetSettings = async (req, res) => {
  const TAG = "[getBudgetSettings]";
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "monthlyBudget budgetPeriod"
    );

    if (!user) {
      logger.error(`${TAG} User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        error: ERROR.AUTH.USER_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        monthlyBudget: user.monthlyBudget || 0,
        budgetPeriod: user.budgetPeriod || "monthly",
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
