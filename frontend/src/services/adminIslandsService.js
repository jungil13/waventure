const API_BASE_URL = 'http://localhost:5000/api/admin/islands';

class AdminIslandsService {
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

  // Get all islands with pagination and filters
  static async getAllIslands(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/?${queryString}` : '/';
    
    return this.makeRequest(endpoint);
  }

  // Get island by ID with full details
  static async getIslandById(islandId) {
    return this.makeRequest(`/${islandId}`);
  }

  // Get island statistics
  static async getIslandStats() {
    return this.makeRequest('/stats/overview');
  }

  // Get top performing islands
  static async getTopPerformingIslands(limit = 10) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/stats/top-performing?${queryString}` : '/stats/top-performing';
    
    return this.makeRequest(endpoint);
  }

  // Get comprehensive dashboard data
  static async getDashboardData() {
    return this.makeRequest('/dashboard/data');
  }

  // Update island status
  static async updateIslandStatus(islandId, status) {
    return this.makeRequest(`/${islandId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Create new island
  static async createIsland(islandData) {
    return this.makeRequest('/', {
      method: 'POST',
      body: JSON.stringify(islandData)
    });
  }

  // Update island
  static async updateIsland(islandId, islandData) {
    return this.makeRequest(`/${islandId}`, {
      method: 'PUT',
      body: JSON.stringify(islandData)
    });
  }

  // Delete island
  static async deleteIsland(islandId) {
    return this.makeRequest(`/${islandId}`, {
      method: 'DELETE'
    });
  }

  // Helper method to format image URLs
  static formatImageUrl(imagePath) {
    if (!imagePath) return 'https://placehold.co/600x400/3b82f6/fff?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }

  // Helper method to get status color
  static getStatusColor(status) {
    const colors = {
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  // Helper method to format price
  static formatPrice(price) {
    return `₱${parseFloat(price).toLocaleString()}`;
  }

  // Helper method to format date
  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  // Helper method to get rating stars
  static getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
      full: fullStars,
      half: hasHalfStar ? 1 : 0,
      empty: emptyStars
    };
  }

  // Helper method to truncate text
  static truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Helper method to validate island data
  static validateIslandData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Island name is required');
    }
    
    if (!data.description || data.description.trim().length === 0) {
      errors.push('Island description is required');
    }
    
    if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
      errors.push('Price must be a valid positive number');
    }
    
    return errors;
  }

  // Helper method to prepare island data for API
  static prepareIslandData(data) {
    return {
      name: data.name?.trim(),
      description: data.description?.trim(),
      images: Array.isArray(data.images) ? data.images : [],
      status: data.status || 'Pending',
      price: parseFloat(data.price) || 0,
      features: Array.isArray(data.features) ? data.features : []
    };
  }
}

export default AdminIslandsService;
