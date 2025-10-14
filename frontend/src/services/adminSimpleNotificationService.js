const API_BASE_URL = 'http://localhost:5000/api/admin/notifications';

class AdminSimpleNotificationService {
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all admin notifications
  static async getNotifications(limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/?${queryString}` : '/';
    
    return this.makeRequest(endpoint);
  }

  // Get unread count
  static async getUnreadCount() {
    return this.makeRequest('/unread-count');
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    return this.makeRequest(`/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    return this.makeRequest('/mark-all-read', {
      method: 'PUT'
    });
  }

  // Helper method to get notification icon
  static getNotificationIcon(type) {
    const icons = {
      'new_booking': '📋',
      'booking_status': '🔄',
      'boat_maintenance': '🔧'
    };
    return icons[type] || '📢';
  }

  // Helper method to get notification color
  static getNotificationColor(type) {
    const colors = {
      'new_booking': 'bg-blue-100 text-blue-600',
      'booking_status': 'bg-green-100 text-green-600',
      'boat_maintenance': 'bg-orange-100 text-orange-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  }

  // Helper method to format time ago
  static formatTimeAgo(dateString) {
    if (!dateString) return 'Just now';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }
}

export default AdminSimpleNotificationService;
