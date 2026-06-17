const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const top = (field, message) => asyncHandler(async (req, res) => {
  const data = await analyticsService.topByField(field, req.query.limit);
  return successResponse(res, message, data);
});

const group = (field, message) => asyncHandler(async (req, res) => {
  const data = await analyticsService.groupCount(field);
  return successResponse(res, message, data);
});

const churnAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.churnAnalysis();
  return successResponse(res, 'Churn analysis fetched successfully.', data);
});

const retention = asyncHandler(async (req, res) => {
  const data = await analyticsService.retentionAnalysis();
  return successResponse(res, 'Retention analysis fetched successfully.', data);
});

const sessionAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.sessionAnalysis();
  return successResponse(res, 'Session analysis fetched successfully.', data);
});

const purchaseAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.purchaseAnalysis();
  return successResponse(res, 'Purchase analysis fetched successfully.', data);
});

const paymentAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.paymentAnalysis();
  return successResponse(res, 'Payment analysis fetched successfully.', data);
});

module.exports = {
  top,
  group,
  churnAnalysis,
  retention,
  sessionAnalysis,
  purchaseAnalysis,
  paymentAnalysis,
};
