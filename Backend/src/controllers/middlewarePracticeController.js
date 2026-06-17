const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

const logger = asyncHandler(async (req, res) => {
  return successResponse(res, 'Logger middleware executed successfully.', {
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

const auth = asyncHandler(async (req, res) => {
  return successResponse(res, 'Authentication middleware executed successfully.', req.user.toSafeObject());
});

const rateLimit = asyncHandler(async (req, res) => {
  return successResponse(res, 'Rate limiting middleware is active.', {
    remaining: res.getHeader('RateLimit-Remaining') || null,
  });
});

const errorHandler = asyncHandler(async () => {
  throw new AppError('Practice error generated successfully.', 418, { route: 'middleware/error-handler' });
});

const requestTime = asyncHandler(async (req, res) => {
  return successResponse(res, 'Request timing middleware executed successfully.', {
    startedAt: req.requestStartedAt,
    currentTime: Date.now(),
  });
});

const cache = asyncHandler(async (req, res) => {
  return successResponse(res, 'Cache middleware executed successfully.', {
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  logger,
  auth,
  rateLimit,
  errorHandler,
  requestTime,
  cache,
};
