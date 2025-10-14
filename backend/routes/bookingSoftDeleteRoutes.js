const express = require('express');
const router = express.Router();
const bookingSoftDeleteController = require('../controllers/bookingSoftDeleteController');
const auth = require('../middleware/authMiddleware');

// Soft delete a booking
router.delete('/:bookingId', auth, bookingSoftDeleteController.softDeleteBooking);

// Restore a soft deleted booking
router.put('/:bookingId/restore', auth, bookingSoftDeleteController.restoreBooking);

// Get booking history
router.get('/:bookingId/history', auth, bookingSoftDeleteController.getBookingHistory);

// Get deleted bookings for a user
router.get('/deleted', auth, bookingSoftDeleteController.getDeletedBookings);

module.exports = router;
