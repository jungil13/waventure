import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/admin/customers',
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AdminCustomerService = {
  // Get all customers with pagination and filters
  getAllCustomers: async (params = {}) => {
    try {
      const response = await apiClient.get('/', { params });
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by ID with full details
  getCustomerById: async (customerId) => {
    try {
      const response = await apiClient.get(`/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
  },

  // Get customer statistics
  getCustomerStats: async () => {
    try {
      const response = await apiClient.get('/stats');
      return response;
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      throw error;
    }
  },

  // Get top spending customers
  getTopSpendingCustomers: async (limit = 5) => {
    try {
      const response = await apiClient.get('/top-spending', { 
        params: { limit } 
      });
      return response;
    } catch (error) {
      console.error('Error fetching top spending customers:', error);
      throw error;
    }
  },

  // Get customers by location
  getCustomersByLocation: async () => {
    try {
      const response = await apiClient.get('/by-location');
      return response;
    } catch (error) {
      console.error('Error fetching customers by location:', error);
      throw error;
    }
  }
};

export default AdminCustomerService;

