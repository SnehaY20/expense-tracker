const express = require("express");
const {
  getSummaryStats,
  getTopCategories,
  getExpenseDistribution,
  getMonthlyTrend,
  getRecentExpenses,
  getBudgetStatus,
  updateBudget,
  getOverviewData,
} = require("../controllers/insights.js");

const router = express.Router();
const auth = require("../middleware/auth.js");
router.use(auth);
router.get("/summary", getSummaryStats);
router.get("/top-categories", getTopCategories);
router.get("/expense-distribution", getExpenseDistribution);
router.get("/monthly-trend", getMonthlyTrend);

router.get("/recent-expenses", getRecentExpenses);
router.get("/budget-status", getBudgetStatus);
router.put("/budget", updateBudget);
router.get("/overview", getOverviewData);

module.exports = router;
