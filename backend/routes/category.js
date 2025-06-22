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

router.get("/", auth, getCategories);
router.get("/:id", auth, getCategory);
router.post("/", auth, createCategory);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
