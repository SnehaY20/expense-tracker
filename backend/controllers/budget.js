const Budget = require("../models/budget.js");
const logger = require("../config/logger.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Get user's budget
 * @route     GET /api/v1/budget
 * @access    Private
 */
exports.getBudget = async (req, res) => {
  const TAG = "[getBudget]";
  try {
    const budget = await Budget.findOne({ user: req.user.id });
    if (!budget) {
      logger.error(`${TAG} Budget not found for user: ${req.user.id}`);
      return res
        .status(404)
        .json({ success: false, error: ERROR.BUDGET.NOT_FOUND });
    }
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Create user's budget
 * @route     POST /api/v1/budget
 * @access    Private
 */
exports.createBudget = async (req, res) => {
  const TAG = "[createBudget]";
  try {
    const { amount } = req.body;
    let budget = await Budget.findOne({ user: req.user.id });
    if (budget) {
      logger.error(`${TAG} Budget already exists for user: ${req.user.id}`);
      return res.status(400).json({
        success: false,
        error: ERROR.BUDGET.ALREADY_SET,
      });
    }
    budget = await Budget.create({ user: req.user.id, amount });
    res
      .status(201)
      .json({ success: true, message: ERROR.BUDGET.CREATED, data: budget });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Update user's budget by id
 * @route     PUT /api/v1/budget/:id
 * @access    Private
 */
exports.updateBudget = async (req, res) => {
  const TAG = "[updateBudget]";
  try {
    const { amount } = req.body;
    const budgetId = req.params.id;
    let budget = await Budget.findOne({ _id: budgetId, user: req.user.id });
    if (!budget) {
      logger.error(
        `${TAG} Budget not found for user: ${req.user.id} with id: ${budgetId}`
      );
      return res
        .status(404)
        .json({ success: false, error: ERROR.BUDGET.NOT_FOUND });
    }
    budget.amount = amount;
    await budget.save();
    res
      .status(200)
      .json({ success: true, message: ERROR.BUDGET.UPDATED, data: budget });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};

/**
 * @desc      Delete user's budget by id
 * @route     DELETE /api/v1/budget/:id
 * @access    Private
 */
exports.deleteBudget = async (req, res) => {
  const TAG = "[deleteBudget]";
  try {
    const budgetId = req.params.id;
    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      user: req.user.id,
    });
    if (!budget) {
      logger.error(
        `${TAG} Budget not found for user: ${req.user.id} with id: ${budgetId}`
      );
      return res
        .status(404)
        .json({ success: false, error: ERROR.BUDGET.NOT_FOUND });
    }
    res.status(200).json({ success: true, message: ERROR.BUDGET.DELETED });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    res.status(500).json({ success: false, error: ERROR.SERVER_ERROR });
  }
};
