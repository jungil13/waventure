import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const notificationService = {
  // Get all notifications for owner
  getOwnerNotifications: async (ownerId, limit = 20) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/owner/${ownerId}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get all notifications for customer
  getUserNotifications: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/user/${userId}`);
    return response.data;
  },

  // Get unread notification count for owner
  getOwnerUnreadCount: async (ownerId) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/owner-unread/${ownerId}`);
    return response.data;
  },

  // Get unread notification count for customer
  getUserUnreadCount: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/unread/${userId}`);
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async (ownerId) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/owner/${ownerId}/stats`);
    return response.data;
  },

  // Mark notification as read for owner
  markOwnerNotificationAsRead: async (notificationId, ownerId) => {
    const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/owner/${ownerId}/read`);
    return response.data;
  },

  // Mark notification as read for customer
  markUserNotificationAsRead: async (notificationId, userId) => {
    const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, { userId });
    return response.data;
  },

  // Mark all notifications as read for owner
  markAllOwnerNotificationsAsRead: async (ownerId) => {
    const response = await axios.put(`${API_BASE_URL}/notifications/owner-read-all/${ownerId}`);
    return response.data;
  },

  // Mark all notifications as read for customer
  markAllUserNotificationsAsRead: async (userId) => {
    const response = await axios.put(`${API_BASE_URL}/notifications/read-all/${userId}`);
    return response.data;
  }
};
