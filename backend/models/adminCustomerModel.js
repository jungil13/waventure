const db = require('../config/db');

class AdminCustomerModel {
  // Get all customers with their booking statistics
  static async getAllCustomers(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let params = [];

    // Build where clause based on filters
    if (filters.search) {
      whereClause += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ` AND u.status = ?`;
      params.push(filters.status);
    }

    if (filters.location) {
      whereClause += ` AND u.location LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    const query = `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.location,
        u.profile_pic,
        u.user_type,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END) as completed_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Pending' THEN bk.booking_id END) as pending_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Cancelled' THEN bk.booking_id END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_spent,
        MAX(bk.booking_date) as last_booking_date,
        MAX(bk.created_at) as last_activity
      FROM users u
      LEFT JOIN bookings bk ON u.user_id = bk.user_id
      WHERE u.user_type = 'Customer' ${whereClause}
      GROUP BY u.user_id
      ORDER BY u.user_id DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    try {
      const [rows] = await db.execute(query, params);
      
      // Get recent bookings for each customer
      for (let customer of rows) {
        const recentBookingsQuery = `
          SELECT 
            bk.booking_id,
            bk.booking_date,
            bk.booking_time,
            bk.status,
            bk.payment_status,
            bk.total_price,
            b.name as boat_name,
            u2.full_name as owner_name
          FROM bookings bk
          LEFT JOIN boats b ON bk.boat_id = b.boat_id
          LEFT JOIN users u2 ON b.owner_id = u2.user_id
          WHERE bk.user_id = ?
          ORDER BY bk.created_at DESC
          LIMIT 5
        `;
        const [recentBookings] = await db.execute(recentBookingsQuery, [customer.user_id]);
        customer.recent_bookings = recentBookings;
      }

      return rows;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get total count of customers for pagination
  static async getCustomersCount(filters = {}) {
    let whereClause = '';
    let params = [];

    if (filters.search) {
      whereClause += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ` AND u.status = ?`;
      params.push(filters.status);
    }

    if (filters.location) {
      whereClause += ` AND u.location LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    const query = `
      SELECT COUNT(DISTINCT u.user_id) as total
      FROM users u
      WHERE u.user_type = 'Customer' ${whereClause}
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows[0].total;
    } catch (error) {
      console.error('Error getting customers count:', error);
      throw error;
    }
  }

  // Get customer by ID with full details
  static async getCustomerById(customerId) {
    const query = `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.location,
        u.profile_pic,
        u.user_type,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END) as completed_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Pending' THEN bk.booking_id END) as pending_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Cancelled' THEN bk.booking_id END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_spent,
        MAX(bk.booking_date) as last_booking_date,
        MAX(bk.created_at) as last_activity
      FROM users u
      LEFT JOIN bookings bk ON u.user_id = bk.user_id
      WHERE u.user_id = ? AND u.user_type = 'Customer'
      GROUP BY u.user_id
    `;

    try {
      const [rows] = await db.execute(query, [customerId]);
      if (rows.length === 0) return null;

      const customer = rows[0];

      // Get detailed booking history
      const bookingsQuery = `
        SELECT 
          bk.booking_id,
          bk.booking_date,
          bk.booking_time,
          bk.status,
          bk.payment_status,
          bk.total_price,
          b.name as boat_name,
          b.boat_type,
          u2.full_name as owner_name,
          u2.email as owner_email
        FROM bookings bk
        LEFT JOIN boats b ON bk.boat_id = b.boat_id
        LEFT JOIN users u2 ON b.owner_id = u2.user_id
        WHERE bk.user_id = ?
        ORDER BY bk.created_at DESC
      `;
      const [bookings] = await db.execute(bookingsQuery, [customerId]);
      customer.booking_history = bookings;

      // Get customer reviews
      const reviewsQuery = `
        SELECT 
          r.review_id,
          r.rating,
          r.review_text as comment,
          r.created_at,
          b.name as boat_name,
          u2.full_name as owner_name
        FROM reviews r
        LEFT JOIN boats b ON r.boat_id = b.boat_id
        LEFT JOIN users u2 ON b.owner_id = u2.user_id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `;
      const [reviews] = await db.execute(reviewsQuery, [customerId]);
      customer.reviews = reviews;

      return customer;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      throw error;
    }
  }

  // Get customer statistics
  static async getCustomerStats() {
    const query = `
      SELECT 
        COUNT(DISTINCT u.user_id) as total_customers,
        COUNT(DISTINCT CASE WHEN bk.booking_id IS NOT NULL THEN u.user_id END) as customers_with_bookings,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END) as completed_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Pending' THEN bk.booking_id END) as pending_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Cancelled' THEN bk.booking_id END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM users u
      LEFT JOIN bookings bk ON u.user_id = bk.user_id
      LEFT JOIN reviews r ON u.user_id = r.user_id
      WHERE u.user_type = 'Customer'
    `;

    try {
      const [rows] = await db.execute(query);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      throw error;
    }
  }

  // Get top spending customers
  static async getTopSpendingCustomers(limit = 5) {
    const query = `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.profile_pic,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_spent,
        MAX(bk.booking_date) as last_booking_date
      FROM users u
      LEFT JOIN bookings bk ON u.user_id = bk.user_id
      WHERE u.user_type = 'Customer'
      GROUP BY u.user_id
      ORDER BY total_spent DESC
      LIMIT ?
    `;

    try {
      const [rows] = await db.execute(query, [limit]);
      return rows;
    } catch (error) {
      console.error('Error fetching top spending customers:', error);
      throw error;
    }
  }

  // Get customers by location
  static async getCustomersByLocation() {
    const query = `
      SELECT 
        u.location,
        COUNT(DISTINCT u.user_id) as customer_count,
        COUNT(DISTINCT bk.booking_id) as total_bookings
      FROM users u
      LEFT JOIN bookings bk ON u.user_id = bk.user_id
      WHERE u.user_type = 'Customer' AND u.location IS NOT NULL AND u.location != ''
      GROUP BY u.location
      ORDER BY customer_count DESC
    `;

    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching customers by location:', error);
      throw error;
    }
  }
}

module.exports = AdminCustomerModel;

