const OwnerMessageModel = require('../models/ownerMessageModel');

class OwnerMessageController {
  // Get customers that have bookings with the boat owner
  static async getCustomers(req, res) {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const customers = await OwnerMessageModel.getCustomersForOwner(ownerId);
      
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error getting customers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customers',
        error: error.message
      });
    }
  }

  // Get messages between boat owner and customer
  static async getMessages(req, res) {
    try {
      const { ownerId, customerId } = req.params;
      const { bookingId } = req.query;
      
      if (!ownerId || !customerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID and Customer ID are required'
        });
      }

      const messages = await OwnerMessageModel.getMessages(ownerId, customerId, bookingId);
      
      // Mark messages as read
      await OwnerMessageModel.markMessagesAsRead(customerId, ownerId);
      
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

  // Send a new message from boat owner to customer
  static async sendMessage(req, res) {
    try {
      const { senderId, receiverId, message, bookingId } = req.body;
      
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({
          success: false,
          message: 'Sender ID, Receiver ID, and message are required'
        });
      }

      const messageId = await OwnerMessageModel.sendMessage(senderId, receiverId, message, bookingId);
      
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

  // Get unread message count for boat owner
  static async getUnreadCount(req, res) {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const unreadCount = await OwnerMessageModel.getUnreadCount(ownerId);
      
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

  // Get recent conversations for boat owner
  static async getRecentConversations(req, res) {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const conversations = await OwnerMessageModel.getRecentConversations(ownerId);
      
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

module.exports = OwnerMessageController;
