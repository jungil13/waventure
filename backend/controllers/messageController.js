const MessageModel = require('../models/messageModel');

class MessageController {
  // Get boat owners that the user has bookings with
  static async getBoatOwners(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const boatOwners = await MessageModel.getBoatOwnersForUser(userId);
      
      res.json({
        success: true,
        data: boatOwners
      });
    } catch (error) {
      console.error('Error getting boat owners:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get boat owners',
        error: error.message
      });
    }
  }

  // Get messages between two users
  static async getMessages(req, res) {
    try {
      const { userId, ownerId } = req.params;
      const { bookingId } = req.query;
      
      if (!userId || !ownerId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and Owner ID are required'
        });
      }

      const messages = await MessageModel.getMessages(userId, ownerId, bookingId);
      
      // Mark messages as read
      await MessageModel.markMessagesAsRead(ownerId, userId);
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get messages',
        error: error.message
      });
    }
  }

  // Send a new message
  static async sendMessage(req, res) {
    try {
      const { senderId, receiverId, message, bookingId } = req.body;
      
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({
          success: false,
          message: 'Sender ID, Receiver ID, and message are required'
        });
      }

      const messageId = await MessageModel.sendMessage(senderId, receiverId, message, bookingId);
      
      res.json({
        success: true,
        data: {
          messageId,
          message: 'Message sent successfully'
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error.message
      });
    }
  }

  // Get unread message count
  static async getUnreadCount(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const unreadCount = await MessageModel.getUnreadCount(userId);
      
      res.json({
        success: true,
        data: {
          unreadCount
        }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count',
        error: error.message
      });
    }
  }

  // Get recent conversations
  static async getRecentConversations(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const conversations = await MessageModel.getRecentConversations(userId);
      
      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recent conversations',
        error: error.message
      });
    }
  }
}

module.exports = MessageController;
