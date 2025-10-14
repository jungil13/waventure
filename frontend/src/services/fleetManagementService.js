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

const FleetManagementService = {
  // Get fleet overview (all boats with maintenance info)
  async getFleetOverview() {
    try {
      const response = await apiClient.get("/maintenance/fleet-overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching fleet overview:", error);
      throw error;
    }
  },

  // Get all maintenance records
  async getAllMaintenance() {
    try {
      const response = await apiClient.get("/maintenance");
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      throw error;
    }
  },

  // Get maintenance records for a specific boat
  async getMaintenanceByBoatId(boatId) {
    try {
      const response = await apiClient.get(`/maintenance/boat/${boatId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching boat maintenance records:", error);
      throw error;
    }
  },

  // Get upcoming maintenance
  async getUpcomingMaintenance() {
    try {
      const response = await apiClient.get("/maintenance/upcoming");
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming maintenance:", error);
      throw error;
    }
  },

  // Schedule new maintenance
  async scheduleMaintenance(maintenanceData) {
    try {
      const response = await apiClient.post("/maintenance", maintenanceData);
      return response.data;
    } catch (error) {
      console.error("Error scheduling maintenance:", error);
      throw error;
    }
  },

  // Update maintenance status
  async updateMaintenanceStatus(maintenanceId, status, additionalData = {}) {
    try {
      const response = await apiClient.put(`/maintenance/${maintenanceId}/status`, {
        status,
        ...additionalData
      });
      return response.data;
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      throw error;
    }
  },

  // Get maintenance by ID
  async getMaintenanceById(maintenanceId) {
    try {
      const response = await apiClient.get(`/maintenance/${maintenanceId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenance record:", error);
      throw error;
    }
  },

  // Delete maintenance record
  async deleteMaintenance(maintenanceId) {
    try {
      const response = await apiClient.delete(`/maintenance/${maintenanceId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
      throw error;
    }
  },

  // Get maintenance statistics
  async getMaintenanceStats() {
    try {
      const response = await apiClient.get("/maintenance/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenance statistics:", error);
      throw error;
    }
  }
};

export default FleetManagementService;
