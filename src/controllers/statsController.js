const Customer = require('../models/Customer');
const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const count = asyncHandler(async (req, res) => {
  const total = await analyticsService.countWhere();
  return successResponse(res, 'Customer count fetched successfully.', { total });
});

const average = (field, message) => asyncHandler(async (req, res) => {
  const [data] = await analyticsService.averageMetric(field);
  return successResponse(res, message, data || { average: 0, min: 0, max: 0 });
});

const highest = (field, message) => asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ isDeleted: false }).sort({ [field]: -1 });
  return successResponse(res, message, customer);
});

const groupedCount = (field, message) => asyncHandler(async (req, res) => {
  const data = await analyticsService.groupCount(field);
  return successResponse(res, message, data);
});

const churnCount = asyncHandler(async (req, res) => {
  const [active, churned] = await Promise.all([
    analyticsService.countWhere({ churned: false }),
    analyticsService.countWhere({ churned: true }),
  ]);
  return successResponse(res, 'Churn count fetched successfully.', { active, churned, total: active + churned });
});

const reviewCount = asyncHandler(async (req, res) => {
  const [data] = await Customer.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, totalReviews: { $sum: '$productReviewsWritten' }, averageReviews: { $avg: '$productReviewsWritten' } } },
    { $project: { _id: 0, totalReviews: { $round: ['$totalReviews', 2] }, averageReviews: { $round: ['$averageReviews', 2] } } },
  ]);
  return successResponse(res, 'Review statistics fetched successfully.', data || { totalReviews: 0, averageReviews: 0 });
});

module.exports = {
  count,
  average,
  highest,
  groupedCount,
  churnCount,
  reviewCount,
};
