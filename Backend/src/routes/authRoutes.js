const express = require('express');
const authController = require('../controllers/authController');
const { validateBody } = require('../middlewares/validateRequest');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiters');
const {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  emailSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyOtpSchema,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', authLimiter, validateBody(registerSchema), authController.register);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.get('/profile', protect, authController.profile);
router.patch('/profile', protect, validateBody(profileUpdateSchema), authController.updateProfile);
router.delete('/profile', protect, authController.deleteProfile);
router.post('/forgot-password', authLimiter, validateBody(emailSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', protect, validateBody(changePasswordSchema), authController.changePassword);
router.post('/verify-email', validateBody(emailSchema), authController.verifyEmail);
router.post('/send-otp', authLimiter, validateBody(emailSchema), authController.sendOtp);
router.post('/verify-otp', authLimiter, validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-verification', authLimiter, validateBody(emailSchema), authController.resendVerification);
router.get('/session', protect, authController.session);
router.delete('/session', protect, authController.deleteSession);

module.exports = router;
