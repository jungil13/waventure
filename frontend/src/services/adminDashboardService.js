import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class AdminDashboardService {
  // Get dashboard overview data
  static async getDashboardOverview() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  // Get system activities
  static async getSystemActivities(limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/activities`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching system activities:', error);
      throw error;
    }
  }

  // Get booking statistics for charts
  static async getBookingStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/bookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  // Get user statistics for charts
  static async getUserStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get boat status statistics for charts
  static async getBoatStatusStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/boats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching boat status stats:', error);
      throw error;
    }
  }

  // Get payment statistics for charts
  static async getPaymentStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  // Get all dashboard data (overview + charts data)
  static async getAllDashboardData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin-dashboard/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw error;
    }
  }
}

export default AdminDashboardService;
