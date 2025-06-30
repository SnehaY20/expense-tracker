const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budget.js");

router.get("/", auth, getBudget);
router.post("/", auth, createBudget);
router.put("/:id", auth, updateBudget);
router.delete("/:id", auth, deleteBudget);

module.exports = router;
