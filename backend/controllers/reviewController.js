const ReviewModel = require('../models/reviewModel');

class ReviewController {
  // Create a new review
  static async createReview(req, res) {
    try {
      const { boat_id, user_id, rating, review_text } = req.body;

      // Validate required fields
      if (!boat_id || !user_id || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Boat ID, User ID, and rating are required'
        });
      }

      // Validate rating (1-5)
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Check if user has already reviewed this boat
      const existingReview = await ReviewModel.hasUserReviewedBoat(user_id, boat_id);
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this boat'
        });
      }

      const reviewId = await ReviewModel.createReview({
        boat_id,
        user_id,
        rating,
        review_text: review_text || null
      });

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: { review_id: reviewId }
      });

    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get reviews for a specific boat
  static async getBoatReviews(req, res) {
    try {
      const { boatId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const reviews = await ReviewModel.getBoatReviews(boatId, parseInt(limit), offset);
      const ratingStats = await ReviewModel.getBoatAverageRating(boatId);

      res.json({
        success: true,
        data: {
          reviews,
          rating_stats: ratingStats,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: reviews.length
          }
        }
      });

    } catch (error) {
      console.error('Error fetching boat reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get booking details for review
  static async getBookingForReview(req, res) {
    try {
      const { bookingId } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const booking = await ReviewModel.getBookingForReview(bookingId, userId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found or not eligible for review'
        });
      }

      // Check if user has already reviewed this boat
      const existingReview = await ReviewModel.hasUserReviewedBoat(userId, booking.boat_id);

      res.json({
        success: true,
        data: {
          booking,
          has_reviewed: !!existingReview,
          existing_review: existingReview
        }
      });

    } catch (error) {
      console.error('Error fetching booking for review:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user's reviews
  static async getUserReviews(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const reviews = await ReviewModel.getUserReviews(userId, parseInt(limit), offset);

      res.json({
        success: true,
        data: {
          reviews,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: reviews.length
          }
        }
      });

    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update a review
  static async updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { rating, review_text } = req.body;

      // Validate rating (1-5)
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const updated = await ReviewModel.updateReview(reviewId, {
        rating,
        review_text
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review updated successfully'
      });

    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete a review
  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;

      const deleted = await ReviewModel.deleteReview(reviewId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get boat rating statistics
  static async getBoatRatingStats(req, res) {
    try {
      const { boatId } = req.params;
      
      const ratingStats = await ReviewModel.getBoatAverageRating(boatId);

      res.json({
        success: true,
        data: ratingStats
      });

    } catch (error) {
      console.error('Error fetching boat rating stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get reviews for all boats owned by a specific owner
  static async getOwnerReviews(req, res) {
    try {
      const { ownerId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const reviews = await ReviewModel.getOwnerReviews(ownerId, parseInt(limit), offset);
      const reviewStats = await ReviewModel.getOwnerReviewStats(ownerId);

      res.json({
        success: true,
        data: {
          reviews,
          stats: reviewStats,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: reviews.length
          }
        }
      });

    } catch (error) {
      console.error('Error fetching owner reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get owner's review statistics
  static async getOwnerReviewStats(req, res) {
    try {
      const { ownerId } = req.params;
      
      const reviewStats = await ReviewModel.getOwnerReviewStats(ownerId);

      res.json({
        success: true,
        data: reviewStats
      });

    } catch (error) {
      console.error('Error fetching owner review stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // ADMIN METHODS

  // Get all reviews across all boats (admin only)
  static async getAllReviews(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const { reviews, total } = await ReviewModel.getAllReviews(parseInt(limit), offset);
    const reviewStats = await ReviewModel.getOverallReviewStats();

    res.json({
      success: true,
      data: {
        reviews,
        stats: reviewStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
}

  // Get overall review statistics (admin only)
  static async getOverallReviewStats(req, res) {
    try {
      const reviewStats = await ReviewModel.getOverallReviewStats();

      res.json({
        success: true,
        data: reviewStats
      });

    } catch (error) {
      console.error('Error fetching overall review stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Admin delete review
  static async adminDeleteReview(req, res) {
    try {
      const { reviewId } = req.params;

      const deleted = await ReviewModel.deleteReview(reviewId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully by admin'
      });

    } catch (error) {
      console.error('Error deleting review (admin):', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ReviewController;
