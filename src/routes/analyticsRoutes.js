const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { analyticsLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.use(analyticsLimiter);

router.get('/customers/top-buyers', analyticsController.top('totalPurchases', 'Top purchasing customers fetched successfully.'));
router.get('/customers/top-lifetime', analyticsController.top('lifetimeValue', 'Top lifetime value customers fetched successfully.'));
router.get('/customers/top-credit', analyticsController.top('creditBalance', 'Top credit balance customers fetched successfully.'));
router.get('/customers/top-engagement', analyticsController.top('socialMediaEngagementScore', 'Top engagement customers fetched successfully.'));
router.get('/customers/top-mobile-users', analyticsController.top('mobileAppUsage', 'Top mobile users fetched successfully.'));
router.get('/customers/top-discount-users', analyticsController.top('discountUsageRate', 'Top discount users fetched successfully.'));
router.get('/customers/top-reviewers', analyticsController.top('productReviewsWritten', 'Top reviewers fetched successfully.'));
router.get('/customers/churn-analysis', analyticsController.churnAnalysis);
router.get('/customers/retention', analyticsController.retention);
router.get('/customers/session-analysis', analyticsController.sessionAnalysis);
router.get('/customers/purchase-analysis', analyticsController.purchaseAnalysis);
router.get('/customers/country-analysis', analyticsController.group('country', 'Country analysis fetched successfully.'));
router.get('/customers/city-analysis', analyticsController.group('city', 'City analysis fetched successfully.'));
router.get('/customers/signup-analysis', analyticsController.group('signupQuarter', 'Signup quarter analysis fetched successfully.'));
router.get('/customers/payment-analysis', analyticsController.paymentAnalysis);

module.exports = router;
