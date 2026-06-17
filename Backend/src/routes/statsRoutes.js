const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.get('/customers/count', statsController.count);
router.get('/customers/average-age', statsController.average('age', 'Average age fetched successfully.'));
router.get('/customers/average-lifetime', statsController.average('lifetimeValue', 'Average lifetime value fetched successfully.'));
router.get('/customers/average-credit', statsController.average('creditBalance', 'Average credit balance fetched successfully.'));
router.get('/customers/average-order-value', statsController.average('averageOrderValue', 'Average order value fetched successfully.'));
router.get('/customers/highest-purchases', statsController.highest('totalPurchases', 'Highest purchasing customer fetched successfully.'));
router.get('/customers/highest-lifetime', statsController.highest('lifetimeValue', 'Highest lifetime value customer fetched successfully.'));
router.get('/customers/highest-credit', statsController.highest('creditBalance', 'Highest credit balance customer fetched successfully.'));
router.get('/customers/country-count', statsController.groupedCount('country', 'Country count fetched successfully.'));
router.get('/customers/city-count', statsController.groupedCount('city', 'City count fetched successfully.'));
router.get('/customers/gender-count', statsController.groupedCount('gender', 'Gender count fetched successfully.'));
router.get('/customers/churn-count', statsController.churnCount);
router.get('/customers/signup-quarter-count', statsController.groupedCount('signupQuarter', 'Signup quarter count fetched successfully.'));
router.get('/customers/review-count', statsController.reviewCount);
router.get('/customers/mobile-usage', statsController.average('mobileAppUsage', 'Mobile usage statistics fetched successfully.'));

module.exports = router;
