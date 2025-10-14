const AdminSimpleNotificationModel = require('../models/adminSimpleNotificationModel');

class AdminSimpleNotificationController {
  // Get all admin notifications
  static async getNotifications(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      
      const notifications = await AdminSimpleNotificationModel.getAdminNotifications(
        parseInt(limit), 
        parseInt(offset)
      );
      
      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Error in getNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message
      });
    }
  }

  // Get unread count
  static async getUnreadCount(req, res) {
    try {
      const count = await AdminSimpleNotificationModel.getUnreadCount();
      
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count',
        error: error.message
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      
      const updated = await AdminSimpleNotificationModel.markAsRead(parseInt(id));
      
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
      console.error('Error in markAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const updatedCount = await AdminSimpleNotificationModel.markAllAsRead();
      
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        data: { updatedCount }
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.message
      });
    }
  }

  // Create admin notification (internal use)
  static async createNotification(notificationData) {
    try {
      const notificationId = await AdminSimpleNotificationModel.createAdminNotification(notificationData);
      return notificationId;
    } catch (error) {
      console.error('Error creating admin notification:', error);
      throw error;
    }
  }
}

module.exports = AdminSimpleNotificationController;
