const AppError = require('./AppError');

const numericQueryMap = {
  minAge: ['age', '$gte'],
  maxAge: ['age', '$lte'],
  membershipYears: ['membershipYears', '$gte'],
  minPurchases: ['totalPurchases', '$gte'],
  minLifetime: ['lifetimeValue', '$gte'],
  minCredit: ['creditBalance', '$gte'],
  minLoginFrequency: ['loginFrequency', '$gte'],
  minMobileUsage: ['mobileAppUsage', '$gte'],
  minDiscountRate: ['discountUsageRate', '$gte'],
  minSessionDuration: ['sessionDurationAvg', '$gte'],
};

const exactQueryMap = {
  country: 'country',
  city: 'city',
  gender: 'gender',
  signupQuarter: 'signupQuarter',
};

const regexExact = (value) => new RegExp(`^${String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

const parseBoolean = (value) => {
  if (['1', 'true', true, 1, 'yes', 'churned'].includes(value)) return true;
  if (['0', 'false', false, 0, 'no', 'active'].includes(value)) return false;
  throw new AppError('Boolean query value must be true/false or 1/0.', 400);
};

const addNumericCondition = (filter, field, operator, value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new AppError(`${field} must be numeric.`, 400);
  }

  filter[field] = {
    ...(filter[field] || {}),
    [operator]: number,
  };
};

const buildCustomerFilter = (query = {}, baseFilter = {}) => {
  const filter = {
    isDeleted: query.includeDeleted === 'true' ? { $in: [true, false] } : false,
    ...baseFilter,
  };

  for (const [queryKey, field] of Object.entries(exactQueryMap)) {
    if (query[queryKey]) {
      filter[field] = regexExact(query[queryKey]);
    }
  }

  for (const [queryKey, [field, operator]] of Object.entries(numericQueryMap)) {
    if (query[queryKey] !== undefined) {
      addNumericCondition(filter, field, operator, query[queryKey]);
    }
  }

  if (query.churned !== undefined) {
    filter.churned = parseBoolean(query.churned);
  }

  if (query.search) {
    const searchRegex = new RegExp(String(query.search), 'i');
    filter.$or = [
      { customerCode: searchRegex },
      { country: searchRegex },
      { city: searchRegex },
      { gender: searchRegex },
      { signupQuarter: searchRegex },
    ];
  }

  return filter;
};

const buildSort = (sort = '-createdAt') => {
  const sortMap = {
    age: 'age',
    membershipYears: 'membershipYears',
    loginFrequency: 'loginFrequency',
    sessionDuration: 'sessionDurationAvg',
    purchases: 'totalPurchases',
    averageOrderValue: 'averageOrderValue',
    lifetimeValue: 'lifetimeValue',
    creditBalance: 'creditBalance',
    discountRate: 'discountUsageRate',
    mobileUsage: 'mobileAppUsage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };

  const direction = String(sort).startsWith('-') ? -1 : 1;
  const key = String(sort).replace(/^-/, '');
  const field = sortMap[key] || sortMap.createdAt;

  return { [field]: direction };
};

module.exports = {
  buildCustomerFilter,
  buildSort,
  regexExact,
  parseBoolean,
};
