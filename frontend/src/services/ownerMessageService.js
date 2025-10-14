import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/owner-messages';

class OwnerMessageService {
  // Get customers that have bookings with the boat owner
  static async getCustomers(ownerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get messages between boat owner and customer
  static async getMessages(ownerId, customerId, bookingId = null) {
    try {
      const params = bookingId ? { bookingId } : {};
      const response = await axios.get(`${API_BASE_URL}/${ownerId}/${customerId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a new message from boat owner to customer
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

  // Get unread message count for boat owner
  static async getUnreadCount(ownerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/unread/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Get recent conversations for boat owner
  static async getRecentConversations(ownerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      throw error;
    }
  }
}

export default OwnerMessageService;
