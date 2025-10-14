const db = require('../config/db');

class AdminSimpleNotificationModel {
  // Create a simple admin notification
  static async createAdminNotification(notificationData) {
    try {
      const { type, title, message, booking_id = null, boat_id = null, user_id = null } = notificationData;
      
      const query = `
        INSERT INTO admin_notifications (type, title, message, booking_id, boat_id, user_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const [result] = await db.execute(query, [type, title, message, booking_id, boat_id, user_id]);
      return result.insertId;
    } catch (error) {
      console.error('Error creating admin notification:', error);
      throw error;
    }
  }

  // Get all admin notifications
  static async getAdminNotifications(limit = 20, offset = 0) {
    try {
      const query = `
        SELECT 
          an.*,
          u.full_name as user_name,
          b.name as boat_name,
          bk.booking_id,
          bk.status as booking_status
        FROM admin_notifications an
        LEFT JOIN users u ON an.user_id = u.user_id
        LEFT JOIN boats b ON an.boat_id = b.boat_id
        LEFT JOIN bookings bk ON an.booking_id = bk.booking_id
        ORDER BY an.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const [result] = await db.execute(query, [limit, offset]);
      return result;
    } catch (error) {
      console.error('Error getting admin notifications:', error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount() {
    try {
      const query = 'SELECT COUNT(*) as count FROM admin_notifications WHERE is_read = 0';
      const [result] = await db.execute(query);
      return result[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const query = 'UPDATE admin_notifications SET is_read = 1 WHERE id = ?';
      const [result] = await db.execute(query, [notificationId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const query = 'UPDATE admin_notifications SET is_read = 1 WHERE is_read = 0';
      const [result] = await db.execute(query);
      return result.affectedRows;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete old notifications (keep only last 100)
  static async cleanupOldNotifications() {
    try {
      const query = `
        DELETE FROM admin_notifications 
        WHERE id NOT IN (
          SELECT id FROM (
            SELECT id FROM admin_notifications 
            ORDER BY created_at DESC 
            LIMIT 100
          ) as temp
        )
      `;
      const [result] = await db.execute(query);
      return result.affectedRows;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }
}

module.exports = AdminSimpleNotificationModel;
