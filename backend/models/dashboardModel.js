const db = require('../config/db');

class Dashboard {
  // Get user dashboard statistics
  static async getUserStats(userId) {
    const connection = await db.getConnection();
    
    try {
      // Get total bookings count
      const [totalBookingsResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?',
        [userId]
      );
      
      // Get completed bookings count
      const [completedBookingsResult] = await connection.execute(
        'SELECT COUNT(*) as completed FROM bookings WHERE user_id = ? AND status = "Completed"',
        [userId]
      );
      
      // Get pending bookings count
      const [pendingBookingsResult] = await connection.execute(
        'SELECT COUNT(*) as pending FROM bookings WHERE user_id = ? AND status = "Pending"',
        [userId]
      );
      
      // Get total amount spent (only from paid bookings)
      const [totalSpentResult] = await connection.execute(
        'SELECT COALESCE(SUM(total_price), 0) as total_spent FROM bookings WHERE user_id = ? AND payment_status = "Paid"',
        [userId]
      );

      return {
        totalBookings: totalBookingsResult[0].total,
        completedBookings: completedBookingsResult[0].completed,
        pendingBookings: pendingBookingsResult[0].pending,
        totalSpent: parseFloat(totalSpentResult[0].total_spent)
      };
    } finally {
      connection.release();
    }
  }

  // Get user's recent bookings
  static async getUserRecentBookings(userId, limit = 5) {
    const connection = await db.getConnection();
    
    try {
      const [bookings] = await connection.execute(`
        SELECT 
          b.booking_id,
          b.booking_date,
          b.booking_time,
          b.duration_option,
          b.meet_up_location,
          b.status,
          b.total_price,
          b.created_at,
          bt.name as boat_name,
          bt.boat_type,
          bt.capacity,
          bi.image_url
        FROM bookings b
        LEFT JOIN boats bt ON b.boat_id = bt.boat_id
        LEFT JOIN boatimages bi ON bt.boat_id = bi.boat_id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
        LIMIT ?
      `, [userId, limit]);

      // Process bookings to get the first image for each boat
      const processedBookings = bookings.map(booking => ({
        bookingId: booking.booking_id,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
        duration: booking.duration_option,
        location: booking.meet_up_location,
        status: booking.status,
        totalPrice: parseFloat(booking.total_price),
        createdAt: booking.created_at,
        boatName: booking.boat_name,
        boatType: booking.boat_type,
        capacity: booking.capacity,
        boatImage: booking.image_url ? `http://localhost:5000${booking.image_url}` : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
      }));

      return processedBookings;
    } finally {
      connection.release();
    }
  }

  // Get featured boats
  static async getFeaturedBoats(limit = 6) {
    const connection = await db.getConnection();
    
    try {
      const [boats] = await connection.execute(`
        SELECT 
          b.boat_id,
          b.name,
          b.boat_type,
          b.capacity,
          b.rental_price,
          b.features,
          b.status,
          u.full_name as owner_name,
          bi.image_url,
          AVG(r.rating) as avg_rating,
          COUNT(r.review_id) as review_count
        FROM boats b
        LEFT JOIN users u ON b.owner_id = u.user_id
        LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
        LEFT JOIN reviews r ON b.boat_id = r.boat_id
        WHERE b.status = 'Available'
        GROUP BY b.boat_id, bi.image_url
        ORDER BY avg_rating DESC, review_count DESC
        LIMIT ?
      `, [limit]);

      // Process boats to get the first image and parse features
      const processedBoats = boats.map(boat => {
        let features = [];
        try {
          features = JSON.parse(boat.features || '[]');
        } catch (e) {
          features = [];
        }

        return {
          boatId: boat.boat_id,
          name: boat.name,
          boatType: boat.boat_type,
          capacity: boat.capacity,
          rentalPrice: parseFloat(boat.rental_price),
          features: features,
          status: boat.status,
          ownerName: boat.owner_name,
          boatImage: boat.image_url ? `http://localhost:5000${boat.image_url}` : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
          avgRating: parseFloat(boat.avg_rating) || 0,
          reviewCount: boat.review_count || 0
        };
      });

      return processedBoats;
    } finally {
      connection.release();
    }
  }
}

module.exports = Dashboard;
