const Category = require("../models/category.js");
const logger = require("../config/logger.js");

/**
 * @desc      Get all categories
 * @route     GET /api/v1/category
 * @access    Private
 */
exports.getCategories = async (req, res) => {
  try {
    const userCategory = await Category.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: userCategory.length,
      data: userCategory,
    });
  } catch (error) {
    logger.error(`[getCategories] ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @desc      Create a new category
 * @route     POST /api/v1/category
 * @access    Private
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOne({ user: req.user._id, name: name });

    if (category) {
      return res.status(400).json({
        success: false,
        error: "Category already exists",
      });
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
  } catch (error) {
    logger.error(`[createCategory] ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @desc      Get category by ID
 * @route     GET /api/v1/category/:id
 * @access    Private
 */
exports.getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category does not exist",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    logger.error(`[getCategory] ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @desc      Update category by ID
 * @route     PUT /api/v1/category/:id
 * @access    Private
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category does not exist",
      });
    }

    let existingCategory = await Category.findOne({
      name: name,
      user: req.user._id,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Another category with the same name exists",
      });
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
  } catch (error) {
    logger.error(`[updateCategory] ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @desc      Delete category by ID
 * @route     DELETE /api/v1/category/:id
 * @access    Private
 */
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category does not exist",
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    logger.error(`[deleteCategory] ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
