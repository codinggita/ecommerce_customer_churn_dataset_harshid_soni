const User = require('../models/User');
const Session = require('../models/Session');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return successResponse(res, 'User registered successfully.', user, null, 201);
});

const login = asyncHandler(async (req, res) => {
  const payload = await authService.login(req.body, req);
  return successResponse(res, 'Login successful.', payload);
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.auth);
  return successResponse(res, 'Logout successful.', result);
});

const profile = asyncHandler(async (req, res) => {
  return successResponse(res, 'Profile fetched successfully.', req.user.toSafeObject());
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { returnDocument: 'after', runValidators: true });
  return successResponse(res, 'Profile updated successfully.', user.toSafeObject());
});

const deleteProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isBanned: true });
  await authService.logoutAll(req.user._id);
  return successResponse(res, 'Profile deleted successfully.');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const token = await authService.generatePasswordReset(req.body.email);
  return successResponse(res, 'Password reset token generated successfully.', { resetToken: token });
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await authService.resetPassword(req.body);
  return successResponse(res, 'Password reset successfully.', user);
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await authService.changePassword(req.user._id, req.body);
  return successResponse(res, 'Password changed successfully.', user);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email.toLowerCase() },
    { isEmailVerified: true },
    { returnDocument: 'after' }
  );
  if (!user) throw new AppError('User not found.', 404);
  return successResponse(res, 'Email verified successfully.', user.toSafeObject());
});

const sendOtp = asyncHandler(async (req, res) => {
  const otp = await authService.sendOtp(req.body.email);
  return successResponse(res, 'OTP generated successfully.', { otp });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const user = await authService.verifyOtp(req.body);
  return successResponse(res, 'OTP verified successfully.', user);
});

const resendVerification = asyncHandler(async (req, res) => {
  const otp = await authService.sendOtp(req.body.email);
  return successResponse(res, 'Verification OTP resent successfully.', { otp });
});

const session = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id, active: true }).sort({ createdAt: -1 });
  return successResponse(res, 'Active sessions fetched successfully.', sessions);
});

const deleteSession = asyncHandler(async (req, res) => {
  const result = await authService.logoutAll(req.user._id);
  return successResponse(res, 'All sessions deleted successfully.', result);
});

module.exports = {
  register,
  login,
  logout,
  profile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp,
  verifyOtp,
  resendVerification,
  session,
  deleteSession,
};
