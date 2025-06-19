const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("No token, authorization denied", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorResponse("Token is not valid", 401));
  }
};

module.exports = auth;
