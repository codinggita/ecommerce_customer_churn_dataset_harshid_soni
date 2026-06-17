const successResponse = (res, message, data = null, meta = null, statusCode = 200) => {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

const errorResponse = (res, message, error = null, statusCode = 500) => {
  const payload = {
    success: false,
    message,
  };

  if (error) {
    payload.error = error;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse,
};
