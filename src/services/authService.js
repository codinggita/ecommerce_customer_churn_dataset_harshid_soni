const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const hashValue = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

const signToken = (user, jti, type, expiresIn) => jwt.sign(
  {
    sub: user._id.toString(),
    role: user.role,
    jti,
    type,
  },
  env.jwtSecret,
  { expiresIn }
);

const register = async ({ name, email, password, role = 'customer' }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('Email already registered.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role });
  return user.toSafeObject();
};

const createSessionTokens = async (user, req) => {
  const jti = crypto.randomUUID();
  const refreshJti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    user: user._id,
    jti,
    refreshJti,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
    expiresAt,
  });

  return {
    accessToken: signToken(user, jti, 'access', env.jwtExpiresIn),
    refreshToken: signToken(user, refreshJti, 'refresh', env.jwtRefreshExpiresIn),
    expiresAt,
  };
};

const login = async ({ email, password }, req) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.isBanned) {
    throw new AppError('Account is banned.', 403);
  }

  const tokens = await createSessionTokens(user, req);
  return {
    user: user.toSafeObject(),
    ...tokens,
  };
};

const logout = async (payload) => {
  if (!payload?.jti) return { modifiedCount: 0 };
  return Session.updateOne({ jti: payload.jti }, { $set: { active: false } });
};

const logoutAll = async (userId) => Session.updateMany({ user: userId }, { $set: { active: false } });

const refreshToken = async (token, req) => {
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new AppError(error.message, 401);
  }

  if (payload.type !== 'refresh') {
    throw new AppError('Refresh token is required.', 401);
  }

  const session = await Session.findOne({ refreshJti: payload.jti, active: true });
  const user = await User.findById(payload.sub);
  if (!session || !user) {
    throw new AppError('Refresh session is invalid.', 401);
  }

  await Session.updateOne({ _id: session._id }, { $set: { active: false } });
  return createSessionTokens(user, req);
};

const generatePasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordTokenHash');
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  const token = crypto.randomBytes(24).toString('hex');
  user.resetPasswordTokenHash = hashValue(token);
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
  return token;
};

const resetPassword = async ({ token, password }) => {
  const user = await User.findOne({
    resetPasswordTokenHash: hashValue(token),
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select('+resetPasswordTokenHash');

  if (!user) {
    throw new AppError('Password reset token is invalid or expired.', 400);
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();
  await logoutAll(user._id);
  return user.toSafeObject();
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect.', 400);
  }
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  return user.toSafeObject();
};

const sendOtp = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+otpHash');
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.otpHash = hashValue(otp);
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  return otp;
};

const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
    otpHash: hashValue(otp),
    otpExpiresAt: { $gt: new Date() },
  }).select('+otpHash');

  if (!user) {
    throw new AppError('OTP is invalid or expired.', 400);
  }

  user.isEmailVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();
  return user.toSafeObject();
};

module.exports = {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
  generatePasswordReset,
  resetPassword,
  changePassword,
  sendOtp,
  verifyOtp,
  createSessionTokens,
  hashValue,
};
