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

export const dashboardService = {
  // Get dashboard overview data for owner
  getOwnerDashboardData: async (ownerId) => {
    try {
      const response = await apiClient.get(`/bookings/owner/${ownerId}/dashboard`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  },

  // Get owner performance metrics
  getOwnerPerformanceMetrics: async (ownerId, period = 'month') => {
    try {
      const response = await apiClient.get(`/bookings/owner/${ownerId}/performance`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch performance metrics: ${error.message}`);
    }
  },

  // Get owner activity summary
  getOwnerActivitySummary: async (ownerId) => {
    try {
      const response = await apiClient.get(`/bookings/owner/${ownerId}/activity`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch activity summary: ${error.message}`);
    }
  },

  // Helper function to format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Helper function to format date
  formatDate: (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If it's today
      if (diffDays === 0) {
        return 'Today';
      }
      // If it's yesterday
      if (diffDays === 1) {
        return 'Yesterday';
      }
      // If it's within a week
      if (diffDays <= 7) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
      // Default format
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  },

  // Helper function to format time
  formatTime: (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      // If timeString is in HH:MM:SS format, extract just HH:MM
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const min = minutes;
        
        // Convert to 12-hour format
        if (hour === 0) {
          return `12:${min} AM`;
        } else if (hour < 12) {
          return `${hour}:${min} AM`;
        } else if (hour === 12) {
          return `12:${min} PM`;
        } else {
          return `${hour - 12}:${min} PM`;
        }
      }
      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  },

  // Helper function to get status color
  getStatusColor: (status) => {
    const colors = {
      'Pending': 'yellow',
      'Confirmed': 'green',
      'Completed': 'blue',
      'Cancelled': 'red'
    };
    return colors[status] || 'gray';
  },

  // Helper function to get payment method icon
  getPaymentIcon: (paymentMethod) => {
    return paymentMethod === 'GCash' 
      ? 'https://img.icons8.com/color/48/gcash.png'
      : 'https://img.icons8.com/color/48/cash.png';
  },

  // Helper function to calculate growth percentage
  calculateGrowth: (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  },

  // Helper function to get greeting based on time
  getGreeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  },

  // Helper function to get current month name
  getCurrentMonth: () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  },

  // Helper function to get boat type display name
  getBoatTypeDisplay: (boatType) => {
    const types = {
      'Speedboat': 'Speedboat',
      'Yacht': 'Yacht',
      'Bangka': 'Pump Boat',
      'Sailboat': 'Sailboat',
      'Catamaran': 'Catamaran'
    };
    return types[boatType] || 'Boat';
  }
};

export default dashboardService;
