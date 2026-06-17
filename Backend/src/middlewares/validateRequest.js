const AppError = require('../utils/AppError');

const validateBody = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    return next(
      new AppError(
        'Request validation failed.',
        400,
        error.details.map((detail) => detail.message)
      )
    );
  }

  req.body = value;
  return next();
};

const validateArrayBody = (itemSchema) => (req, res, next) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return next(new AppError('Request body must be a non-empty array.', 400));
  }

  const values = [];
  const errors = [];

  req.body.forEach((item, index) => {
    const { value, error } = itemSchema.validate(item, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      errors.push({ index, details: error.details.map((detail) => detail.message) });
    }
    values.push(value);
  });

  if (errors.length) {
    return next(new AppError('Request validation failed.', 400, errors));
  }

  req.body = values;
  return next();
};

module.exports = {
  validateBody,
  validateArrayBody,
};
