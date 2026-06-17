const Joi = require('joi');

const objectId = Joi.string().hex().length(24);
const nonNegativeNumber = Joi.number().min(0);
const nonNegativeInteger = Joi.number().integer().min(0);

const customerFields = {
  customerCode: Joi.string().trim().min(1).max(80),
  age: Joi.number().integer().min(0).max(120),
  gender: Joi.string().valid('Male', 'Female', 'Other'),
  country: Joi.string().trim().min(1).max(100),
  city: Joi.string().trim().min(1).max(100),
  membershipYears: nonNegativeNumber,
  loginFrequency: nonNegativeNumber,
  sessionDurationAvg: nonNegativeNumber,
  pagesPerSession: nonNegativeNumber,
  cartAbandonmentRate: nonNegativeNumber,
  wishlistItems: nonNegativeInteger,
  totalPurchases: nonNegativeInteger,
  averageOrderValue: nonNegativeNumber,
  daysSinceLastPurchase: nonNegativeInteger,
  discountUsageRate: nonNegativeNumber,
  returnsRate: nonNegativeNumber,
  emailOpenRate: nonNegativeNumber,
  customerServiceCalls: nonNegativeInteger,
  productReviewsWritten: nonNegativeInteger,
  socialMediaEngagementScore: nonNegativeNumber,
  mobileAppUsage: nonNegativeNumber,
  paymentMethodDiversity: nonNegativeInteger,
  lifetimeValue: nonNegativeNumber,
  creditBalance: nonNegativeNumber,
  churned: Joi.boolean(),
  signupQuarter: Joi.string().valid('Q1', 'Q2', 'Q3', 'Q4'),
};

const requiredCustomerFields = Object.keys(customerFields).filter((field) => field !== 'customerCode');
const bulkUpdateFields = { ...customerFields, customerCode: Joi.forbidden() };

const customerSchema = Joi.object(customerFields).fork(
  requiredCustomerFields,
  (schema) => schema.required()
);

const partialCustomerSchema = Joi.object(customerFields).min(1);

const bulkUpdateSchema = Joi.object({
  ids: Joi.array().items(objectId.required()).min(1).unique().required(),
  update: Joi.object(bulkUpdateFields).min(1).required(),
});

const bulkDeleteSchema = Joi.object({
  ids: Joi.array().items(objectId.required()).min(1).unique().required(),
});

module.exports = {
  customerSchema,
  partialCustomerSchema,
  bulkUpdateSchema,
  bulkDeleteSchema,
};
