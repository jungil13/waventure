const express = require('express');
const router = express.Router();
const AdminCustomerController = require('../controllers/adminCustomerController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all customers with pagination and filters
router.get('/', AdminCustomerController.getAllCustomers);

// Get customer statistics
router.get('/stats', AdminCustomerController.getCustomerStats);

// Get top spending customers
router.get('/top-spending', AdminCustomerController.getTopSpendingCustomers);

// Get customers by location
router.get('/by-location', AdminCustomerController.getCustomersByLocation);

// Get customer by ID with full details
router.get('/:customerId', AdminCustomerController.getCustomerById);

module.exports = router;
