const express = require('express');
const middlewareController = require('../controllers/middlewarePracticeController');
const { protect } = require('../middlewares/authMiddleware');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');
const { searchLimiter } = require('../middlewares/rateLimiters');
const { validateBody } = require('../middlewares/validateRequest');
const { emailSchema } = require('../validators/authValidator');

const router = express.Router();

router.get('/logger', middlewareController.logger);
router.get('/auth', protect, middlewareController.auth);
router.get('/cache', cacheMiddleware(10), middlewareController.cache);
router.get('/rate-limit', searchLimiter, middlewareController.rateLimit);
router.get('/error-handler', middlewareController.errorHandler);
router.get('/request-time', middlewareController.requestTime);
router.get('/security', middlewareController.logger);
router.get('/cors', middlewareController.logger);
router.get('/compression', middlewareController.logger);
router.post('/validation', validateBody(emailSchema), middlewareController.logger);

module.exports = router;
