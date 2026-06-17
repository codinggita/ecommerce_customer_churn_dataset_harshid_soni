const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_customer_churn',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 120,
  debugLogs: String(process.env.DEBUG_LOGS || 'true').toLowerCase() === 'true',
};

module.exports = env;
