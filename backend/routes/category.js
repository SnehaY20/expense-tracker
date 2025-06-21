const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/category.js");
const auth = require("../middleware/auth");

router.get("/category", auth, getCategories);
router.post("/category", auth, createCategory);
router.put("/category/:id", auth, updateCategory);
router.delete("/category/:id", auth, deleteCategory);

module.exports = router;
