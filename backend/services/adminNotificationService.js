const AdminSimpleNotificationController = require('../controllers/adminSimpleNotificationController');

class AdminNotificationService {
  // Send new booking notification to admin
  static async sendNewBookingNotification(bookingData) {
    try {
      const { booking_id, user_name, boat_name, total_price } = bookingData;
      
      const notificationData = {
        type: 'new_booking',
        title: 'New Booking Request',
        message: `${user_name} has made a new booking for ${boat_name} (₱${total_price.toLocaleString()})`,
        booking_id: booking_id,
        user_id: bookingData.user_id,
        boat_id: bookingData.boat_id
      };
      
      await AdminSimpleNotificationController.createNotification(notificationData);
      console.log('✅ New booking notification sent to admin');
    } catch (error) {
      console.error('❌ Error sending new booking notification:', error);
    }
  }

  // Send booking status change notification to admin
  static async sendBookingStatusNotification(bookingData) {
    try {
      const { booking_id, user_name, boat_name, status, updated_by } = bookingData;
      
      const notificationData = {
        type: 'booking_status',
        title: 'Booking Status Updated',
        message: `Booking #${booking_id} for ${boat_name} (${user_name}) has been ${status.toLowerCase()} by ${updated_by}`,
        booking_id: booking_id,
        user_id: bookingData.user_id,
        boat_id: bookingData.boat_id
      };
      
      await AdminSimpleNotificationController.createNotification(notificationData);
      console.log('✅ Booking status notification sent to admin');
    } catch (error) {
      console.error('❌ Error sending booking status notification:', error);
    }
  }

  // Send boat maintenance notification to admin
  static async sendBoatMaintenanceNotification(boatData) {
    try {
      const { boat_id, boat_name, status, owner_name } = boatData;
      
      const notificationData = {
        type: 'boat_maintenance',
        title: 'Boat Maintenance Update',
        message: `${boat_name} (Owner: ${owner_name}) status changed to ${status}`,
        boat_id: boat_id,
        user_id: boatData.owner_id
      };
      
      await AdminSimpleNotificationController.createNotification(notificationData);
      console.log('✅ Boat maintenance notification sent to admin');
    } catch (error) {
      console.error('❌ Error sending boat maintenance notification:', error);
    }
  }
}

module.exports = AdminNotificationService;
