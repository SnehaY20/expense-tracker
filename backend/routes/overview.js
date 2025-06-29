const express = require("express");
const {
  getRecentExpenses,
  getOverviewData,
} = require("../controllers/overview.js");

const router = express.Router();

const auth = require("../middleware/auth.js");
router.use(auth);
router.get("/recent-expenses", getRecentExpenses);
router.get("/", getOverviewData);

module.exports = router;
