const express = require('express');
const router = express.Router();
const AdminReportsController = require('../controllers/adminReportsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get overall statistics
router.get('/stats', AdminReportsController.getOverallStats);

// Get revenue data for charts
router.get('/revenue', AdminReportsController.getRevenueData);

// Get booking trends
router.get('/booking-trends', AdminReportsController.getBookingTrends);

// Get top performing boats
router.get('/top-boats', AdminReportsController.getTopBoats);

// Get customer analytics
router.get('/customer-analytics', AdminReportsController.getCustomerAnalytics);

// Get location statistics
router.get('/location-stats', AdminReportsController.getLocationStats);

// Get payment method statistics
router.get('/payment-method-stats', AdminReportsController.getPaymentMethodStats);

// Get growth metrics
router.get('/growth-metrics', AdminReportsController.getGrowthMetrics);

// Get recent activity
router.get('/recent-activity', AdminReportsController.getRecentActivity);

// Get comprehensive dashboard data (all data in one request)
router.get('/dashboard', AdminReportsController.getDashboardData);

module.exports = router;
