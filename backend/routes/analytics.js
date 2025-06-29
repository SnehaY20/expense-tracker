const express = require("express");
const {
  getSummaryStats,
  getTopCategories,
  getExpenseDistribution,
  getMonthlyTrend,
} = require("../controllers/analytics.js");

const router = express.Router();


const auth = require("../middleware/auth.js");

router.use(auth);

router.get("/summary", getSummaryStats);
router.get("/top-categories", getTopCategories);
router.get("/expense-distribution", getExpenseDistribution);
router.get("/monthly-trend", getMonthlyTrend);

module.exports = router;
