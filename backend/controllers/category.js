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
  const userCategory = await Category.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: userCategory.length,
    data: userCategory,
  });
});

/**
 * @desc      Create a new category
 * @route     POST /api/v1/category
 * @access    Private
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.findOne({ user: req.user._id, name: name });

  if (category) {
    return next(new ErrorResponse("Category already exists", 400));
  }

  const newCategory = await Category.create({
    name: name,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});
/**
 * @desc      Update category by ID
 * @route     PUT /api/v1/category/:id
 * @access    Private
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryId = req.params.id;

  let category = await Category.findById(categoryId);

  if (!category) {
    return next(new ErrorResponse("Category does not exist", 404));
  }

  let existingCategory = await Category.findOne({
    name: name,
    user: req.user._id,
  });

  if (existingCategory) {
    return next(
      new ErrorResponse("Another category with the same name exists", 400)
    );
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: name,
      user: req.user._id,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

/**
 * @desc      Delete category by ID
 * @route     DELETE /api/v1/category/:id
 * @access    Private
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  let category = await Category.findById(categoryId);

  if (!category) {
    return next(new ErrorResponse("Category does not exist", 404));
  }

  await Category.findByIdAndDelete(categoryId);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
