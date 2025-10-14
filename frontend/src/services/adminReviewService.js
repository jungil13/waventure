import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class AdminReviewService {
  // Get all reviews across all boats (admin only)
static async getAllReviews(page = 1, limit = 50) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/reviews/admin`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { page, limit }
    });

    if (response.data.success) {
      return {
        success: true,
        data: {
          reviews: response.data.data.reviews,
          stats: response.data.data.stats,
          pagination: response.data.data.pagination
        }
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch reviews'
    };
  }
}

  // Get all boats for filtering
  static async getAllBoats() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/boats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching boats:', error);
      throw error;
    }
  }

  // Get review statistics for admin dashboard
  static async getReviewStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }

  // Get reviews for a specific boat (admin view)
  static async getBoatReviews(boatId, page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews/boat/${boatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching boat reviews:', error);
      throw error;
    }
  }

  // Delete a review (admin only)
  static async deleteReview(reviewId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Get reviews by date range
  static async getReviewsByDateRange(startDate, endDate, page = 1, limit = 50) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews/date-range`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { 
          startDate, 
          endDate, 
          page, 
          limit 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by date range:', error);
      throw error;
    }
  }

  // Get reviews by rating
  static async getReviewsByRating(rating, page = 1, limit = 50) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews/rating/${rating}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by rating:', error);
      throw error;
    }
  }

  // Export reviews to CSV
  static async exportReviews(format = 'csv', filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting reviews:', error);
      throw error;
    }
  }
}

export default AdminReviewService;
