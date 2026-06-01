const fs = require('fs');
const Customer = require('../models/Customer');
const SystemLog = require('../models/SystemLog');
const customerService = require('../services/customerService');
const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');
const thresholds = require('../utils/thresholds');
const { normalizeCustomer } = require('../utils/normalizeCustomer');

const listCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(req.query);
  return successResponse(res, 'Customers fetched successfully.', result.customers, result.meta);
});

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id, req.query.includeDeleted === 'true');
  return successResponse(res, 'Customer fetched successfully.', customer);
});

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body, req.user?._id);
  return successResponse(res, 'Customer created successfully.', customer, null, 201);
});

const replaceCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.replaceCustomer(req.params.id, req.body, req.user?._id);
  return successResponse(res, 'Customer replaced successfully.', customer);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body, req.user?._id);
  return successResponse(res, 'Customer updated successfully.', customer);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.softDeleteCustomer(req.params.id, req.user?._id);
  return successResponse(res, 'Customer deleted successfully.', customer);
});

const restoreCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.restoreCustomer(req.params.id, req.user?._id);
  return successResponse(res, 'Customer restored successfully.', customer);
});

const existsCustomer = asyncHandler(async (req, res) => {
  const exists = Boolean(await customerService.existsCustomer(req.params.id));
  return successResponse(res, 'Customer existence checked successfully.', { exists });
});

const bulkCreate = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    throw new AppError('Request body must be a non-empty customer array.', 400);
  }
  const customers = await customerService.bulkCreate(req.body, req.user?._id);
  return successResponse(res, 'Customers created successfully.', customers, { inserted: customers.length }, 201);
});

const bulkUpdate = asyncHandler(async (req, res) => {
  const result = await customerService.bulkUpdate(req.body, req.user?._id);
  return successResponse(res, 'Customers updated successfully.', result);
});

const bulkDelete = asyncHandler(async (req, res) => {
  const result = await customerService.bulkDelete(req.body, req.user?._id);
  return successResponse(res, 'Customers deleted successfully.', result);
});

const namedFilter = (name) => asyncHandler(async (req, res) => {
  const result = await customerService.listByNamedFilter(name, req.query);
  return successResponse(res, `${name} customers fetched successfully.`, result.customers, result.meta);
});

const fieldFilter = (field, mode = 'exact') => asyncHandler(async (req, res) => {
  const value = req.params.value || req.params.country || req.params.city || req.params.gender || req.params.age
    || req.params.quarter || req.params.status;
  const result = await customerService.listByFieldRoute(field, value, req.query, mode);
  return successResponse(res, `Customers filtered by ${field} successfully.`, result.customers, result.meta);
});

const sortShortcut = (field, direction = -1) => asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers({ ...req.query, sort: `${direction === -1 ? '-' : ''}${field}` });
  return successResponse(res, 'Sorted customers fetched successfully.', result.customers, result.meta);
});

const randomCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getRandomCustomer();
  return successResponse(res, 'Random customer fetched successfully.', customer);
});

const customerHistory = asyncHandler(async (req, res) => {
  const history = await customerService.getHistory(req.params.id);
  return successResponse(res, 'Customer history fetched successfully.', history);
});

const trendingCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(
    { ...req.query, sort: '-loginFrequency' },
    {
      $or: [
        { loginFrequency: { $gte: thresholds.highLoginFrequency } },
        { mobileAppUsage: { $gte: thresholds.highMobileUsage } },
        { socialMediaEngagementScore: { $gte: 55 } },
      ],
    }
  );
  return successResponse(res, 'Trending customers fetched successfully.', result.customers, result.meta);
});

const recommendations = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(
    { ...req.query, sort: '-lifetimeValue' },
    {
      churned: false,
      lifetimeValue: { $gte: thresholds.highLifetimeValue },
      daysSinceLastPurchase: { $lte: thresholds.inactivePurchaseDays },
    }
  );
  return successResponse(res, 'Marketing recommendation customers fetched successfully.', result.customers, result.meta);
});

const churnPredictions = asyncHandler(async (req, res) => {
  const riskyCustomers = await Customer.aggregate([
    { $match: { isDeleted: false } },
    {
      $addFields: {
        churnRiskScore: {
          $add: [
            { $cond: [{ $gte: ['$daysSinceLastPurchase', thresholds.inactivePurchaseDays] }, 30, 0] },
            { $cond: [{ $gte: ['$cartAbandonmentRate', thresholds.highCartAbandonmentRate] }, 25, 0] },
            { $cond: [{ $lte: ['$sessionDurationAvg', thresholds.lowSessionDuration] }, 20, 0] },
            { $cond: [{ $lte: ['$loginFrequency', 4] }, 15, 0] },
            { $cond: ['$churned', 10, 0] },
          ],
        },
      },
    },
    { $sort: { churnRiskScore: -1 } },
    { $limit: Number(req.query.limit) || 25 },
  ]);
  return successResponse(res, 'Churn prediction results fetched successfully.', riskyCustomers);
});

const retentionPredictions = asyncHandler(async (req, res) => {
  const data = await analyticsService.retentionAnalysis();
  return successResponse(res, 'Retention trend prediction fetched successfully.', data);
});

const heatmap = (field) => asyncHandler(async (req, res) => {
  const data = await analyticsService.groupCount(field);
  return successResponse(res, `${field} heatmap data fetched successfully.`, data);
});

const insights = (type) => asyncHandler(async (req, res) => {
  const data = await analyticsService.customerInsights(type);
  return successResponse(res, `${type} insights fetched successfully.`, data);
});

const alerts = (name) => asyncHandler(async (req, res) => {
  const map = {
    highChurn: { daysSinceLastPurchase: { $gte: thresholds.inactivePurchaseDays }, cartAbandonmentRate: { $gte: thresholds.highCartAbandonmentRate } },
    inactiveUsers: { daysSinceLastPurchase: { $gte: thresholds.inactivePurchaseDays } },
    highCartAbandonment: { cartAbandonmentRate: { $gte: thresholds.highCartAbandonmentRate } },
  };
  const result = await customerService.listCustomers(req.query, map[name]);
  return successResponse(res, `${name} alerts fetched successfully.`, result.customers, result.meta);
});

const dashboardSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.dashboardSummary();
  return successResponse(res, 'Customer dashboard summary fetched successfully.', data);
});

const dashboardRevenue = asyncHandler(async (req, res) => {
  const data = await analyticsService.purchaseAnalysis();
  return successResponse(res, 'Revenue dashboard fetched successfully.', data[0] || {});
});

const systemHealth = asyncHandler(async (req, res) => {
  return successResponse(res, 'Customer API is healthy.', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const systemVersion = asyncHandler(async (req, res) => {
  return successResponse(res, 'API version fetched successfully.', {
    name: 'ecommerce-customer-churn-api',
    version: '1.0.0',
    datasetRecords: 15259,
  });
});

const systemConfig = asyncHandler(async (req, res) => {
  return successResponse(res, 'Public configuration fetched successfully.', {
    paginationMaxLimit: 100,
    supportedSortFields: [
      'age',
      'membershipYears',
      'loginFrequency',
      'sessionDuration',
      'purchases',
      'averageOrderValue',
      'lifetimeValue',
      'creditBalance',
      'discountRate',
      'mobileUsage',
    ],
  });
});

const cacheClear = asyncHandler(async (req, res) => {
  const { clearCache } = require('../middlewares/cacheMiddleware');
  clearCache();
  return successResponse(res, 'Customer cache cleared successfully.');
});

const logs = asyncHandler(async (req, res) => {
  const entries = await SystemLog.find().sort({ createdAt: -1 }).limit(Number(req.query.limit) || 50);
  return successResponse(res, 'System logs fetched successfully.', entries);
});

const activity = asyncHandler(async (req, res) => {
  const entries = await SystemLog.find({ event: 'http_request' }).sort({ createdAt: -1 }).limit(Number(req.query.limit) || 50);
  return successResponse(res, 'API activity fetched successfully.', entries);
});

const liveSearch = asyncHandler(async (req, res) => {
  if (!req.query.q) {
    throw new AppError('Query parameter q is required.', 400);
  }
  const result = await customerService.listCustomers({ ...req.query, search: req.query.q, limit: req.query.limit || 10 });
  return successResponse(res, 'Live customer search completed successfully.', result.customers, result.meta);
});

const importJson = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body)) {
    throw new AppError('Imported JSON must be an array.', 400);
  }

  const normalized = req.body.map((record, index) => normalizeCustomer(record, index));
  const customers = await customerService.bulkCreate(normalized, req.user?._id);
  return successResponse(res, 'JSON customers imported successfully.', customers, { inserted: customers.length }, 201);
});

const importJsonFromFile = asyncHandler(async (req, res) => {
  const path = req.body.path;
  if (!path || !fs.existsSync(path)) {
    throw new AppError('Valid JSON file path is required.', 400);
  }
  const raw = JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(raw)) {
    throw new AppError('Imported JSON must be an array.', 400);
  }
  const normalized = raw.map((record, index) => normalizeCustomer(record, index));
  const customers = await customerService.bulkCreate(normalized, req.user?._id);
  return successResponse(res, 'JSON customers imported from file successfully.', customers, { inserted: customers.length }, 201);
});

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  replaceCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
  existsCustomer,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  namedFilter,
  fieldFilter,
  sortShortcut,
  randomCustomer,
  customerHistory,
  trendingCustomers,
  recommendations,
  churnPredictions,
  retentionPredictions,
  heatmap,
  insights,
  alerts,
  dashboardSummary,
  dashboardRevenue,
  systemHealth,
  systemVersion,
  systemConfig,
  cacheClear,
  logs,
  activity,
  liveSearch,
  importJson,
  importJsonFromFile,
};
