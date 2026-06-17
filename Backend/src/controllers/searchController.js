const SearchLog = require('../models/SearchLog');
const customerService = require('../services/customerService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

const keywordFilters = {
  'high-value': 'highValue',
  loyal: 'loyal',
  inactive: 'inactive',
  mobile: 'highMobileUsage',
  discount: 'highDiscountUsers',
  cart: 'highCartAbandonment',
  reviews: 'topReviewers',
  credit: 'highCredit',
  engagement: 'highEngagement',
  churned: 'churned',
  premium: 'premium',
};

const searchCustomers = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    throw new AppError('Search query q is required.', 400);
  }

  const normalized = q.toLowerCase();
  let result;
  if (keywordFilters[normalized]) {
    result = await customerService.listByNamedFilter(keywordFilters[normalized], req.query);
  } else {
    result = await customerService.listCustomers({ ...req.query, search: q });
  }

  await SearchLog.create({
    query: q,
    resultCount: result.meta.total,
    user: req.user?._id || null,
    ipAddress: req.ip,
  });

  return successResponse(res, 'Customer search completed successfully.', result.customers, result.meta);
});

module.exports = {
  searchCustomers,
};
