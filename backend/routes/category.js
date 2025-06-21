const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/category.js");
const auth = require("../middleware/auth");


router.get("/category", auth, getCategories);

module.exports = router;
