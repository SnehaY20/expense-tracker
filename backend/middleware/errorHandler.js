const logger = require("../config/logger");
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  const statusCode = err.statusCode || 500;

  logger.error(error);

  res.status(statusCode).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
