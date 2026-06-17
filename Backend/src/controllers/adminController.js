const User = require('../models/User');
const Report = require('../models/Report');
const SystemLog = require('../models/SystemLog');
const customerService = require('../services/customerService');
const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

let maintenanceMode = false;

const customers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(req.query);
  return successResponse(res, 'Admin customers fetched successfully.', result.customers, result.meta);
});

const stats = asyncHandler(async (req, res) => {
  const summary = await analyticsService.dashboardSummary();
  return successResponse(res, 'Admin stats fetched successfully.', summary);
});

const churnAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.churnAnalysis();
  return successResponse(res, 'Admin churn analysis fetched successfully.', data);
});

const users = asyncHandler(async (req, res) => {
  const data = await User.find().sort({ createdAt: -1 }).limit(Number(req.query.limit) || 100);
  return successResponse(res, 'Users fetched successfully.', data);
});

const userById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found.', 404);
  return successResponse(res, 'User fetched successfully.', user);
});

const banUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { returnDocument: 'after' });
  if (!user) throw new AppError('User not found.', 404);
  return successResponse(res, 'User banned successfully.', user);
});

const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { returnDocument: 'after' });
  if (!user) throw new AppError('User not found.', 404);
  return successResponse(res, 'User unbanned successfully.', user);
});

const changeRole = asyncHandler(async (req, res) => {
  if (!['customer', 'admin'].includes(req.body.role)) {
    throw new AppError('Role must be customer or admin.', 400);
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { returnDocument: 'after' });
  if (!user) throw new AppError('User not found.', 404);
  return successResponse(res, 'User role changed successfully.', user);
});

const reports = asyncHandler(async (req, res) => {
  const data = await Report.find().sort({ createdAt: -1 }).limit(Number(req.query.limit) || 100);
  return successResponse(res, 'Reports fetched successfully.', data);
});

const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status: 'resolved', resolvedBy: req.user._id, resolvedAt: new Date() },
    { returnDocument: 'after' }
  );
  if (!report) throw new AppError('Report not found.', 404);
  return successResponse(res, 'Report resolved successfully.', report);
});

const health = asyncHandler(async (req, res) => {
  return successResponse(res, 'Admin system health fetched successfully.', {
    status: 'ok',
    maintenanceMode,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

const logs = asyncHandler(async (req, res) => {
  const data = await SystemLog.find().sort({ createdAt: -1 }).limit(Number(req.query.limit) || 100);
  return successResponse(res, 'System logs fetched successfully.', data);
});

const maintenance = asyncHandler(async (req, res) => {
  maintenanceMode = Boolean(req.body.enabled);
  return successResponse(res, 'Maintenance mode updated successfully.', { maintenanceMode });
});

const clearCache = asyncHandler(async (req, res) => {
  const { clearCache: clear } = require('../middlewares/cacheMiddleware');
  clear();
  return successResponse(res, 'Admin cache cleared successfully.');
});

const securityEvents = asyncHandler(async (req, res) => {
  const data = await SystemLog.find({ level: 'security' }).sort({ createdAt: -1 }).limit(Number(req.query.limit) || 100);
  return successResponse(res, 'Security events fetched successfully.', data);
});

module.exports = {
  customers,
  stats,
  churnAnalysis,
  users,
  userById,
  banUser,
  unbanUser,
  changeRole,
  reports,
  resolveReport,
  health,
  logs,
  maintenance,
  clearCache,
  securityEvents,
};
