const express = require("express");
const router = express.Router();
const { getCategories, createCategory } = require("../controllers/category.js");
const auth = require("../middleware/auth");


router.get("/category", auth, getCategories);
router.post("/category", auth, createCategory);

module.exports = router;
