const db = require('../config/db');

class ReviewModel {
  // Create a new review
  static async createReview(reviewData) {
    try {
      const { boat_id, user_id, rating, review_text } = reviewData;
      
      const query = `
        INSERT INTO reviews (boat_id, user_id, rating, review_text, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      
      const [result] = await db.execute(query, [boat_id, user_id, rating, review_text]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get reviews for a specific boat
  static async getBoatReviews(boatId, limit = 10, offset = 0) {
    try {
      const query = `
        SELECT 
          r.review_id,
          r.rating,
          r.review_text,
          r.created_at,
          u.full_name,
          u.profile_pic
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.boat_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const [reviews] = await db.execute(query, [boatId, limit, offset]);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Get average rating for a boat
  static async getBoatAverageRating(boatId) {
    try {
      const query = `
        SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_reviews
        FROM reviews 
        WHERE boat_id = ?
      `;
      
      const [result] = await db.execute(query, [boatId]);
      return {
        average_rating: result[0].average_rating || 0,
        total_reviews: result[0].total_reviews || 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if user has already reviewed a boat
  static async hasUserReviewedBoat(userId, boatId) {
    try {
      const query = `
        SELECT review_id, rating, review_text, created_at
        FROM reviews 
        WHERE user_id = ? AND boat_id = ?
      `;
      
      const [reviews] = await db.execute(query, [userId, boatId]);
      return reviews.length > 0 ? reviews[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get user's reviews
  static async getUserReviews(userId, limit = 10, offset = 0) {
    try {
      const query = `
        SELECT 
          r.review_id,
          r.rating,
          r.review_text,
          r.created_at,
          b.name as boat_name,
          b.boat_type,
          bi.image_url as boat_image
        FROM reviews r
        JOIN boats b ON r.boat_id = b.boat_id
        LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const [reviews] = await db.execute(query, [userId, limit, offset]);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Update a review
  static async updateReview(reviewId, reviewData) {
    try {
      const { rating, review_text } = reviewData;
      
      const query = `
        UPDATE reviews 
        SET rating = ?, review_text = ?
        WHERE review_id = ?
      `;
      
      const [result] = await db.execute(query, [rating, review_text, reviewId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a review
  static async deleteReview(reviewId) {
    try {
      const query = `DELETE FROM reviews WHERE review_id = ?`;
      const [result] = await db.execute(query, [reviewId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get booking details for review
  static async getBookingForReview(bookingId, userId) {
    try {
      const query = `
        SELECT 
          b.booking_id,
          b.boat_id,
          b.booking_date,
          b.status,
          boat.name as boat_name,
          boat.boat_type,
          boat.rental_price,
          bi.image_url as boat_image
        FROM bookings b
        JOIN boats boat ON b.boat_id = boat.boat_id
        LEFT JOIN boatimages bi ON boat.boat_id = bi.boat_id
        WHERE b.booking_id = ? AND b.user_id = ? AND b.status = 'Completed'
      `;
      
      const [bookings] = await db.execute(query, [bookingId, userId]);
      return bookings.length > 0 ? bookings[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get reviews for all boats owned by a specific owner
  static async getOwnerReviews(ownerId, limit = 10, offset = 0) {
    try {
      const query = `
        SELECT 
          r.review_id,
          r.rating,
          r.review_text,
          r.created_at,
          u.full_name as customer,
          u.profile_pic as avatar,
          b.name as boat_name,
          b.boat_type,
          bi.image_url as boat_image
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN boats b ON r.boat_id = b.boat_id
        LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
        WHERE b.owner_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const [reviews] = await db.execute(query, [ownerId, limit, offset]);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Get owner's review statistics
  static async getOwnerReviewStats(ownerId) {
    try {
      const query = `
        SELECT 
          AVG(r.rating) as average_rating,
          COUNT(r.review_id) as total_reviews,
          COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN r.rating = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN r.rating = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN r.rating = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN r.rating = 1 THEN 1 END) as one_star
        FROM reviews r
        JOIN boats b ON r.boat_id = b.boat_id
        WHERE b.owner_id = ?
      `;
      
      const [result] = await db.execute(query, [ownerId]);
      return {
        average_rating: result[0].average_rating || 0,
        total_reviews: result[0].total_reviews || 0,
        rating_distribution: {
          five_star: result[0].five_star || 0,
          four_star: result[0].four_star || 0,
          three_star: result[0].three_star || 0,
          two_star: result[0].two_star || 0,
          one_star: result[0].one_star || 0
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // ADMIN METHODS

 static async getAllReviews(limit = 50, offset = 0) {
  try {
    const query = `
      SELECT 
        r.review_id,
        r.boat_id,
        r.user_id,
        r.rating,
        r.review_text,
        r.created_at,
        u.full_name as customer_name,
        u.profile_pic as customer_avatar,
        b.name as boat_name,
        b.boat_type,
        b.owner_id,
        owner.full_name as owner_name,
        bi.image_url as boat_image
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN boats b ON r.boat_id = b.boat_id
      JOIN users owner ON b.owner_id = owner.user_id
      LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [reviews] = await db.execute(query, [limit, offset]);
    const totalCount = await this.getTotalReviewCount();
    
    return {
      reviews,
      total: totalCount
    };
  } catch (error) {
    throw error;
  }
}

  static async getTotalReviewCount() {
  try {
    const query = `SELECT COUNT(*) as total FROM reviews`;
    const [result] = await db.execute(query);
    return result[0].total;
  } catch (error) {
    throw error;
  }
}

  // Get overall review statistics (admin only)
  static async getOverallReviewStats() {
    try {
      const query = `
        SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_reviews,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
          COUNT(DISTINCT boat_id) as boats_reviewed,
          COUNT(DISTINCT user_id) as customers_reviewed
        FROM reviews
      `;
      
      const [result] = await db.execute(query);
      return {
        average_rating: result[0].average_rating || 0,
        total_reviews: result[0].total_reviews || 0,
        boats_reviewed: result[0].boats_reviewed || 0,
        customers_reviewed: result[0].customers_reviewed || 0,
        rating_distribution: {
          five_star: result[0].five_star || 0,
          four_star: result[0].four_star || 0,
          three_star: result[0].three_star || 0,
          two_star: result[0].two_star || 0,
          one_star: result[0].one_star || 0
        }
      };
    } catch (error) {
      throw error;
    }
  }

}

module.exports = ReviewModel;
