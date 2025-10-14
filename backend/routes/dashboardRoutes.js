const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get user dashboard statistics
router.get('/stats/:userId', dashboardController.getUserDashboardStats);

// Get user's recent bookings
router.get('/recent-bookings/:userId', dashboardController.getUserRecentBookings);

// Get featured boats
router.get('/featured-boats', dashboardController.getFeaturedBoats);

module.exports = router;
