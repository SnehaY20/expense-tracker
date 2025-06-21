const Category = require("../models/category");
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");
const logger = require("../config/logger.js");

/**
 * @desc      Get all category
 * @route     GET /api/v1/category
 * @access    Private
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});
