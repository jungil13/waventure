import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/messages';

class MessageService {
  // Get boat owners that the user has bookings with
  static async getBoatOwners(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/boat-owners/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching boat owners:', error);
      throw error;
    }
  }

  // Get messages between two users
  static async getMessages(userId, ownerId, bookingId = null) {
    try {
      const params = bookingId ? { bookingId } : {};
      const response = await axios.get(`${API_BASE_URL}/${userId}/${ownerId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a new message
  static async sendMessage(senderId, receiverId, message, bookingId = null) {
    try {
      const response = await axios.post(`${API_BASE_URL}/send`, {
        senderId,
        receiverId,
        message,
        bookingId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get unread message count
  static async getUnreadCount(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/unread/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Get recent conversations
  static async getRecentConversations(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      throw error;
    }
  }
}

export default MessageService;
