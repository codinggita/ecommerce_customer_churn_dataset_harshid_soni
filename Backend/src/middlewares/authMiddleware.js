const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7);
};

const protect = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      throw new AppError('Authentication token is required.', 401);
    }

    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.type !== 'access') {
      throw new AppError('Access token is required.', 401);
    }

    const [user, session] = await Promise.all([
      User.findById(payload.sub),
      Session.findOne({ jti: payload.jti, active: true }),
    ]);

    if (!user || user.isBanned) {
      throw new AppError('Authenticated user is not available.', 401);
    }

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Session expired or revoked.', 401);
    }

    req.user = user;
    req.auth = payload;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError(error.message, 401));
    }
    return next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) {
    return next();
  }
  return protect(req, res, next);
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to access this resource.', 403));
  }
  return next();
};

module.exports = {
  protect,
  optionalAuth,
  requireRole,
};
