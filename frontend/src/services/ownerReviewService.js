import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class OwnerReviewService {
  // Get reviews for all boats owned by a specific owner
  static async getOwnerReviews(ownerId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/owner/${ownerId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching owner reviews:', error);
      throw error;
    }
  }

  // Get owner's review statistics
  static async getOwnerReviewStats(ownerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/owner/${ownerId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner review stats:', error);
      throw error;
    }
  }

  // Get reviews for a specific boat
  static async getBoatReviews(boatId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/boat/${boatId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching boat reviews:', error);
      throw error;
    }
  }

  // Get boat rating statistics
  static async getBoatRatingStats(boatId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/boat/${boatId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching boat rating stats:', error);
      throw error;
    }
  }
}

export default OwnerReviewService;
