const SystemLog = require('../models/SystemLog');
const env = require('../config/env');

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();
  req.requestStartedAt = startedAt;

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    if (env.debugLogs) {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    }

    if (res.statusCode >= 400) {
      SystemLog.create({
        level: res.statusCode >= 500 ? 'error' : 'warn',
        event: 'http_request',
        message: `${req.method} ${req.originalUrl} completed with ${res.statusCode}`,
        metadata: { statusCode: res.statusCode, durationMs },
        user: req.user?._id || null,
        ipAddress: req.ip,
      }).catch(() => {});
    }
  });

  next();
};

module.exports = requestLogger;
