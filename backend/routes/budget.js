const express = require("express");
const {
  getBudgetStatus,
  updateBudget,
  getBudgetSettings,
} = require("../controllers/budget.js");

const router = express.Router();

const auth = require("../middleware/auth.js");
router.use(auth);
router.get("/status", getBudgetStatus);
router.get("/settings", getBudgetSettings);

router.put("/", updateBudget);

module.exports = router;
