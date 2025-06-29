const analyticsController = require("./analytics.js");
const budgetController = require("./budget.js");
const overviewController = require("./overview.js");

// Analytics methods
exports.getSummaryStats = analyticsController.getSummaryStats;
exports.getTopCategories = analyticsController.getTopCategories;
exports.getExpenseDistribution = analyticsController.getExpenseDistribution;
exports.getMonthlyTrend = analyticsController.getMonthlyTrend;

// Budget methods
exports.getBudgetStatus = budgetController.getBudgetStatus;
exports.updateBudget = budgetController.updateBudget;

// Overview methods
exports.getRecentExpenses = overviewController.getRecentExpenses;
exports.getOverviewData = overviewController.getOverviewData;
