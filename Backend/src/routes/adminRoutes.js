const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
const { adminLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.use(adminLimiter);
router.use(protect);
router.use(requireRole('admin'));

router.get('/customers', adminController.customers);
router.get('/dashboard', adminController.stats);
router.get('/stats', adminController.stats);
router.get('/churn-analysis', adminController.churnAnalysis);
router.get('/users', adminController.users);
router.get('/users/:id', adminController.userById);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.patch('/users/:id/role', adminController.changeRole);
router.get('/reports', adminController.reports);
router.patch('/reports/:id/resolve', adminController.resolveReport);
router.get('/system/health', adminController.health);
router.get('/system/logs', adminController.logs);
router.post('/system/maintenance', adminController.maintenance);
router.delete('/cache/clear', adminController.clearCache);
router.get('/security/events', adminController.securityEvents);

module.exports = router;
