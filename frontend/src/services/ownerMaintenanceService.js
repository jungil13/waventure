import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/owner/maintenance';

class OwnerMaintenanceService {
  // Helper method to make authenticated requests
  static async makeRequest(method, endpoint, data = null) {
    try {
      const token = localStorage.getItem('token');
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  // Get maintenance records for owner's boats
  static async getOwnerMaintenance(filters = {}) {
    const { status = 'all', maintenance_type = 'all', page = 1, limit = 20 } = filters;
    const params = new URLSearchParams({
      status,
      maintenance_type,
      page: page.toString(),
      limit: limit.toString()
    });
    
    return this.makeRequest('GET', `/?${params.toString()}`);
  }

  // Get owner's boats with maintenance status
  static async getOwnerBoatsWithMaintenance() {
    return this.makeRequest('GET', '/boats');
  }

  // Get upcoming maintenance for owner
  static async getOwnerUpcomingMaintenance() {
    return this.makeRequest('GET', '/upcoming');
  }

  // Get maintenance statistics for owner
  static async getOwnerMaintenanceStats() {
    return this.makeRequest('GET', '/stats');
  }

  // Get maintenance by ID for owner
  static async getOwnerMaintenanceById(maintenanceId) {
    return this.makeRequest('GET', `/${maintenanceId}`);
  }

  // Get maintenance history for a specific boat
  static async getOwnerBoatMaintenanceHistory(boatId) {
    return this.makeRequest('GET', `/boat/${boatId}/history`);
  }

  // Get maintenance calendar for owner
  static async getOwnerMaintenanceCalendar() {
    return this.makeRequest('GET', '/calendar');
  }

  // Update maintenance status
  static async updateMaintenanceStatus(maintenanceId, updateData) {
    return this.makeRequest('PUT', `/${maintenanceId}/status`, updateData);
  }

  // Utility functions for formatting data
  static formatMaintenanceStatus(status) {
    const statusMap = {
      'Scheduled': { text: 'Scheduled', color: 'blue', icon: '📅' },
      'In Progress': { text: 'In Progress', color: 'yellow', icon: '🔧' },
      'Completed': { text: 'Completed', color: 'green', icon: '✅' },
      'Cancelled': { text: 'Cancelled', color: 'red', icon: '❌' }
    };
    return statusMap[status] || { text: status, color: 'gray', icon: '❓' };
  }

  static formatMaintenanceType(type) {
    const typeMap = {
      'Routine': { text: 'Routine Maintenance', color: 'blue', icon: '🔧' },
      'Repair': { text: 'Repair', color: 'red', icon: '🔨' },
      'Inspection': { text: 'Inspection', color: 'yellow', icon: '🔍' },
      'Emergency': { text: 'Emergency', color: 'red', icon: '🚨' },
      'Upgrade': { text: 'Upgrade', color: 'purple', icon: '⬆️' }
    };
    return typeMap[type] || { text: type, color: 'gray', icon: '🔧' };
  }

  static formatDate(dateString) {
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
  }

  static formatTime(timeString) {
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
  }

  static formatDuration(duration) {
    if (!duration) return 'N/A';
    
    if (duration < 60) {
      return `${duration} minutes`;
    } else if (duration < 1440) { // Less than 24 hours
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
      const days = Math.floor(duration / 1440);
      const hours = Math.floor((duration % 1440) / 60);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  }

  static formatCost(cost) {
    if (!cost) return 'N/A';
    return `₱${parseFloat(cost).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }

  static getBoatImageUrl(imagePath) {
    if (!imagePath) {
      return 'https://placehold.co/400x200/333333/ffffff?text=No+Image';
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the full URL
    return `http://localhost:5000${imagePath}`;
  }

  static getPriorityColor(priority) {
    const priorityMap = {
      'Low': 'text-green-600 bg-green-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'High': 'text-orange-600 bg-orange-100',
      'Critical': 'text-red-600 bg-red-100'
    };
    return priorityMap[priority] || 'text-gray-600 bg-gray-100';
  }
}

export default OwnerMaintenanceService;
