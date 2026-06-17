const express = require('express');
const customerController = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validateRequest');
const { customerSchema, partialCustomerSchema } = require('../validators/customerValidator');

const router = express.Router();

router.use(protect);

router.post('/customers', validateBody(customerSchema), customerController.createCustomer);
router.patch('/customers/:id', validateBody(partialCustomerSchema), customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;
