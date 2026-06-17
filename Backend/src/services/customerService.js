const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const AppError = require('../utils/AppError');
const { buildCustomerFilter, buildSort, regexExact, parseBoolean } = require('../utils/filterBuilder');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const thresholds = require('../utils/thresholds');

const ensureObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid customer ID.', 400);
  }
};

const listCustomers = async (query = {}, baseFilter = {}) => {
  const pagination = getPagination(query);
  const filter = buildCustomerFilter(query, baseFilter);
  const sort = buildSort(query.sort);
  const projection = query.fields ? String(query.fields).split(',').join(' ') : '';

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .select(projection)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit),
    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    meta: buildPaginationMeta({ ...pagination, total }),
  };
};

const getCustomerById = async (id, includeDeleted = false) => {
  ensureObjectId(id);
  const filter = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };
  const customer = await Customer.findOne(filter);
  if (!customer) {
    throw new AppError('Customer not found.', 404);
  }
  return customer;
};

const createCustomer = async (payload, userId = null) => {
  const customer = await Customer.create({
    customerCode: payload.customerCode || `CUST-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    ...payload,
    history: [{ action: 'created', changes: payload, changedBy: userId }],
  });
  return customer;
};

const replaceCustomer = async (id, payload, userId = null) => {
  ensureObjectId(id);
  const customer = await Customer.findOneAndReplace(
    { _id: id, isDeleted: false },
    {
      customerCode: payload.customerCode || `CUST-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      ...payload,
      history: [{ action: 'replaced', changes: payload, changedBy: userId }],
    },
    { returnDocument: 'after', runValidators: true }
  );

  if (!customer) {
    throw new AppError('Customer not found.', 404);
  }
  return customer;
};

const updateCustomer = async (id, payload, userId = null, action = 'updated') => {
  ensureObjectId(id);
  const customer = await Customer.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: payload,
      $push: { history: { action, changes: payload, changedBy: userId } },
    },
    { returnDocument: 'after', runValidators: true }
  );

  if (!customer) {
    throw new AppError('Customer not found.', 404);
  }
  return customer;
};

const softDeleteCustomer = async (id, userId = null) => {
  return updateCustomer(
    id,
    { isDeleted: true, deletedAt: new Date() },
    userId,
    'deleted'
  );
};

const restoreCustomer = async (id, userId = null) => {
  ensureObjectId(id);
  const customer = await Customer.findOneAndUpdate(
    { _id: id, isDeleted: true },
    {
      $set: { isDeleted: false, deletedAt: null },
      $push: { history: { action: 'restored', changedBy: userId } },
    },
    { returnDocument: 'after', runValidators: true }
  );
  if (!customer) {
    throw new AppError('Deleted customer not found.', 404);
  }
  return customer;
};

const existsCustomer = async (id) => {
  ensureObjectId(id);
  return Customer.exists({ _id: id, isDeleted: false });
};

const bulkCreate = async (records, userId = null) => {
  const documents = records.map((record, index) => ({
    customerCode: record.customerCode || `CUST-BULK-${Date.now()}-${index}`,
    ...record,
    history: [{ action: 'created', changes: record, changedBy: userId }],
  }));
  return Customer.insertMany(documents, { ordered: false });
};

const bulkUpdate = async ({ ids, update }, userId = null) => {
  ids.forEach(ensureObjectId);
  const result = await Customer.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    {
      $set: update,
      $push: { history: { action: 'bulk-updated', changes: update, changedBy: userId } },
    },
    { runValidators: true }
  );
  return result;
};

const bulkDelete = async ({ ids }, userId = null) => {
  ids.forEach(ensureObjectId);
  return Customer.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    {
      $set: { isDeleted: true, deletedAt: new Date() },
      $push: { history: { action: 'deleted', changedBy: userId } },
    }
  );
};

const routeFilterMap = {
  churned: { churned: true },
  active: { churned: false },
  highValue: { lifetimeValue: { $gte: thresholds.highLifetimeValue } },
  highPurchases: { totalPurchases: { $gte: thresholds.highPurchases } },
  highCredit: { creditBalance: { $gte: thresholds.highCreditBalance } },
  highEngagement: {
    $or: [
      { socialMediaEngagementScore: { $gte: 55 } },
      { emailOpenRate: { $gte: 40 } },
      { loginFrequency: { $gte: thresholds.highLoginFrequency } },
    ],
  },
  highMobileUsage: { mobileAppUsage: { $gte: thresholds.highMobileUsage } },
  highDiscountUsers: { discountUsageRate: { $gte: thresholds.highDiscountRate } },
  recentBuyers: { daysSinceLastPurchase: { $lte: thresholds.recentPurchaseDays } },
  inactive: { daysSinceLastPurchase: { $gte: thresholds.inactivePurchaseDays } },
  topReviewers: { productReviewsWritten: { $gte: thresholds.highReviews } },
  highCartAbandonment: { cartAbandonmentRate: { $gte: thresholds.highCartAbandonmentRate } },
  frequentLogins: { loginFrequency: { $gte: thresholds.highLoginFrequency } },
  loyal: { membershipYears: { $gte: thresholds.loyalMembershipYears } },
  premium: {
    lifetimeValue: { $gte: thresholds.premiumLifetimeValue },
    totalPurchases: { $gte: thresholds.highPurchases },
  },
  lowSession: { sessionDurationAvg: { $lte: thresholds.lowSessionDuration } },
  highSession: { sessionDurationAvg: { $gte: thresholds.highSessionDuration } },
  highOrderValue: { averageOrderValue: { $gte: thresholds.highAverageOrderValue } },
};

const listByNamedFilter = (name, query = {}) => {
  const filter = routeFilterMap[name];
  if (!filter) {
    throw new AppError('Unknown customer filter.', 400);
  }
  return listCustomers(query, filter);
};

const listByFieldRoute = (field, value, query = {}, mode = 'exact') => {
  const filter = {};

  if (mode === 'boolean') {
    filter[field] = parseBoolean(value);
  } else if (mode === 'number-exact') {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new AppError(`${field} must be numeric.`, 400);
    filter[field] = number;
  } else if (mode === 'number-min') {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new AppError(`${field} must be numeric.`, 400);
    filter[field] = { $gte: number };
  } else {
    filter[field] = regexExact(value);
  }

  return listCustomers(query, filter);
};

const getRandomCustomer = async () => {
  const [customer] = await Customer.aggregate([
    { $match: { isDeleted: false } },
    { $sample: { size: 1 } },
  ]);
  if (!customer) {
    throw new AppError('No customers available.', 404);
  }
  return customer;
};

const getHistory = async (id) => {
  const customer = await getCustomerById(id, true);
  return customer.history;
};

module.exports = {
  listCustomers,
  getCustomerById,
  createCustomer,
  replaceCustomer,
  updateCustomer,
  softDeleteCustomer,
  restoreCustomer,
  existsCustomer,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  listByNamedFilter,
  listByFieldRoute,
  getRandomCustomer,
  getHistory,
  routeFilterMap,
};
