const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory
} = require("../controllers/category.js");
const auth = require("../middleware/auth");

router.get("/category", auth, getCategories);
router.get("/category/:id", auth, getCategory);
router.post("/category", auth, createCategory);
router.put("/category/:id", auth, updateCategory);
router.delete("/category/:id", auth, deleteCategory);

module.exports = router;
