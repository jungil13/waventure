const express = require('express');
const router = express.Router();
const AdminBookingController = require('../controllers/adminBookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all bookings with pagination and filters
router.get('/', AdminBookingController.getAllBookings);

// Get booking statistics
router.get('/stats', AdminBookingController.getBookingStats);

// Get recent bookings
router.get('/recent', AdminBookingController.getRecentBookings);

// Get bookings by date range
router.get('/date-range', AdminBookingController.getBookingsByDateRange);

// Get payment proof for a booking
router.get('/:bookingId/payment-proof', AdminBookingController.getPaymentProof);

// Get booking by ID with full details
router.get('/:bookingId', AdminBookingController.getBookingById);

// Update booking status
router.put('/:bookingId/status', AdminBookingController.updateBookingStatus);

// Update payment status
router.put('/:bookingId/payment-status', AdminBookingController.updatePaymentStatus);

module.exports = router;
