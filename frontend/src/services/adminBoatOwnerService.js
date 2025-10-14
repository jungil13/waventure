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

const AdminBoatOwnerService = {
  // Get all boat owners with pagination and filters
  async getAllBoatOwners(params = {}) {
    try {
      const response = await apiClient.get("/admin-boat-owners", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching boat owners:", error);
      throw error;
    }
  },

  // Get boat owner by ID with full details
  async getBoatOwnerById(ownerId) {
    try {
      const response = await apiClient.get(`/admin-boat-owners/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching boat owner details:", error);
      throw error;
    }
  },

  // Note: Status update functionality removed as users table doesn't have a status column

  // Get boat owner statistics
  async getBoatOwnerStats() {
    try {
      const response = await apiClient.get("/admin-boat-owners/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching boat owner statistics:", error);
      throw error;
    }
  },

  // Get top performing boat owners
  async getTopPerformingOwners(limit = 5) {
    try {
      const response = await apiClient.get("/admin-boat-owners/top-performing", {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top performing boat owners:", error);
      throw error;
    }
  },

  // Get boat owners by location
  async getBoatOwnersByLocation() {
    try {
      const response = await apiClient.get("/admin-boat-owners/by-location");
      return response.data;
    } catch (error) {
      console.error("Error fetching boat owners by location:", error);
      throw error;
    }
  }
};

export default AdminBoatOwnerService;
