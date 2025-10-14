const express = require('express');
const router = express.Router();
const AdminDashboardController = require('../controllers/adminDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Get admin profile
router.get('/profile', authMiddleware, AdminDashboardController.getAdminProfile);

// Get dashboard overview data
router.get('/overview', AdminDashboardController.getDashboardOverview);

// Get system activities
router.get('/activities', AdminDashboardController.getSystemActivities);

// Get booking statistics for charts
router.get('/stats/bookings', AdminDashboardController.getBookingStats);

// Get user statistics for charts
router.get('/stats/users', AdminDashboardController.getUserStats);

// Get boat status statistics for charts
router.get('/stats/boats', AdminDashboardController.getBoatStatusStats);

// Get payment statistics for charts
router.get('/stats/payments', AdminDashboardController.getPaymentStats);

// Get all dashboard data (overview + charts data)
router.get('/all', AdminDashboardController.getAllDashboardData);

module.exports = router;
