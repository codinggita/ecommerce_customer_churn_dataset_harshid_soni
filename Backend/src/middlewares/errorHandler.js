const mongoose = require('mongoose');
const { errorResponse } = require('../utils/apiResponse');

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error.';
  let details = error.details || null;

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Database validation failed.';
    details = Object.values(error.errors).map((err) => err.message);
  }

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid MongoDB identifier or field type.';
    details = error.message;
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate record found.';
    details = error.keyValue;
  }

  const errorPayload = process.env.NODE_ENV === 'production'
    ? details
    : { details, stack: error.stack };

  return errorResponse(res, message, errorPayload, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
