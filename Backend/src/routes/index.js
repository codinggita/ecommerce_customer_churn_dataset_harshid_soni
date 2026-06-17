const express = require('express');
const customerRoutes = require('./customerRoutes');
const searchRoutes = require('./searchRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const statsRoutes = require('./statsRoutes');
const authRoutes = require('./authRoutes');
const jwtRoutes = require('./jwtRoutes');
const adminRoutes = require('./adminRoutes');
const protectedRoutes = require('./protectedRoutes');
const middlewareRoutes = require('./middlewareRoutes');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
    return res.status(204).send();
  }
  return next();
});

router.get('/health', (req, res) => successResponse(res, 'API health check passed.', {
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
}));

router.use('/customers', customerRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/stats', statsRoutes);
router.use('/auth', authRoutes);
router.use('/jwt', jwtRoutes);
router.use('/admin', adminRoutes);
router.use('/protected', protectedRoutes);
router.use('/middleware', middlewareRoutes);

module.exports = router;
