const User = require("../models/user.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const logger = require("../config/logger.js");
const Category = require("../models/category.js");

/**
 * @desc      Register user
 * @route     POST /api/v1/register
 * @access    Public
 */
exports.register = async (req, res) => {
  const TAG = "[register]";
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      logger.error(
        `[register] Missing required fields.`
      );
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.error(`[register] User with email ${email} already exists`);
      return res.status(400).json({
        success: false,
        error: "User already exists",
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
      error: "Server Error",
    });
  }
};

/**
 * @desc      Login user
 * @route     POST /api/v1/login
 * @access    Public
 */
exports.login = async (req, res) => {
  const TAG = "[login]";

  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      logger.error(`${TAG} Invalid email or password`);
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      logger.error(`${TAG} User does not exist in the database`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.error(`${TAG} Invalid credentials`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
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
      error: "Server Error",
    });
  }
};
