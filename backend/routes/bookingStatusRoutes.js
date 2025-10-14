const express = require('express');
const router = express.Router();
const bookingStatusController = require('../controllers/bookingStatusController');

// Update booking status (for boat owners)
router.put('/:bookingId/status', bookingStatusController.updateBookingStatus);

// Get booking details
router.get('/:bookingId', bookingStatusController.getBookingDetails);

module.exports = router;
