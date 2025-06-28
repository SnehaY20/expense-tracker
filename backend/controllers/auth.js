const User = require("../models/user.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const logger = require("../config/logger.js");
const Category = require("../models/category.js");
const ERROR = require("../constants/errorMessages");

/**
 * @desc      Register user
 * @route     POST /api/v1/auth/register
 * @access    Public
 */
exports.register = async (req, res) => {
  const TAG = "[register]";
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      logger.error(`${TAG} Missing required fields.`);
      return res.status(400).json({
        success: false,
        error: ERROR.AUTH.MISSING_FIELDS,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.error(`${TAG} User with email ${email} already exists`);
      return res.status(400).json({
        success: false,
        error: ERROR.AUTH.USER_ALREADY_EXISTS || "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    await Category.create({
      name: "Others",
      user: user._id,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
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
 * @desc      Login user
 * @route     POST /api/v1/auth/login
 * @access    Public
 */
exports.login = async (req, res) => {
  const TAG = "[login]";

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.error(`${TAG} Invalid email or password`);
      return res.status(400).json({
        success: false,
        error: ERROR.AUTH.MISSING_FIELDS,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      logger.error(`${TAG} User does not exist in the database`);
      return res.status(401).json({
        success: false,
        error: ERROR.AUTH.INVALID_CREDENTIALS,
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.error(`${TAG} Invalid credentials`);
      return res.status(401).json({
        success: false,
        error: ERROR.AUTH.INVALID_CREDENTIALS,
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
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
 * @desc      GET logged in user details
 * @route     GET /api/v1/auth/profile
 * @access    Private
 */
exports.profile = asyncHandler(async (req, res, next) => {
  const TAG = "[getMe]";
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    return res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
});

/**
 * @desc      Update password
 * @route     PUT /api/v1/auth/:id
 * @access    Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const TAG = "[updatePassword]";
  try {
    const user = await User.findById(req.user.id).select("+password");
    const { currentPassword, newPassword } = req.body;

    if (!(await user.matchPassword(currentPassword))) {
      logger.error(`${TAG} Incorrect current password for user: ${user.email}`);
      return res.status(401).json({
        success: false,
        error: ERROR.PASSWORD.INCORRECT,
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: ERROR.PASSWORD.UPDATED,
    });
  } catch (error) {
    logger.error(`${TAG} ${error.message}`);
    return res.status(500).json({
      success: false,
      error: ERROR.SERVER_ERROR,
    });
  }
});
