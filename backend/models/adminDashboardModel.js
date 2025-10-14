const db = require('../config/db');

class AdminDashboardModel {
  // Get total bookings count
  static async getTotalBookings() {
    try {
      const query = `
        SELECT COUNT(*) as total_bookings
        FROM bookings
      `;
      const [result] = await db.execute(query);
      return result[0].total_bookings || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get bookings from last month
  static async getBookingsFromLastMonth() {
    try {
      const query = `
        SELECT COUNT(*) as last_month_bookings
        FROM bookings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `;
      const [result] = await db.execute(query);
      return result[0].last_month_bookings || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get active boats count
  static async getActiveBoats() {
    try {
      const query = `
        SELECT COUNT(*) as active_boats
        FROM boats
        WHERE status = 'Available'
      `;
      const [result] = await db.execute(query);
      return result[0].active_boats || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get boats from last week (since boats table doesn't have created_at, we'll return 0)
  static async getBoatsFromLastWeek() {
    try {
      // Since boats table doesn't have created_at column, we'll return 0
      // In a real scenario, you might want to add this column to the boats table
      return 0;
    } catch (error) {
      throw error;
    }
  }

  // Get total revenue (only from completed bookings)
  static async getTotalRevenue() {
    try {
      const query = `
        SELECT COALESCE(SUM(total_price), 0) as total_revenue
        FROM bookings
        WHERE status = 'Completed'
      `;
      const [result] = await db.execute(query);
      return result[0].total_revenue || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get revenue from last month (only from completed bookings)
  static async getRevenueFromLastMonth() {
    try {
      const query = `
        SELECT COALESCE(SUM(total_price), 0) as last_month_revenue
        FROM bookings
        WHERE status = 'Completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `;
      const [result] = await db.execute(query);
      return result[0].last_month_revenue || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get average customer satisfaction (from reviews)
  static async getAverageCustomerSatisfaction() {
    try {
      const query = `
        SELECT COALESCE(AVG(rating), 0) as average_satisfaction
        FROM reviews
      `;
      const [result] = await db.execute(query);
      return result[0].average_satisfaction || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get satisfaction improvement (compare with last month)
  static async getSatisfactionImprovement() {
    try {
      const query = `
        SELECT 
          COALESCE(AVG(CASE WHEN r.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN r.rating END), 0) as current_month,
          COALESCE(AVG(CASE WHEN r.created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH) AND r.created_at >= DATE_SUB(NOW(), INTERVAL 2 MONTH) THEN r.rating END), 0) as previous_month
        FROM reviews r
      `;
      const [result] = await db.execute(query);
      const current = result[0].current_month || 0;
      const previous = result[0].previous_month || 0;
      return current - previous;
    } catch (error) {
      throw error;
    }
  }

  // Get system activities (recent bookings only, since users and boats don't have created_at)
  static async getSystemActivities(limit = 10) {
    try {
      const query = `
        SELECT 
          'booking' as type,
          'success' as activity_type,
          CONCAT('New booking #', booking_id, ' from ', u.full_name) as description,
          created_at as date
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const [activities] = await db.execute(query, [limit]);
      return activities;
    } catch (error) {
      throw error;
    }
  }

  // Get booking statistics for charts
  static async getBookingStats() {
    try {
      const query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as bookings_count,
          COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_price ELSE 0 END), 0) as revenue
        FROM bookings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      const [stats] = await db.execute(query);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats() {
    try {
      const query = `
        SELECT 
          user_type,
          COUNT(*) as count
        FROM users
        GROUP BY user_type
      `;
      const [stats] = await db.execute(query);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get boat status statistics
  static async getBoatStatusStats() {
    try {
      const query = `
        SELECT 
          status,
          COUNT(*) as count
        FROM boats
        GROUP BY status
      `;
      const [stats] = await db.execute(query);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get payment status statistics
  static async getPaymentStats() {
    try {
      const query = `
        SELECT 
          payment_status,
          COUNT(*) as count
        FROM bookings
        GROUP BY payment_status
      `;
      const [stats] = await db.execute(query);
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminDashboardModel;
