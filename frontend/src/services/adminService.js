import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AdminService {
  // Get authentication token from localStorage
  static getAuthToken() {
    return localStorage.getItem('token');
  }

  // Make authenticated API request
  static async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await axios(`${API_BASE_URL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get admin user profile
  static async getAdminProfile() {
    return this.makeRequest('/admin-dashboard/profile');
  }

  // Get admin notifications
  static async getAdminNotifications(limit = 20) {
    return this.makeRequest(`/notifications/admin?limit=${limit}`);
  }

  // Get unread notification count for admin
  static async getUnreadNotificationCount() {
    return this.makeRequest('/notifications/admin/unread-count');
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId) {
    return this.makeRequest(`/notifications/admin/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  // Mark all notifications as read
  static async markAllNotificationsAsRead() {
    return this.makeRequest('/notifications/admin/mark-all-read', {
      method: 'PUT'
    });
  }

  // Get notifications by type (for easier filtering)
  static async getNotificationsByType(type, limit = 20) {
    return this.makeRequest(`/notifications/admin/type/${type}?limit=${limit}`);
  }

  // Get booking status update notifications specifically
  static async getBookingStatusNotifications(limit = 20) {
    return this.makeRequest(`/notifications/admin/booking-status?limit=${limit}`);
  }

  // Get admin dashboard statistics
  static async getDashboardStats() {
    return this.makeRequest('/admin-dashboard/stats');
  }

  // Update admin profile
  static async updateProfile(profileData) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      data: profileData
    });
  }

  // Upload profile picture
  static async uploadProfilePicture(file) {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('profile_pic', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/users/profile-picture`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Helper method to format image URL
  static formatImageUrl(imagePath) {
    if (!imagePath) return 'https://i.pravatar.cc/40';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }

  // Helper method to format date
  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  // Helper method to format time ago
  static formatTimeAgo(dateString) {
    if (!dateString) return 'N/A';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return this.formatDate(dateString);
  }

  // Helper method to get notification type icon
  static getNotificationIcon(type) {
    const icons = {
      'booking_request': '📋',
      'booking_update': '🔄',
      'booking_completed': '✅',
      'payment': '💰',
      'review': '⭐',
      'system': '🔧'
    };
    return icons[type] || '📢';
  }

  // Helper method to get notification type color
  static getNotificationColor(type) {
    const colors = {
      'booking_request': 'bg-blue-100 text-blue-800',
      'booking_update': 'bg-yellow-100 text-yellow-800',
      'booking_completed': 'bg-green-100 text-green-800',
      'payment': 'bg-emerald-100 text-emerald-800',
      'review': 'bg-purple-100 text-purple-800',
      'system': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }
}

export default AdminService;
