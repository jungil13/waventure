const db = require('../config/db');

const NotificationModel = {
  // Create a new notification
  createNotification: async (notificationData) => {
    try {
      const { owner_id, user_id, boat_id, booking_id, type, title, message } = notificationData;
      
      // Validate boat_id exists if provided
      let validBoatId = null;
      if (boat_id) {
        try {
          const [rows] = await db.query('SELECT boat_id FROM boats WHERE boat_id = ?', [boat_id]);
          validBoatId = rows.length > 0 ? boat_id : null;
        } catch (error) {
          console.error('Error validating boat_id:', error);
          validBoatId = null;
        }
      }
      
      const query = `
        INSERT INTO notifications (owner_id, user_id, boat_id, booking_id, type, title, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.query(query, [owner_id, user_id, validBoatId, booking_id, type, title, message]);
      return result;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get notifications for a specific user
  getUserNotifications: async (userId) => {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `;
      const [result] = await db.query(query, [userId]);
      return result;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  },

  // Get notifications for a specific owner
  getOwnerNotifications: async (ownerId) => {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE owner_id = ? 
        ORDER BY created_at DESC
      `;
      const [result] = await db.query(query, [ownerId]);
      return result;
    } catch (error) {
      console.error('Error getting owner notifications:', error);
      throw error;
    }
  },

  // Get unread notification count for a user
  getUnreadCount: async (userId) => {
    try {
      const query = `
        SELECT COUNT(*) as count FROM notifications 
        WHERE user_id = ? AND is_read = 0
      `;
      const [result] = await db.query(query, [userId]);
      return result[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },

  // Get unread notification count for an owner
  getOwnerUnreadCount: async (ownerId) => {
    try {
      const query = `
        SELECT COUNT(*) as count FROM notifications 
        WHERE owner_id = ? AND is_read = 0
      `;
      const [result] = await db.query(query, [ownerId]);
      return result[0].count;
    } catch (error) {
      console.error('Error getting owner unread count:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId, userId) => {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = 1 
        WHERE notification_id = ? AND user_id = ?
      `;
      const [result] = await db.query(query, [notificationId, userId]);
      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId) => {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = 1 
        WHERE user_id = ? AND is_read = 0
      `;
      const [result] = await db.query(query, [userId]);
      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for an owner
  markAllAsReadOwner: async (ownerId) => {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = 1 
        WHERE owner_id = ? AND is_read = 0
      `;
      const [result] = await db.query(query, [ownerId]);
      return result;
    } catch (error) {
      console.error('Error marking all owner notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId, userId) => {
    try {
      const query = `
        DELETE FROM notifications 
        WHERE notification_id = ? AND user_id = ?
      `;
      const [result] = await db.query(query, [notificationId, userId]);
      return result;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE notification_id = ?
      `;
      const [result] = await db.query(query, [notificationId]);
      return result[0];
    } catch (error) {
      console.error('Error getting notification by ID:', error);
      throw error;
    }
  },

  // Create notification for booking status change
  createBookingStatusNotification: async (bookingId, newStatus, boatOwnerId, userId) => {
    try {
      // Get booking details
      const bookingQuery = `
        SELECT b.*, boat.name as boat_name, u.full_name as user_name
        FROM bookings b
        LEFT JOIN boats boat ON b.boat_id = boat.boat_id
        LEFT JOIN users u ON b.user_id = u.user_id
        WHERE b.booking_id = ?
      `;
      
      const [bookingResult] = await db.execute(bookingQuery, [bookingId]);
      if (!bookingResult[0]) return null;

      const booking = bookingResult[0];
      
      let title, message;
      const date = new Date(booking.booking_date).toLocaleDateString();
      const time = booking.booking_time;

      switch (newStatus) {
        case 'Confirmed':
          title = 'Booking Confirmed! 🎉';
          message = `Great news! Your booking for ${booking.boat_name} on ${date} at ${time} has been confirmed. Get ready for an amazing adventure!`;
          break;
        case 'Completed':
          title = 'Trip Completed! ✅';
          message = `Your trip on ${booking.boat_name} on ${date} has been completed. We hope you had a wonderful time! Please consider leaving a review.`;
          break;
        case 'Cancelled':
          title = 'Booking Cancelled ❌';
          message = `Unfortunately, your booking for ${booking.boat_name} on ${date} at ${time} has been cancelled. Please contact us for more information.`;
          break;
        default:
          title = 'Booking Status Updated';
          message = `Your booking for ${booking.boat_name} status has been updated to ${newStatus}.`;
      }

      const notificationData = {
        owner_id: boatOwnerId,
        user_id: userId,
        boat_id: booking.boat_id,
        booking_id: bookingId,
        type: 'booking_update',
        title: title,
        message: message
      };

      return await NotificationModel.createNotification(notificationData);
    } catch (error) {
      console.error('Error creating booking status notification:', error);
      throw error;
    }
  },

  // Create notification for new boat added
  createNewBoatNotification: async (boatId, ownerId) => {
    try {
      // Get boat details
      const boatQuery = `
        SELECT b.*, u.full_name as owner_name
        FROM boats b
        LEFT JOIN users u ON b.owner_id = u.user_id
        WHERE b.boat_id = ?
      `;
      
      const [boatResult] = await db.execute(boatQuery, [boatId]);
      if (!boatResult[0]) return null;

      const boat = boatResult[0];
      
      const title = 'New Boat Available! 🚤';
      const message = `A new boat "${boat.name}" has been added by ${boat.owner_name}. Check it out and book your next adventure!`;

      const notificationData = {
        owner_id: ownerId,
        user_id: null, // This will be sent to all users
        boat_id: boatId,
        booking_id: null,
        type: 'new_boat',
        title: title,
        message: message
      };

      return await NotificationModel.createNotification(notificationData);
    } catch (error) {
      console.error('Error creating new boat notification:', error);
      throw error;
    }
  },

  // Get all notifications for admin (system-wide notifications)
  getAdminNotifications: async (limit = 20, offset = 0) => {
    try {
      const query = `
        SELECT n.*, 
               u.full_name as user_name,
               b.name as boat_name,
               bo.full_name as owner_name
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.user_id
        LEFT JOIN boats b ON n.boat_id = b.boat_id
        LEFT JOIN users bo ON n.owner_id = bo.user_id
        ORDER BY n.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const [result] = await db.execute(query, [limit, offset]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get unread notification count for admin
  getAdminUnreadCount: async () => {
    try {
      const query = `
        SELECT COUNT(*) as count FROM notifications 
        WHERE is_read = 0
      `;
      const [result] = await db.execute(query);
      return result[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read for admin
  markAllAdminNotificationsAsRead: async () => {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = 1 
        WHERE is_read = 0
      `;
      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get notifications by type (for easier filtering)
  getNotificationsByType: async (type, limit = 20) => {
    try {
      const query = `
        SELECT n.*, 
               u.full_name as user_name,
               b.name as boat_name,
               bo.full_name as owner_name
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.user_id
        LEFT JOIN boats b ON n.boat_id = b.boat_id
        LEFT JOIN users bo ON n.owner_id = bo.user_id
        WHERE n.type = ?
        ORDER BY n.created_at DESC
        LIMIT ?
      `;
      const [result] = await db.execute(query, [type, limit]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get booking status update notifications
  getBookingStatusNotifications: async (limit = 20) => {
    try {
      const query = `
        SELECT n.*, 
               u.full_name as user_name,
               b.name as boat_name,
               bo.full_name as owner_name,
               bk.booking_id,
               bk.status as booking_status
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.user_id
        LEFT JOIN boats b ON n.boat_id = b.boat_id
        LEFT JOIN users bo ON n.owner_id = bo.user_id
        LEFT JOIN bookings bk ON n.booking_id = bk.booking_id
        WHERE n.type = 'booking_update'
        ORDER BY n.created_at DESC
        LIMIT ?
      `;
      const [result] = await db.execute(query, [limit]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = NotificationModel;