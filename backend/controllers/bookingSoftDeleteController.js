const Booking = require('../models/bookingModel');

const bookingSoftDeleteController = {
  // Soft delete a booking
  softDeleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;
      const userId = req.user.user_id; // Assuming user is authenticated

      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }

      const result = await Booking.softDelete(bookingId, userId, reason);
      
      res.json({
        success: true,
        message: 'Booking deleted successfully',
        data: result
      });
    } catch (error) {
      console.error('Error soft deleting booking:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete booking'
      });
    }
  },

  // Restore a soft deleted booking
  restoreBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;
      const userId = req.user.user_id; // Assuming user is authenticated

      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }

      const result = await Booking.restore(bookingId, userId, reason);
      
      res.json({
        success: true,
        message: 'Booking restored successfully',
        data: result
      });
    } catch (error) {
      console.error('Error restoring booking:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to restore booking'
      });
    }
  },

  // Get booking history
  getBookingHistory: async (req, res) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }

      const history = await Booking.getHistory(bookingId);
      
      res.json({
        success: true,
        data: history,
        message: 'Booking history retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting booking history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve booking history'
      });
    }
  },

  // Get deleted bookings for a user
  getDeletedBookings: async (req, res) => {
    try {
      const userId = req.user.user_id; // Assuming user is authenticated

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const deletedBookings = await Booking.getDeletedBookings(userId);
      
      res.json({
        success: true,
        data: deletedBookings,
        message: 'Deleted bookings retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting deleted bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve deleted bookings'
      });
    }
  }
};

module.exports = bookingSoftDeleteController;
