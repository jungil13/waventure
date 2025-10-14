const db = require('../config/db');

class MessageModel {
  // Get all boat owners that the user has bookings with
  static async getBoatOwnersForUser(userId) {
    try {
      const query = `
        SELECT DISTINCT 
          u.user_id,
          u.full_name,
          u.profile_pic,
          u.email,
          u.phone,
          u.location,
          u.bio,
          b.boat_id,
          b.name as boat_name,
          bk.booking_id,
          COUNT(m.message_id) as unread_count
        FROM bookings bk
        JOIN boats b ON bk.boat_id = b.boat_id
        JOIN users u ON b.owner_id = u.user_id
        LEFT JOIN messages m ON (m.sender_id = u.user_id AND m.receiver_id = ? AND m.is_read = 0 AND m.booking_id = bk.booking_id)
        WHERE bk.user_id = ?
        GROUP BY u.user_id, u.full_name, u.profile_pic, u.email, u.phone, u.location, u.bio, b.boat_id, b.name, bk.booking_id
        ORDER BY u.full_name
      `;
      const [rows] = await db.execute(query, [userId, userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get messages between two users
  static async getMessages(senderId, receiverId, bookingId = null) {
    try {
      let query = `
        SELECT 
          m.message_id,
          m.sender_id,
          m.receiver_id,
          m.booking_id,
          m.message,
          m.is_read,
          m.created_at,
          u.full_name as sender_name,
          u.profile_pic as sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.user_id
        WHERE (m.sender_id = ? AND m.receiver_id = ?)
           OR (m.sender_id = ? AND m.receiver_id = ?)
      `;
      const params = [senderId, receiverId, receiverId, senderId];
      
      if (bookingId) {
        query += ` AND m.booking_id = ?`;
        params.push(bookingId);
      }
      
      query += ` ORDER BY m.created_at ASC`;
      
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Send a new message
  static async sendMessage(senderId, receiverId, message, bookingId = null) {
    try {
      // Validate required parameters
      if (!senderId || !receiverId || !message) {
        throw new Error('Sender ID, Receiver ID, and message are required');
      }

      // Log the booking ID for debugging
      console.log('Saving message with bookingId:', bookingId, 'for sender:', senderId, 'receiver:', receiverId);

      const query = `
        INSERT INTO messages (sender_id, receiver_id, booking_id, message, is_read)
        VALUES (?, ?, ?, ?, 0)
      `;
      const [result] = await db.execute(query, [senderId, receiverId, bookingId, message]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(senderId, receiverId, bookingId = null) {
    try {
      let query = `
        UPDATE messages 
        SET is_read = 1 
        WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
      `;
      const params = [senderId, receiverId];
      
      if (bookingId) {
        query += ` AND booking_id = ?`;
        params.push(bookingId);
      }
      
      const [result] = await db.execute(query, params);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get unread message count for a user
  static async getUnreadCount(userId, bookingId = null) {
    try {
      let query = `
        SELECT COUNT(*) as unread_count
        FROM messages 
        WHERE receiver_id = ? AND is_read = 0
      `;
      const params = [userId];
      
      if (bookingId) {
        query += ` AND booking_id = ?`;
        params.push(bookingId);
      }
      
      const [rows] = await db.execute(query, params);
      return rows[0].unread_count;
    } catch (error) {
      throw error;
    }
  }

  // Get recent conversations for a user
  static async getRecentConversations(userId) {
    try {
      const query = `
        SELECT 
          u.user_id,
          u.full_name,
          u.profile_pic,
          b.name as boat_name,
          m.message as last_message,
          m.created_at as last_message_time,
          COUNT(CASE WHEN m2.is_read = 0 AND m2.receiver_id = ? THEN 1 END) as unread_count
        FROM (
          SELECT 
            CASE 
              WHEN sender_id = ? THEN receiver_id 
              ELSE sender_id 
            END as other_user_id,
            MAX(created_at) as last_time
          FROM messages 
          WHERE sender_id = ? OR receiver_id = ?
          GROUP BY other_user_id
        ) recent
        JOIN users u ON recent.other_user_id = u.user_id
        LEFT JOIN boats b ON b.owner_id = u.user_id
        LEFT JOIN messages m ON m.created_at = recent.last_time
        LEFT JOIN messages m2 ON m2.sender_id = u.user_id AND m2.receiver_id = ?
        GROUP BY u.user_id, u.full_name, u.profile_pic, b.name, m.message, m.created_at
        ORDER BY recent.last_time DESC
      `;
      const [rows] = await db.execute(query, [userId, userId, userId, userId, userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MessageModel;
