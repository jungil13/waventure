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

// Request interceptor to add auth token if available
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bookingService = {
  // Get bookings for a specific owner
  getOwnerBookings: async (ownerId) => {
    try {
      const response = await apiClient.get(`/bookings/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch owner bookings: ${error.message}`);
    }
  },

  // Get booking statistics for owner
  getOwnerBookingStats: async (ownerId) => {
    try {
      const response = await apiClient.get(`/bookings/owner/${ownerId}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch owner stats: ${error.message}`);
    }
  },

  // Get detailed booking information
  getOwnerBookingDetails: async (bookingId) => {
    try {
      const response = await apiClient.get(`/bookings/owner/details/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch booking details: ${error.message}`);
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, paymentStatus = null) => {
    try {
      const requestBody = { status };
      if (paymentStatus) {
        requestBody.paymentStatus = paymentStatus;
      }
      const response = await apiClient.put(`/bookings/${bookingId}/status`, requestBody);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
  },

  // Update payment status only
  updatePaymentStatus: async (bookingId, paymentStatus) => {
    try {
      const response = await apiClient.put(`/bookings/${bookingId}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  },

  // Get all bookings (admin)
  getAllBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch all bookings: ${error.message}`);
    }
  },

  // Get user bookings
  getUserBookings: async (userId) => {
    try {
      const response = await apiClient.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user bookings: ${error.message}`);
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  },
};

export default bookingService;
