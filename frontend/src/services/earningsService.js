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

export const earningsService = {
  // Get earnings data for owner with pagination and filtering
  getOwnerEarnings: async (ownerId, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      
      const response = await apiClient.get(`/bookings/owner/${ownerId}/earnings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch owner earnings: ${error.message}`);
    }
  },

  // Get earnings statistics for owner
  getOwnerEarningsStats: async (ownerId, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);
      
      const response = await apiClient.get(`/bookings/owner/${ownerId}/earnings/stats?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch owner earnings stats: ${error.message}`);
    }
  },

  // Get monthly earnings breakdown
  getOwnerMonthlyEarnings: async (ownerId, year = null) => {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      
      const response = await apiClient.get(`/bookings/owner/${ownerId}/earnings/monthly?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch monthly earnings: ${error.message}`);
    }
  },

  // Export earnings data
  exportOwnerEarnings: async (ownerId, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);
      if (options.format) params.append('format', options.format);
      
      const response = await apiClient.get(`/bookings/owner/${ownerId}/earnings/export?${params.toString()}`, {
        responseType: options.format === 'csv' ? 'blob' : 'json'
      });
      
      if (options.format === 'csv') {
        // Handle CSV download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `owner_earnings_${ownerId}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: 'CSV file downloaded successfully' };
      } else {
        return response.data;
      }
    } catch (error) {
      throw new Error(`Failed to export owner earnings: ${error.message}`);
    }
  },

  // Helper function to format date for API
  formatDateForAPI: (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  // Helper function to get current month in YYYY-MM format
  getCurrentMonth: () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  },

  // Helper function to get date range for current month
  getCurrentMonthRange: () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  },

  // Helper function to get date range for last month
  getLastMonthRange: () => {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return {
      startDate: startOfLastMonth.toISOString().split('T')[0],
      endDate: endOfLastMonth.toISOString().split('T')[0]
    };
  },

  // Helper function to get date range for current year
  getCurrentYearRange: () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    
    return {
      startDate: startOfYear.toISOString().split('T')[0],
      endDate: endOfYear.toISOString().split('T')[0]
    };
  }
};

export default earningsService;
