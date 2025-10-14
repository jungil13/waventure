import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AdminBookingService = {
  // Get all bookings with pagination and filters
  async getAllBookings(params = {}) {
    try {
      const response = await apiClient.get("/admin-bookings", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Get booking by ID with full details
  async getBookingById(bookingId) {
    try {
      const response = await apiClient.get(`/admin-bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const response = await apiClient.put(`/admin-bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(bookingId, payment_status) {
    try {
      const response = await apiClient.put(`/admin-bookings/${bookingId}/payment-status`, { payment_status });
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  // Get booking statistics
  async getBookingStats() {
    try {
      const response = await apiClient.get("/admin-bookings/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching booking statistics:", error);
      throw error;
    }
  },

  // Get recent bookings
  async getRecentBookings() {
    try {
      const response = await apiClient.get("/admin-bookings/recent");
      return response.data;
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      throw error;
    }
  },

  // Get bookings by date range
  async getBookingsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get("/admin-bookings/date-range", {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings by date range:", error);
      throw error;
    }
  },

  // Get payment proof
  async getPaymentProof(bookingId) {
    try {
      const response = await apiClient.get(`/admin-bookings/${bookingId}/payment-proof`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment proof:", error);
      throw error;
    }
  }
};

export default AdminBookingService;
