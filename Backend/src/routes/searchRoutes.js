const express = require('express');
const searchController = require('../controllers/searchController');
const { searchLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.get('/customers', searchLimiter, searchController.searchCustomers);

module.exports = router;
