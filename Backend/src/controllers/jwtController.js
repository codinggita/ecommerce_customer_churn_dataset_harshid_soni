const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Session = require('../models/Session');
const authService = require('../services/authService');
const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');
const env = require('../config/env');

const profile = asyncHandler(async (req, res) => {
  return successResponse(res, 'JWT profile fetched successfully.', req.user.toSafeObject());
});

const dashboard = asyncHandler(async (req, res) => {
  const summary = await analyticsService.dashboardSummary();
  return successResponse(res, 'JWT dashboard fetched successfully.', summary);
});

const generateToken = asyncHandler(async (req, res) => {
  let user;
  if (req.body.email && req.body.password) {
    const payload = await authService.login(req.body, req);
    return successResponse(res, 'JWT token generated successfully.', payload);
  }

  if (req.body.userId) {
    user = await User.findById(req.body.userId);
  } else {
    user = await User.findOne();
  }

  if (!user) {
    throw new AppError('No user available to generate token.', 404);
  }

  const tokens = await authService.createSessionTokens(user, req);
  return successResponse(res, 'JWT token generated successfully.', { user: user.toSafeObject(), ...tokens });
});

const verifyToken = asyncHandler(async (req, res) => {
  if (!req.body.token) {
    throw new AppError('Token is required.', 400);
  }
  const payload = jwt.verify(req.body.token, env.jwtSecret);
  return successResponse(res, 'JWT token verified successfully.', payload);
});

const refreshToken = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshToken(req.body.refreshToken, req);
  return successResponse(res, 'JWT token refreshed successfully.', tokens);
});

const revokeToken = asyncHandler(async (req, res) => {
  let payload = req.auth;
  if (req.body.token) {
    payload = jwt.verify(req.body.token, env.jwtSecret);
  }
  const result = await Session.updateOne(
    { $or: [{ jti: payload.jti }, { refreshJti: payload.jti }] },
    { $set: { active: false } }
  );
  return successResponse(res, 'JWT token revoked successfully.', result);
});

const privateCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ isDeleted: false }).sort({ lifetimeValue: -1 }).limit(25);
  return successResponse(res, 'Protected customer records fetched successfully.', customers);
});

const privateStats = asyncHandler(async (req, res) => {
  const summary = await analyticsService.dashboardSummary();
  return successResponse(res, 'Protected customer stats fetched successfully.', summary);
});

const customerInsights = asyncHandler(async (req, res) => {
  const insights = await analyticsService.customerInsights('engagement');
  return successResponse(res, 'Protected customer insights fetched successfully.', insights);
});

module.exports = {
  profile,
  dashboard,
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
  privateCustomers,
  privateStats,
  customerInsights,
};
