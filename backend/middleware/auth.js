const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user"); 

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("No token, authorization denied", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password"); 

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    req.user = user; 
    next();
  } catch (error) {
    return next(new ErrorResponse("Token is not valid", 401));
  }
};

module.exports = auth;
