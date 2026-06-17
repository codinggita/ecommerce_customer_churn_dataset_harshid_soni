const Customer = require('../models/Customer');
const SearchLog = require('../models/SearchLog');
const thresholds = require('../utils/thresholds');

const activeMatch = { isDeleted: false };

const topByField = (field, limit = 10, match = {}) => Customer.find({ ...activeMatch, ...match })
  .sort({ [field]: -1 })
  .limit(Number(limit) || 10);

const groupCount = (field) => Customer.aggregate([
  { $match: activeMatch },
  { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $project: { _id: 0, value: '$_id', count: 1 } },
]);

const averageMetric = (field) => Customer.aggregate([
  { $match: activeMatch },
  { $group: { _id: null, average: { $avg: `$${field}` }, min: { $min: `$${field}` }, max: { $max: `$${field}` } } },
  { $project: { _id: 0, average: { $round: ['$average', 2] }, min: 1, max: 1 } },
]);

const countWhere = (match = {}) => Customer.countDocuments({ ...activeMatch, ...match });

const churnAnalysis = () => Customer.aggregate([
  { $match: activeMatch },
  {
    $group: {
      _id: '$churned',
      count: { $sum: 1 },
      avgLifetimeValue: { $avg: '$lifetimeValue' },
      avgLoginFrequency: { $avg: '$loginFrequency' },
      avgDaysSinceLastPurchase: { $avg: '$daysSinceLastPurchase' },
      avgCartAbandonmentRate: { $avg: '$cartAbandonmentRate' },
    },
  },
  {
    $project: {
      _id: 0,
      churned: '$_id',
      count: 1,
      avgLifetimeValue: { $round: ['$avgLifetimeValue', 2] },
      avgLoginFrequency: { $round: ['$avgLoginFrequency', 2] },
      avgDaysSinceLastPurchase: { $round: ['$avgDaysSinceLastPurchase', 2] },
      avgCartAbandonmentRate: { $round: ['$avgCartAbandonmentRate', 2] },
    },
  },
]);

const retentionAnalysis = () => Customer.aggregate([
  { $match: activeMatch },
  {
    $bucket: {
      groupBy: '$membershipYears',
      boundaries: [0, 1, 2, 3, 5, 10, 50],
      default: '10+',
      output: {
        count: { $sum: 1 },
        churned: { $sum: { $cond: ['$churned', 1, 0] } },
        avgLifetimeValue: { $avg: '$lifetimeValue' },
      },
    },
  },
  {
    $project: {
      bucket: '$_id',
      count: 1,
      churned: 1,
      churnRate: { $round: [{ $multiply: [{ $divide: ['$churned', '$count'] }, 100] }, 2] },
      avgLifetimeValue: { $round: ['$avgLifetimeValue', 2] },
    },
  },
]);

const purchaseAnalysis = () => Customer.aggregate([
  { $match: activeMatch },
  {
    $group: {
      _id: null,
      totalPurchases: { $sum: '$totalPurchases' },
      avgPurchases: { $avg: '$totalPurchases' },
      avgOrderValue: { $avg: '$averageOrderValue' },
      totalLifetimeValue: { $sum: '$lifetimeValue' },
    },
  },
  {
    $project: {
      _id: 0,
      totalPurchases: { $round: ['$totalPurchases', 2] },
      avgPurchases: { $round: ['$avgPurchases', 2] },
      avgOrderValue: { $round: ['$avgOrderValue', 2] },
      totalLifetimeValue: { $round: ['$totalLifetimeValue', 2] },
    },
  },
]);

const sessionAnalysis = () => Customer.aggregate([
  { $match: activeMatch },
  {
    $bucket: {
      groupBy: '$sessionDurationAvg',
      boundaries: [0, 10, 20, 30, 40, 60, 1000],
      output: { count: { $sum: 1 }, avgPages: { $avg: '$pagesPerSession' } },
    },
  },
  { $project: { bucket: '$_id', count: 1, avgPages: { $round: ['$avgPages', 2] } } },
]);

const paymentAnalysis = () => groupCount('paymentMethodDiversity');

const searchTrends = () => SearchLog.aggregate([
  { $group: { _id: '$query', count: { $sum: 1 }, avgResults: { $avg: '$resultCount' } } },
  { $sort: { count: -1 } },
  { $limit: 20 },
  { $project: { _id: 0, query: '$_id', count: 1, avgResults: { $round: ['$avgResults', 2] } } },
]);

const dashboardSummary = async () => {
  const [
    total,
    churned,
    highValue,
    inactive,
    avgLifetime,
    countryDistribution,
  ] = await Promise.all([
    countWhere(),
    countWhere({ churned: true }),
    countWhere({ lifetimeValue: { $gte: thresholds.highLifetimeValue } }),
    countWhere({ daysSinceLastPurchase: { $gte: thresholds.inactivePurchaseDays } }),
    averageMetric('lifetimeValue'),
    groupCount('country'),
  ]);

  return {
    total,
    churned,
    active: total - churned,
    churnRate: total ? Number(((churned / total) * 100).toFixed(2)) : 0,
    highValue,
    inactive,
    averageLifetimeValue: avgLifetime[0]?.average || 0,
    topCountries: countryDistribution.slice(0, 5),
  };
};

const customerInsights = (type) => {
  const pipelineByType = {
    purchases: [
      { $match: activeMatch },
      { $group: { _id: '$country', avgPurchases: { $avg: '$totalPurchases' }, avgOrderValue: { $avg: '$averageOrderValue' } } },
      { $sort: { avgPurchases: -1 } },
    ],
    mobile: [
      { $match: activeMatch },
      { $group: { _id: '$country', avgMobileUsage: { $avg: '$mobileAppUsage' }, count: { $sum: 1 } } },
      { $sort: { avgMobileUsage: -1 } },
    ],
    discounts: [
      { $match: activeMatch },
      { $group: { _id: '$signupQuarter', avgDiscountUsage: { $avg: '$discountUsageRate' }, churned: { $sum: { $cond: ['$churned', 1, 0] } } } },
      { $sort: { avgDiscountUsage: -1 } },
    ],
    engagement: [
      { $match: activeMatch },
      { $group: { _id: '$country', avgEngagement: { $avg: '$socialMediaEngagementScore' }, avgEmailOpen: { $avg: '$emailOpenRate' } } },
      { $sort: { avgEngagement: -1 } },
    ],
  };

  return Customer.aggregate(pipelineByType[type] || pipelineByType.purchases);
};

module.exports = {
  topByField,
  groupCount,
  averageMetric,
  countWhere,
  churnAnalysis,
  retentionAnalysis,
  purchaseAnalysis,
  sessionAnalysis,
  paymentAnalysis,
  searchTrends,
  dashboardSummary,
  customerInsights,
};
