const Joi = require('joi');

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  });

const emailField = Joi.string().trim().lowercase().email().max(254).required();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: emailField,
  password: passwordSchema,
  role: Joi.string().valid('customer', 'admin').default('customer'),
});

const loginSchema = Joi.object({
  email: emailField,
  password: Joi.string().min(1).max(128).required(),
});

const profileUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  email: Joi.string().trim().lowercase().email().max(254),
}).min(1);

const emailSchema = Joi.object({
  email: emailField,
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().min(16).max(256).required(),
  password: passwordSchema,
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).max(128).required(),
  newPassword: passwordSchema,
});

const verifyOtpSchema = Joi.object({
  email: emailField,
  otp: Joi.string().trim().pattern(/^\d{6}$/).required().messages({
    'string.pattern.base': 'OTP must be a 6-digit code.',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  emailSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyOtpSchema,
};
