const Category = require("../models/category.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");
const logger = require("../config/logger.js");

/**
 * @desc      Get all categories
 * @route     GET /api/v1/category
 * @access    Private
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const userCategory = await Category.findOne({ user: req.user.id });

  if (!userCategory) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    count: userCategory.category.length,
    data: userCategory.category,
  });
});

/**
 * @desc      Create a new category
 * @route     POST /api/v1/category
 * @access    Private
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  if (!category || category.trim() === "") {
    return next(new ErrorResponse("Category name is required", 400));
  }

  const trimmedCategory = category.trim();

  let userCategory = await Category.findOne({ user: req.user.id });


  if (!userCategory) {
    userCategory = await Category.create({
      user: req.user.id,
      category: ["Others", trimmedCategory],
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: userCategory.category,
    });
  }

  const categoryExists = userCategory.category.some(
    (c) => c.toLowerCase() === trimmedCategory.toLowerCase()
  );

  if (categoryExists) {
    return next(new ErrorResponse("Category already exists", 400));
  }

  userCategory.category.push(trimmedCategory);
  await userCategory.save();

  res.status(201).json({
    success: true,
    message: "Category added successfully",
    data: userCategory.category,
  });
});
