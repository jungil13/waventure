const bookingStatusModel = require('../models/bookingStatusModel');

const bookingStatusController = {
  // Update booking status (for boat owners)
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status, ownerId } = req.body;
      
      // Validate status
      const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: Pending, Confirmed, Completed, Cancelled'
        });
      }

      // Get booking details
      const booking = await bookingStatusModel.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Update booking status
      await bookingStatusModel.updateBookingStatus(bookingId, status);

      // Update boat status based on booking status
      await updateBoatStatusBasedOnBooking(booking.boat_id, status);

      // Get boat and user details for notification
      const bookingDetails = await bookingStatusModel.getBookingDetails(bookingId);
      
      // Send real-time notification using the helper function
      const sendNotification = req.app.get('sendNotification');
      if (sendNotification) {
        // Create notification for customer
        const customerNotificationData = {
          owner_id: bookingDetails.boat_owner_id,
          user_id: bookingDetails.user_id,
          boat_id: bookingDetails.boat_id,
          booking_id: parseInt(bookingId),
          type: 'booking_update',
          title: getNotificationTitle(status),
          message: getNotificationMessage(status, bookingDetails)
        };

        // Create notification for boat owner
        const ownerNotificationData = {
          owner_id: bookingDetails.boat_owner_id,
          user_id: null,
          boat_id: bookingDetails.boat_id,
          booking_id: parseInt(bookingId),
          type: 'booking_update',
          title: `Booking ${status}`,
          message: `You have ${status.toLowerCase()} booking #${bookingId} for ${bookingDetails.boat_name}`,
        };

        // Send notifications
        await sendNotification(customerNotificationData);
        await sendNotification(ownerNotificationData);
      }

      // Send admin notification for booking status change
      const sendAdminNotification = req.app.get('sendAdminNotification');
      if (sendAdminNotification) {
        try {
          await sendAdminNotification({
            type: 'booking_status',
            booking_id: parseInt(bookingId),
            user_id: bookingDetails.user_id,
            boat_id: bookingDetails.boat_id,
            user_name: bookingDetails.user_name, // This should already be correct from getBookingDetails
            boat_name: bookingDetails.boat_name,
            status: status,
            updated_by: 'Boat Owner'
          });
        } catch (notificationError) {
          console.error('Error sending admin notification:', notificationError);
        }
      }

      res.json({
        success: true,
        message: `Booking status updated to ${status}`,
        data: {
          bookingId: parseInt(bookingId),
          status: status,
          bookingDetails: bookingDetails
        }
      });

    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status'
      });
    }
  },

  // Get booking details for owner
  getBookingDetails: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await bookingStatusModel.getBookingDetails(bookingId);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking details'
      });
    }
  }
};

// Helper function to update boat status based on booking status
async function updateBoatStatusBasedOnBooking(boatId, bookingStatus) {
  try {
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
    await bookingStatusModel.updateBoatStatus(boatId, boatStatus);
    
    console.log(`Boat ${boatId} status updated to ${boatStatus} due to booking status: ${bookingStatus}`);
  } catch (error) {
    console.error('Error updating boat status:', error);
    // Don't throw error here to avoid breaking the booking status update
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

module.exports = bookingStatusController;
