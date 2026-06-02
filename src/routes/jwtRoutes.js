const express = require('express');
const jwtController = require('../controllers/jwtController');
const { protect, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', protect, jwtController.profile);
router.get('/dashboard', protect, jwtController.dashboard);
router.post('/generate-token', jwtController.generateToken);
router.post('/verify-token', jwtController.verifyToken);
router.post('/refresh-token', jwtController.refreshToken);
router.delete('/revoke-token', jwtController.revokeToken);
router.get('/private-customers', protect, jwtController.privateCustomers);
router.get('/private-stats', protect, jwtController.privateStats);
router.get('/admin', protect, requireRole('admin'), jwtController.dashboard);
router.get('/customer-insights', protect, jwtController.customerInsights);

module.exports = router;
