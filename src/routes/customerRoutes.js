const express = require('express');
const customerController = require('../controllers/customerController');
const { validateBody, validateArrayBody } = require('../middlewares/validateRequest');
const {
  customerSchema,
  partialCustomerSchema,
  bulkUpdateSchema,
  bulkDeleteSchema,
} = require('../validators/customerValidator');

const router = express.Router();

router.get('/', customerController.listCustomers);
router.post('/', validateBody(customerSchema), customerController.createCustomer);

router.post('/bulk-create', validateArrayBody(customerSchema), customerController.bulkCreate);
router.patch('/bulk-update', validateBody(bulkUpdateSchema), customerController.bulkUpdate);
router.delete('/bulk-delete', validateBody(bulkDeleteSchema), customerController.bulkDelete);
router.post('/import-json', customerController.importJson);
router.post('/import-json-file', customerController.importJsonFromFile);

router.get('/exists/:id', customerController.existsCustomer);
router.get('/random', customerController.randomCustomer);
router.get('/trending', customerController.trendingCustomers);
router.get('/recent', customerController.namedFilter('recentBuyers'));
router.get('/recommendations', customerController.recommendations);
router.get('/predictions/churn', customerController.churnPredictions);
router.get('/predictions/retention', customerController.retentionPredictions);

router.get('/segments/premium', customerController.namedFilter('premium'));
router.get('/segments/high-value', customerController.namedFilter('highValue'));
router.get('/segments/loyal', customerController.namedFilter('loyal'));
router.get('/segments/risky', customerController.alerts('highChurn'));
router.get('/segments/inactive', customerController.namedFilter('inactive'));

router.get('/heatmap/countries', customerController.heatmap('country'));
router.get('/heatmap/cities', customerController.heatmap('city'));
router.get('/insights/purchases', customerController.insights('purchases'));
router.get('/insights/mobile-usage', customerController.insights('mobile'));
router.get('/insights/discounts', customerController.insights('discounts'));
router.get('/insights/engagement', customerController.insights('engagement'));

router.get('/alerts/high-churn', customerController.alerts('highChurn'));
router.get('/alerts/inactive-users', customerController.alerts('inactiveUsers'));
router.get('/alerts/high-cart-abandonment', customerController.alerts('highCartAbandonment'));

router.get('/system/health', customerController.systemHealth);
router.get('/system/version', customerController.systemVersion);
router.get('/system/config', customerController.systemConfig);
router.post('/cache/clear', customerController.cacheClear);
router.get('/logs', customerController.logs);
router.get('/activity', customerController.activity);
router.get('/live-search', customerController.liveSearch);
router.get('/dashboard/summary', customerController.dashboardSummary);
router.get('/dashboard/revenue', customerController.dashboardRevenue);

router.get('/churned', customerController.namedFilter('churned'));
router.get('/active', customerController.namedFilter('active'));
router.get('/high-value', customerController.namedFilter('highValue'));
router.get('/high-purchases', customerController.namedFilter('highPurchases'));
router.get('/high-credit', customerController.namedFilter('highCredit'));
router.get('/high-engagement', customerController.namedFilter('highEngagement'));
router.get('/high-mobile-usage', customerController.namedFilter('highMobileUsage'));
router.get('/high-discount-users', customerController.namedFilter('highDiscountUsers'));
router.get('/recent-buyers', customerController.namedFilter('recentBuyers'));
router.get('/inactive', customerController.namedFilter('inactive'));
router.get('/top-reviewers', customerController.namedFilter('topReviewers'));
router.get('/high-cart-abandonment', customerController.namedFilter('highCartAbandonment'));
router.get('/frequent-logins', customerController.namedFilter('frequentLogins'));
router.get('/loyal', customerController.namedFilter('loyal'));
router.get('/premium', customerController.namedFilter('premium'));

router.get('/filter/high-purchases', customerController.namedFilter('highPurchases'));
router.get('/filter/high-lifetime', customerController.namedFilter('highValue'));
router.get('/filter/high-credit', customerController.namedFilter('highCredit'));
router.get('/filter/high-login', customerController.namedFilter('frequentLogins'));
router.get('/filter/high-mobile', customerController.namedFilter('highMobileUsage'));
router.get('/filter/high-discount', customerController.namedFilter('highDiscountUsers'));
router.get('/filter/high-cart-abandonment', customerController.namedFilter('highCartAbandonment'));
router.get('/filter/high-engagement', customerController.namedFilter('highEngagement'));
router.get('/filter/high-reviews', customerController.namedFilter('topReviewers'));
router.get('/filter/churned', customerController.namedFilter('churned'));
router.get('/filter/active', customerController.namedFilter('active'));
router.get('/filter/low-session', customerController.namedFilter('lowSession'));
router.get('/filter/high-session', customerController.namedFilter('highSession'));
router.get('/filter/high-order-value', customerController.namedFilter('highOrderValue'));
router.get('/filter/loyal', customerController.namedFilter('loyal'));

router.get('/sort/age-desc', customerController.sortShortcut('age', -1));
router.get('/sort/purchases-desc', customerController.sortShortcut('purchases', -1));
router.get('/sort/lifetime-desc', customerController.sortShortcut('lifetimeValue', -1));
router.get('/sort/login-desc', customerController.sortShortcut('loginFrequency', -1));
router.get('/sort/credit-desc', customerController.sortShortcut('creditBalance', -1));

router.get('/country/:country', customerController.fieldFilter('country'));
router.get('/city/:city', customerController.fieldFilter('city'));
router.get('/gender/:gender', customerController.fieldFilter('gender'));
router.get('/age/:age', customerController.fieldFilter('age', 'number-exact'));
router.get('/signup-quarter/:quarter', customerController.fieldFilter('signupQuarter'));
router.get('/login-frequency/:value', customerController.fieldFilter('loginFrequency', 'number-min'));
router.get('/session-duration/:value', customerController.fieldFilter('sessionDurationAvg', 'number-min'));
router.get('/purchases/:value', customerController.fieldFilter('totalPurchases', 'number-min'));
router.get('/lifetime/:value', customerController.fieldFilter('lifetimeValue', 'number-min'));
router.get('/credit/:value', customerController.fieldFilter('creditBalance', 'number-min'));
router.get('/churn-status/:status', customerController.fieldFilter('churned', 'boolean'));
router.get('/mobile-usage/:value', customerController.fieldFilter('mobileAppUsage', 'number-min'));
router.get('/discount-rate/:value', customerController.fieldFilter('discountUsageRate', 'number-min'));
router.get('/reviews/:value', customerController.fieldFilter('productReviewsWritten', 'number-min'));

router.get('/:id/history', customerController.customerHistory);
router.get('/:id', customerController.getCustomer);
router.put('/:id', validateBody(customerSchema), customerController.replaceCustomer);
router.patch('/:id', validateBody(partialCustomerSchema), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.patch('/:id/restore', customerController.restoreCustomer);

module.exports = router;
