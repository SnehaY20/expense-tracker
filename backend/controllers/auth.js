const User = require("../models/user.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");

/**
 * @desc      Register user
 * @route     POST /api/v1/auth/register
 * @access    Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse("Please provide all required fields", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("User already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
});

/**
 * @desc      Login user
 * @route     POST /api/v1/auth/login
 * @access    Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});


