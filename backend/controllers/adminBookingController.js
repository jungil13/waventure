const AdminBookingModel = require('../models/adminBookingModel');

// Helper function to update boat status based on booking status
async function updateBoatStatusBasedOnBooking(bookingId, bookingStatus) {
  try {
    // Get boat ID from booking
    const boatId = await AdminBookingModel.getBoatIdFromBooking(bookingId);
    if (!boatId) {
      console.error(`No boat ID found for booking ${bookingId}`);
      return;
    }

    let boatStatus;
    
    switch (bookingStatus) {
      case 'Confirmed':
        // When booking is confirmed, mark boat as rented
        boatStatus = 'Rented';
        break;
      case 'Completed':
      case 'Cancelled':
        // When booking is completed or cancelled, mark boat as available
        boatStatus = 'Available';
        break;
      case 'Pending':
        // Keep boat available when booking is pending
        boatStatus = 'Available';
        break;
      default:
        // Default to available for any other status
        boatStatus = 'Available';
    }
    
    // Update the boat status
    await AdminBookingModel.updateBoatStatus(boatId, boatStatus);
    
    console.log(`Boat ${boatId} status updated to ${boatStatus} due to booking ${bookingId} status: ${bookingStatus}`);
  } catch (error) {
    console.error('Error updating boat status:', error);
    // Don't throw error here to avoid breaking the booking status update
  }
}

class AdminBookingController {
  // Get all bookings with pagination and filters
  static async getAllBookings(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        search: req.query.search || '',
        status: req.query.status || '',
        date: req.query.date || '',
        payment_status: req.query.payment_status || ''
      };

      const [bookings, totalCount] = await Promise.all([
        AdminBookingModel.getAllBookings(page, limit, filters),
        AdminBookingModel.getBookingsCount(filters)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        message: 'Bookings retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve bookings',
        error: error.message
      });
    }
  }

  // Get booking by ID with full details
  static async getBookingById(req, res) {
    try {
      const { bookingId } = req.params;

      if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid booking ID is required'
        });
      }

      const booking = await AdminBookingModel.getBookingById(parseInt(bookingId));

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking,
        message: 'Booking details retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getBookingById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve booking details',
        error: error.message
      });
    }
  }

  // Update booking status
  static async updateBookingStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid booking ID is required'
        });
      }

      const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required (Pending, Confirmed, Completed, Cancelled)'
        });
      }

      const updated = await AdminBookingModel.updateBookingStatus(parseInt(bookingId), status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Update boat status based on booking status
      await updateBoatStatusBasedOnBooking(parseInt(bookingId), status);

      // Send real-time notification
      const sendNotification = req.app.get('sendNotification');
      if (sendNotification) {
        // Get booking details for notification
        const booking = await AdminBookingModel.getBookingById(parseInt(bookingId));
        
        if (booking) {
          // Create notification for customer
          const customerNotificationData = {
            owner_id: booking.owner_id,
            user_id: booking.customer_id,
            boat_id: booking.boat_id,
            booking_id: parseInt(bookingId),
            type: 'booking_update',
            title: getNotificationTitle(status),
            message: getNotificationMessage(status, booking)
          };

          // Create notification for boat owner
          const ownerNotificationData = {
            owner_id: booking.owner_id,
            user_id: null,
            boat_id: booking.boat_id,
            booking_id: parseInt(bookingId),
            type: 'booking_update',
            title: `Booking ${status}`,
            message: `Your booking #${bookingId} for ${booking.boat_name} has been ${status.toLowerCase()} by admin`,
          };

          // Send notifications
          await sendNotification(customerNotificationData);
          await sendNotification(ownerNotificationData);
        }
      }

      // Get updated booking details
      const booking = await AdminBookingModel.getBookingById(parseInt(bookingId));

      res.json({
        success: true,
        data: booking,
        message: 'Booking status updated successfully'
      });
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status',
        error: error.message
      });
    }
  }

  // Update payment status
  static async updatePaymentStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { payment_status } = req.body;

      if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid booking ID is required'
        });
      }

      const validPaymentStatuses = ['Paid', 'Unpaid'];
      if (!payment_status || !validPaymentStatuses.includes(payment_status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid payment status is required (Paid, Unpaid)'
        });
      }

      const updated = await AdminBookingModel.updatePaymentStatus(parseInt(bookingId), payment_status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Get updated booking details
      const booking = await AdminBookingModel.getBookingById(parseInt(bookingId));

      res.json({
        success: true,
        data: booking,
        message: 'Payment status updated successfully'
      });
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  }

  // Get booking statistics
  static async getBookingStats(req, res) {
    try {
      const stats = await AdminBookingModel.getBookingStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Booking statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getBookingStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve booking statistics',
        error: error.message
      });
    }
  }

  // Get recent bookings
  static async getRecentBookings(req, res) {
    try {
      const recentBookings = await AdminBookingModel.getRecentBookings();
      
      res.json({
        success: true,
        data: recentBookings,
        message: 'Recent bookings retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getRecentBookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recent bookings',
        error: error.message
      });
    }
  }

  // Get bookings by date range
  static async getBookingsByDateRange(req, res) {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const bookings = await AdminBookingModel.getBookingsByDateRange(start_date, end_date);
      
      res.json({
        success: true,
        data: bookings,
        message: 'Bookings by date range retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getBookingsByDateRange:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve bookings by date range',
        error: error.message
      });
    }
  }

  // Get payment proof image
  static async getPaymentProof(req, res) {
    try {
      const { bookingId } = req.params;

      if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid booking ID is required'
        });
      }

      const booking = await AdminBookingModel.getBookingById(parseInt(bookingId));

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (!booking.payment_proof) {
        return res.status(404).json({
          success: false,
          message: 'No payment proof available for this booking'
        });
      }

      res.json({
        success: true,
        data: {
          payment_proof: booking.payment_proof,
          payment_method: booking.payment_method,
          payment_status: booking.payment_status,
          total_price: booking.total_price
        },
        message: 'Payment proof retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getPaymentProof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment proof',
        error: error.message
      });
    }
  }
}

// Helper functions for notification messages
function getNotificationTitle(status) {
  switch (status) {
    case 'Confirmed':
      return 'Booking Confirmed! 🎉';
    case 'Completed':
      return 'Trip Completed! ✅';
    case 'Cancelled':
      return 'Booking Cancelled ❌';
    default:
      return 'Booking Status Updated';
  }
}

function getNotificationMessage(status, bookingDetails) {
  const boatName = bookingDetails.boat_name;
  const date = new Date(bookingDetails.booking_date).toLocaleDateString();
  const time = bookingDetails.booking_time;
  
  switch (status) {
    case 'Confirmed':
      return `Great news! Your booking for ${boatName} on ${date} at ${time} has been confirmed. Get ready for an amazing adventure!`;
    case 'Completed':
      return `Your trip on ${boatName} on ${date} has been completed. We hope you had a wonderful time! Please consider leaving a review.`;
    case 'Cancelled':
      return `Unfortunately, your booking for ${boatName} on ${date} at ${time} has been cancelled. Please contact us for more information.`;
    default:
      return `Your booking for ${boatName} status has been updated to ${status}.`;
  }
}

module.exports = AdminBookingController;
