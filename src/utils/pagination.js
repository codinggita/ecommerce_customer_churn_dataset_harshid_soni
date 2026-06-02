const AppError = require('./AppError');

const getPagination = (query = {}) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 25);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError('Page must be a positive integer.', 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError('Limit must be a positive integer between 1 and 100.', 400);
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 0,
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});

module.exports = {
  getPagination,
  buildPaginationMeta,
};
