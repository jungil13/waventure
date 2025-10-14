const NotificationModel = require('../models/notificationModel');

const notificationController = {
  // Get notifications for a user
  getUserNotifications: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const notifications = await NotificationModel.getUserNotifications(userId);
      
      res.json({
        success: true,
        data: notifications,
        message: 'Notifications retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting user notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications'
      });
    }
  },

  // Get notifications for an owner
  getOwnerNotifications: async (req, res) => {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const notifications = await NotificationModel.getOwnerNotifications(ownerId);
      
      res.json({
        success: true,
        data: notifications,
        message: 'Notifications retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting owner notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications'
      });
    }
  },

  // Get unread count for a user
  getUnreadCount: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const count = await NotificationModel.getUnreadCount(userId);
      
      res.json({
        success: true,
        count: count,
        message: 'Unread count retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve unread count'
      });
    }
  },

  // Get unread count for an owner
  getOwnerUnreadCount: async (req, res) => {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const count = await NotificationModel.getOwnerUnreadCount(ownerId);
      
      res.json({
        success: true,
        count: count,
        message: 'Unread count retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting owner unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve unread count'
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req.body;
      
      if (!notificationId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Notification ID and User ID are required'
        });
      }

      await NotificationModel.markAsRead(notificationId, userId);
      
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      await NotificationModel.markAllAsRead(userId);
      
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  },

  // Mark all notifications as read for an owner
  markAllAsReadOwner: async (req, res) => {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      await NotificationModel.markAllAsReadOwner(ownerId);
      
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all owner notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  },

  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req.body;
      
      if (!notificationId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Notification ID and User ID are required'
        });
      }

      await NotificationModel.deleteNotification(notificationId, userId);
      
      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  },

  // Create a new notification
  createNotification: async (req, res) => {
    try {
      const { owner_id, user_id, boat_id, booking_id, type, title, message } = req.body;
      
      if (!type || !title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Type, title, and message are required'
        });
      }

      const notificationData = {
        owner_id,
        user_id,
        boat_id,
        booking_id,
        type,
        title,
        message
      };

      const result = await NotificationModel.createNotification(notificationData);
      
      res.json({
        success: true,
        data: {
          notification_id: result.insertId,
          ...notificationData
        },
        message: 'Notification created successfully'
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create notification'
      });
    }
  }
};

module.exports = notificationController;