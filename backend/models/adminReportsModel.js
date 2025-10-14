const db = require('../config/db');

class AdminReportsModel {
  // Get overall statistics for the dashboard
  static async getOverallStats(startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        (
          SELECT COUNT(DISTINCT u.user_id) 
          FROM users u 
          WHERE u.user_type = 'Customer'
        ) as total_customers,
        (
          SELECT COUNT(DISTINCT b.boat_id) 
          FROM boats b
        ) as total_boats,
        (
          SELECT COUNT(DISTINCT CASE WHEN b.status = 'Available' THEN b.boat_id END)
          FROM boats b
        ) as active_boats,
        (
          SELECT COUNT(DISTINCT bk.booking_id) 
          FROM bookings bk 
          WHERE 1=1 ${dateFilter}
        ) as total_bookings,
        (
          SELECT COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END)
          FROM bookings bk 
          WHERE 1=1 ${dateFilter}
        ) as completed_bookings,
        (
          SELECT COUNT(DISTINCT CASE WHEN bk.status = 'Pending' THEN bk.booking_id END)
          FROM bookings bk 
          WHERE 1=1 ${dateFilter}
        ) as pending_bookings,
        (
          SELECT COUNT(DISTINCT CASE WHEN bk.status = 'Cancelled' THEN bk.booking_id END)
          FROM bookings bk 
          WHERE 1=1 ${dateFilter}
        ) as cancelled_bookings,
        (
          SELECT COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0)
          FROM bookings bk 
          WHERE 1=1 ${dateFilter}
        ) as total_revenue,
        (
          SELECT COALESCE(AVG(r.rating), 0)
          FROM reviews r
        ) as average_rating,
        (
          SELECT COUNT(DISTINCT r.review_id)
          FROM reviews r
        ) as total_reviews
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching overall stats:', error);
      throw error;
    }
  }

  // Get revenue data by month for the last 12 months
  static async getRevenueData(startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        DATE_FORMAT(bk.created_at, '%Y-%m') as month,
        MONTHNAME(bk.created_at) as month_name,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as revenue,
        COUNT(DISTINCT bk.booking_id) as bookings_count
      FROM bookings bk
      WHERE 1=1 ${dateFilter}
      GROUP BY DATE_FORMAT(bk.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }

  // Get booking trends by day of week
  static async getBookingTrends(startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        DAYNAME(bk.created_at) as day_name,
        DAYOFWEEK(bk.created_at) as day_number,
        COUNT(DISTINCT bk.booking_id) as bookings_count,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as revenue
      FROM bookings bk
      WHERE 1=1 ${dateFilter}
      GROUP BY DAYOFWEEK(bk.created_at), DAYNAME(bk.created_at)
      ORDER BY day_number
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching booking trends:', error);
      throw error;
    }
  }

  // Get top performing boats
  static async getTopBoats(limit = 10, startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        b.boat_id,
        b.name as boat_name,
        b.boat_type,
        b.rental_price,
        u.full_name as owner_name,
        (
          SELECT COUNT(DISTINCT bk.booking_id) 
          FROM bookings bk 
          WHERE bk.boat_id = b.boat_id ${dateFilter}
        ) as total_bookings,
        (
          SELECT COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END)
          FROM bookings bk 
          WHERE bk.boat_id = b.boat_id ${dateFilter}
        ) as completed_bookings,
        (
          SELECT COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0)
          FROM bookings bk 
          WHERE bk.boat_id = b.boat_id ${dateFilter}
        ) as total_revenue,
        (
          SELECT COALESCE(AVG(r.rating), 0)
          FROM reviews r 
          WHERE r.boat_id = b.boat_id
        ) as average_rating,
        (
          SELECT COUNT(DISTINCT r.review_id)
          FROM reviews r 
          WHERE r.boat_id = b.boat_id
        ) as total_reviews
      FROM boats b
      LEFT JOIN users u ON b.owner_id = u.user_id
      ORDER BY total_revenue DESC, total_bookings DESC
      LIMIT ?
    `;

    params.push(limit);

    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching top boats:', error);
      throw error;
    }
  }

  // Get customer analytics
  static async getCustomerAnalytics(startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        COUNT(DISTINCT u.user_id) as total_customers,
        COUNT(DISTINCT CASE WHEN bk.booking_id IS NOT NULL THEN u.user_id END) as customers_with_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN u.user_id END) as customers_with_completed_bookings,
        COALESCE(AVG(customer_stats.avg_spending), 0) as average_customer_spending,
        COALESCE(MAX(customer_stats.max_spending), 0) as highest_customer_spending
      FROM users u
      LEFT JOIN bookings bk ON u.user_id = bk.user_id ${dateFilter}
      LEFT JOIN (
        SELECT 
          user_id,
          AVG(total_price) as avg_spending,
          MAX(total_price) as max_spending
        FROM bookings 
        WHERE payment_status = 'Paid' AND status = 'Completed'
        GROUP BY user_id
      ) customer_stats ON u.user_id = customer_stats.user_id
      WHERE u.user_type = 'Customer'
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  // Get location-based statistics
  static async getLocationStats(startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        bk.meet_up_location as location,
        COUNT(DISTINCT bk.booking_id) as bookings_count,
        COUNT(DISTINCT bk.user_id) as unique_customers,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as revenue
      FROM bookings bk
      WHERE 1=1 ${dateFilter}
      GROUP BY bk.meet_up_location
      ORDER BY bookings_count DESC
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching location stats:', error);
      throw error;
    }
  }

  // Get payment method statistics
  static async getPaymentMethodStats(startDate = null, endDate = null) {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(bk.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const query = `
      SELECT 
        bk.payment_method,
        COUNT(DISTINCT bk.booking_id) as bookings_count,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as revenue,
        COUNT(DISTINCT CASE WHEN bk.payment_status = 'Paid' THEN bk.booking_id END) as paid_bookings,
        COUNT(DISTINCT CASE WHEN bk.payment_status = 'Unpaid' THEN bk.booking_id END) as unpaid_bookings
      FROM bookings bk
      WHERE 1=1 ${dateFilter}
      GROUP BY bk.payment_method
      ORDER BY bookings_count DESC
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching payment method stats:', error);
      throw error;
    }
  }

  // Get growth metrics (month-over-month comparison)
  static async getGrowthMetrics() {
    const query = `
      SELECT 
        DATE_FORMAT(bk.created_at, '%Y-%m') as month,
        COUNT(DISTINCT bk.booking_id) as bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as revenue,
        COUNT(DISTINCT bk.user_id) as new_customers
      FROM bookings bk
      WHERE bk.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(bk.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;

    try {
      const [rows] = await db.execute(query);
      return rows.reverse();
    } catch (error) {
      console.error('Error fetching growth metrics:', error);
      throw error;
    }
  }

  // Get recent activity summary
  static async getRecentActivity(limit = 10) {
    const query = `
      SELECT 
        'booking' as activity_type,
        bk.booking_id as id,
        bk.status as status,
        bk.total_price as amount,
        bk.created_at as created_at,
        u.full_name as customer_name,
        b.name as boat_name,
        u2.full_name as owner_name
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.user_id
      LEFT JOIN boats b ON bk.boat_id = b.boat_id
      LEFT JOIN users u2 ON b.owner_id = u2.user_id
      
      UNION ALL
      
      SELECT 
        'review' as activity_type,
        r.review_id as id,
        CONCAT('Rating: ', r.rating) as status,
        0 as amount,
        r.created_at as created_at,
        u.full_name as customer_name,
        b.name as boat_name,
        u2.full_name as owner_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.user_id
      LEFT JOIN boats b ON r.boat_id = b.boat_id
      LEFT JOIN users u2 ON b.owner_id = u2.user_id
      
      ORDER BY created_at DESC
      LIMIT ?
    `;

    try {
      const [rows] = await db.execute(query, [limit]);
      return rows;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
}

module.exports = AdminReportsModel;
