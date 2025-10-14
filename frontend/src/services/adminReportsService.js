const API_BASE_URL = 'http://localhost:5000/api/admin/reports';

class AdminReportsService {
  // Get authentication token from localStorage
  static getAuthToken() {
    return localStorage.getItem('token');
  }

  // Make authenticated API request
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get overall statistics
  static async getOverallStats(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/stats?${queryString}` : '/stats';
    
    return this.makeRequest(endpoint);
  }

  // Get revenue data for charts
  static async getRevenueData(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/revenue?${queryString}` : '/revenue';
    
    return this.makeRequest(endpoint);
  }

  // Get booking trends
  static async getBookingTrends(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/booking-trends?${queryString}` : '/booking-trends';
    
    return this.makeRequest(endpoint);
  }

  // Get top performing boats
  static async getTopBoats(limit = 10, startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/top-boats?${queryString}` : '/top-boats';
    
    return this.makeRequest(endpoint);
  }

  // Get customer analytics
  static async getCustomerAnalytics(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/customer-analytics?${queryString}` : '/customer-analytics';
    
    return this.makeRequest(endpoint);
  }

  // Get location statistics
  static async getLocationStats(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/location-stats?${queryString}` : '/location-stats';
    
    return this.makeRequest(endpoint);
  }

  // Get payment method statistics
  static async getPaymentMethodStats(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/payment-method-stats?${queryString}` : '/payment-method-stats';
    
    return this.makeRequest(endpoint);
  }

  // Get growth metrics
  static async getGrowthMetrics() {
    return this.makeRequest('/growth-metrics');
  }

  // Get recent activity
  static async getRecentActivity(limit = 10) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/recent-activity?${queryString}` : '/recent-activity';
    
    return this.makeRequest(endpoint);
  }

  // Get comprehensive dashboard data (all data in one request)
  static async getDashboardData(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/dashboard?${queryString}` : '/dashboard';
    
    return this.makeRequest(endpoint);
  }

  // Helper method to format date for API calls
  static formatDateForAPI(date) {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  // Helper method to calculate date range for common periods
  static getDateRange(period) {
    const today = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'last7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last3months':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'last6months':
        startDate.setMonth(today.getMonth() - 6);
        break;
      case 'last12months':
        startDate.setMonth(today.getMonth() - 12);
        break;
      case 'thisYear':
        startDate.setMonth(0, 1); // January 1st
        break;
      default:
        return { startDate: null, endDate: null };
    }
    
    return {
      startDate: this.formatDateForAPI(startDate),
      endDate: this.formatDateForAPI(today)
    };
  }
}

export default AdminReportsService;
