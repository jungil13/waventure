const NotificationModel = require('../models/notificationModel');

class AdminNotificationController {
  // Get all notifications for admin (system-wide notifications)
  static async getAdminNotifications(req, res) {
    try {
      const { limit = 20, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      // Get all notifications for admin users
      const notifications = await NotificationModel.getAdminNotifications(parseInt(limit), parseInt(offset));
      const unreadCount = await NotificationModel.getAdminUnreadCount();

      res.status(200).json({
        success: true,
        data: {
          notifications,
          unreadCount,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(notifications.length / parseInt(limit)),
            hasNext: notifications.length === parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error in getAdminNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admin notifications',
        error: error.message
      });
    }
  }

  // Get unread notification count for admin
  static async getAdminUnreadCount(req, res) {
    try {
      const count = await NotificationModel.getAdminUnreadCount();
      
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Error in getAdminUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count',
        error: error.message
      });
    }
  }

  // Mark notification as read for admin
  static async markAdminNotificationAsRead(req, res) {
    try {
      const { id } = req.params;
      
      const updated = await NotificationModel.markNotificationAsRead(parseInt(id));
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error in markAdminNotificationAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message
      });
    }
  }

  // Mark all notifications as read for admin
  static async markAllAdminNotificationsAsRead(req, res) {
    try {
      await NotificationModel.markAllAdminNotificationsAsRead();
      
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error in markAllAdminNotificationsAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.message
      });
    }
  }

  // Create system notification
  static async createSystemNotification(req, res) {
    try {
      const { title, message, type = 'system' } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Title and message are required'
        });
      }

      const notificationData = {
        owner_id: req.user.user_id, // Admin user ID
        user_id: null, // System notification
        boat_id: null,
        booking_id: null,
        type,
        title,
        message
      };

      const notificationId = await NotificationModel.createNotification(notificationData);
      
      // Emit to all admin users via Socket.IO
      const io = req.app.get('io');
      if (io) {
        io.emit('admin-notification', {
          id: notificationId,
          title,
          message,
          type,
          created_at: new Date().toISOString()
        });
      }

      res.status(201).json({
        success: true,
        message: 'System notification created successfully',
        data: { notificationId }
      });
    } catch (error) {
      console.error('Error in createSystemNotification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create system notification',
        error: error.message
      });
    }
  }

  // Get notifications by type (for easier filtering)
  static async getNotificationsByType(req, res) {
    try {
      const { type } = req.params;
      const { limit = 20 } = req.query;

      const notifications = await NotificationModel.getNotificationsByType(type, parseInt(limit));

      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Error in getNotificationsByType:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications by type',
        error: error.message
      });
    }
  }

  // Get booking status update notifications specifically
  static async getBookingStatusNotifications(req, res) {
    try {
      const { limit = 20 } = req.query;

      const notifications = await NotificationModel.getBookingStatusNotifications(parseInt(limit));

      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Error in getBookingStatusNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking status notifications',
        error: error.message
      });
    }
  }
}

module.exports = AdminNotificationController;
