const Category = require("../models/category.js");
const Expense = require("../models/expense.js");
const logger = require("../config/logger.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Get all categories
 * @route     GET /api/v1/category
 * @access    Private
 */
exports.getCategories = async (req, res) => {
  const TAG = "[getCategories]";
  try {
    const userCategory = await Category.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: userCategory.length,
      data: userCategory,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Create a new category
 * @route     POST /api/v1/category
 * @access    Private
 */
exports.createCategory = async (req, res) => {
  const TAG = "[createCategory]";
  try {
    const { name } = req.body;

    const category = await Category.findOne({ user: req.user._id, name: name });

    if (category) {
      logger.error(
        `${TAG} Category with name ${name} already exists for user ${req.user._id}`
      );
      return res.status(400).json({
        success: false,
        error: ERROR.CATEGORY.EXISTS,
      });
    }

    const newCategory = await Category.create({
      name: name,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: ERROR.CATEGORY.CREATED || "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Get category by ID
 * @route     GET /api/v1/category/:id
 * @access    Private
 */
exports.getCategory = async (req, res) => {
  const TAG = "[getCategory]";
  try {
    const categoryId = req.params.id;
    let category = await Category.findById(categoryId);

    if (!category) {
      logger.error(`${TAG} Category does not exist`);
      return res.status(404).json({
        success: false,
        error: ERROR.CATEGORY.NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Update category by ID
 * @route     PUT /api/v1/category/:id
 * @access    Private
 */
exports.updateCategory = async (req, res) => {
  const TAG = "[updateCategory]";
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    let category = await Category.findById(categoryId);

    if (!category) {
      logger.error(`${TAG} Category does not exist`);
      return res.status(404).json({
        success: false,
        error: ERROR.CATEGORY.NOT_FOUND,
      });
    }

    let existingCategory = await Category.findOne({
      name: name,
      user: req.user._id,
    });

    if (existingCategory) {
      logger.error(`${TAG} Another category with the same name exists`);
      return res.status(400).json({
        success: false,
        error: ERROR.CATEGORY.DUPLICATE,
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
      message: ERROR.CATEGORY.UPDATED || "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Delete category by ID
 * @route     DELETE /api/v1/category/:id
 * @access    Private
 */
exports.deleteCategory = async (req, res) => {
  const TAG = "[deleteCategory]";
  try {
    const categoryId = req.params.id;

    let category = await Category.findById(categoryId);

    if (!category) {
      logger.error(`${TAG} Category does not exist`);
      return res.status(404).json({
        success: false,
        error: ERROR.CATEGORY.NOT_FOUND,
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: ERROR.CATEGORY.DELETED || "Category deleted successfully",
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
};

/**
 * @desc      Get top categories by expense amount
 * @route     GET /api/v1/category/top-five
 * @access    Private
 */
exports.getTopCategories = async (req, res) => {
  const TAG = '[getTopCategories]';
  try {
    const topCategories = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 1,
          name: "$category.name",
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } }, 
      { $limit: 5 } 
    ]);

    res.status(200).json({
      success: true,
      data: topCategories
    });
  } catch (error) {
    console.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc      Get total expense amount for a specific category
 * @route     GET /api/v1/category/:id/total-expense
 * @access    Private
 */

exports.getTotalExpense = async (req, res) => {
  const TAG = '[getTotalExpense]';
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    const result = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          category: category._id
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

    res.status(200).json({
      success: true,
      data: {
        _id: category._id,
        categoryName: category.name,
        totalAmount
      }
    });
  } catch (error) {
    logger.error(`${TAG} Error while getting total expense: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};


