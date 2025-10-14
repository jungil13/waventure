import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class BookingSoftDeleteService {
  static getAuthToken() {
    return localStorage.getItem('token');
  }

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

  // Soft delete a booking
  static async softDeleteBooking(bookingId, reason = null) {
    return this.makeRequest(`/bookings/soft-delete/${bookingId}`, {
      method: 'DELETE',
      data: { reason }
    });
  }

  // Restore a soft deleted booking
  static async restoreBooking(bookingId, reason = null) {
    return this.makeRequest(`/bookings/soft-delete/${bookingId}/restore`, {
      method: 'PUT',
      data: { reason }
    });
  }

  // Get booking history
  static async getBookingHistory(bookingId) {
    return this.makeRequest(`/bookings/soft-delete/${bookingId}/history`);
  }

  // Get deleted bookings for current user
  static async getDeletedBookings() {
    return this.makeRequest('/bookings/soft-delete/deleted');
  }

  // Helper method to format deletion reason
  static formatDeletionReason(reason) {
    const reasons = {
      'cancelled': 'Booking cancelled by user',
      'duplicate': 'Duplicate booking',
      'wrong_date': 'Wrong booking date',
      'change_plans': 'Change of plans',
      'other': 'Other reason'
    };
    return reasons[reason] || reason || 'No reason provided';
  }

  // Helper method to get action icon
  static getActionIcon(action) {
    const icons = {
      'created': '➕',
      'updated': '✏️',
      'deleted': '🗑️',
      'restored': '♻️',
      'status_changed': '🔄',
      'payment_updated': '💳'
    };
    return icons[action] || '📝';
  }

  // Helper method to get action color
  static getActionColor(action) {
    const colors = {
      'created': 'text-green-600 bg-green-100',
      'updated': 'text-blue-600 bg-blue-100',
      'deleted': 'text-red-600 bg-red-100',
      'restored': 'text-purple-600 bg-purple-100',
      'status_changed': 'text-orange-600 bg-orange-100',
      'payment_updated': 'text-indigo-600 bg-indigo-100'
    };
    return colors[action] || 'text-gray-600 bg-gray-100';
  }

  // Helper method to format time ago
  static formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }
}

export default BookingSoftDeleteService;
