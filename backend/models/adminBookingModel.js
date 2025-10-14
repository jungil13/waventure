const db = require('../config/db');

class AdminBookingModel {
  // Get all bookings with detailed information
  static async getAllBookings(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let params = [];

    // Build where clause based on filters
    if (filters.search) {
      whereClause += ` AND (u.full_name LIKE ? OR b.name LIKE ? OR bk.booking_id LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ` AND bk.status = ?`;
      params.push(filters.status);
    }

    if (filters.date) {
      whereClause += ` AND bk.booking_date = ?`;
      params.push(filters.date);
    }

    if (filters.payment_status) {
      whereClause += ` AND bk.payment_status = ?`;
      params.push(filters.payment_status);
    }

    const query = `
      SELECT 
        bk.booking_id,
        bk.booking_date,
        bk.booking_time,
        bk.meet_up_location,
        bk.duration_option,
        bk.status,
        bk.payment_method,
        bk.payment_status,
        bk.total_price,
        bk.payment_proof,
        bk.created_at,
        u.user_id as customer_id,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone_number as customer_phone,
        b.boat_id,
        b.name as boat_name,
        b.capacity as boat_capacity,
        b.boat_type,
        owner.full_name as owner_name,
        owner.email as owner_email,
        GROUP_CONCAT(DISTINCT i.name ORDER BY i.name SEPARATOR ', ') as islands,
        GROUP_CONCAT(DISTINCT CONCAT(a.name, ' (x', ba.quantity, ')') ORDER BY a.name SEPARATOR ', ') as addons,
        GROUP_CONCAT(DISTINCT CONCAT(fp.name, ' (x', bfp.quantity, ')') ORDER BY fp.name SEPARATOR ', ') as food_packages
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.user_id
      LEFT JOIN boats b ON bk.boat_id = b.boat_id
      LEFT JOIN users owner ON b.owner_id = owner.user_id
      LEFT JOIN booking_islands bi ON bk.booking_id = bi.booking_id
      LEFT JOIN islands i ON bi.island_id = i.island_id
      LEFT JOIN booking_addons ba ON bk.booking_id = ba.booking_id
      LEFT JOIN addons a ON ba.addon_id = a.addon_id
      LEFT JOIN booking_foodpackages bfp ON bk.booking_id = bfp.booking_id
      LEFT JOIN foodpackages fp ON bfp.package_id = fp.package_id
      WHERE 1=1 ${whereClause}
      GROUP BY bk.booking_id
      ORDER BY bk.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }

  // Get total count of bookings for pagination
  static async getBookingsCount(filters = {}) {
    let whereClause = '';
    let params = [];

    if (filters.search) {
      whereClause += ` AND (u.full_name LIKE ? OR b.name LIKE ? OR bk.booking_id LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ` AND bk.status = ?`;
      params.push(filters.status);
    }

    if (filters.date) {
      whereClause += ` AND bk.booking_date = ?`;
      params.push(filters.date);
    }

    if (filters.payment_status) {
      whereClause += ` AND bk.payment_status = ?`;
      params.push(filters.payment_status);
    }

    const query = `
      SELECT COUNT(DISTINCT bk.booking_id) as total
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.user_id
      LEFT JOIN boats b ON bk.boat_id = b.boat_id
      WHERE 1=1 ${whereClause}
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows[0].total;
    } catch (error) {
      console.error('Error getting bookings count:', error);
      throw error;
    }
  }

  // Get booking by ID with full details
  static async getBookingById(bookingId) {
    const query = `
      SELECT 
        bk.booking_id,
        bk.booking_date,
        bk.booking_time,
        bk.meet_up_location,
        bk.duration_option,
        bk.status,
        bk.payment_method,
        bk.payment_status,
        bk.total_price,
        bk.payment_proof,
        bk.created_at,
        u.user_id as customer_id,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone_number as customer_phone,
        u.profile_pic as customer_avatar,
        b.boat_id,
        b.name as boat_name,
        b.capacity as boat_capacity,
        b.boat_type,
        b.features as boat_features,
        owner.user_id as owner_id,
        owner.full_name as owner_name,
        owner.email as owner_email,
        owner.phone_number as owner_phone,
        GROUP_CONCAT(DISTINCT i.name ORDER BY i.name SEPARATOR ', ') as islands,
        GROUP_CONCAT(DISTINCT CONCAT(a.name, ' (x', ba.quantity, ')') ORDER BY a.name SEPARATOR ', ') as addons,
        GROUP_CONCAT(DISTINCT CONCAT(fp.name, ' (x', bfp.quantity, ')') ORDER BY fp.name SEPARATOR ', ') as food_packages
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.user_id
      LEFT JOIN boats b ON bk.boat_id = b.boat_id
      LEFT JOIN users owner ON b.owner_id = owner.user_id
      LEFT JOIN booking_islands bi ON bk.booking_id = bi.booking_id
      LEFT JOIN islands i ON bi.island_id = i.island_id
      LEFT JOIN booking_addons ba ON bk.booking_id = ba.booking_id
      LEFT JOIN addons a ON ba.addon_id = a.addon_id
      LEFT JOIN booking_foodpackages bfp ON bk.booking_id = bfp.booking_id
      LEFT JOIN foodpackages fp ON bfp.package_id = fp.package_id
      WHERE bk.booking_id = ?
      GROUP BY bk.booking_id
    `;

    try {
      const [rows] = await db.execute(query, [bookingId]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId, status) {
    const query = 'UPDATE bookings SET status = ? WHERE booking_id = ?';
    
    try {
      const [result] = await db.execute(query, [status, bookingId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Update boat status based on booking status
  static async updateBoatStatus(boatId, status) {
    const query = 'UPDATE boats SET status = ? WHERE boat_id = ?';
    
    try {
      const [result] = await db.execute(query, [status, boatId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating boat status:', error);
      throw error;
    }
  }

  // Get boat ID from booking ID
  static async getBoatIdFromBooking(bookingId) {
    const query = 'SELECT boat_id FROM bookings WHERE booking_id = ?';
    
    try {
      const [rows] = await db.execute(query, [bookingId]);
      return rows[0]?.boat_id || null;
    } catch (error) {
      console.error('Error getting boat ID from booking:', error);
      throw error;
    }
  }

  // Update payment status
  static async updatePaymentStatus(bookingId, paymentStatus) {
    const query = 'UPDATE bookings SET payment_status = ? WHERE booking_id = ?';
    
    try {
      const [result] = await db.execute(query, [paymentStatus, bookingId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Get booking statistics
  static async getBookingStats() {
    const query = `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        SUM(CASE WHEN payment_status = 'Paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_status = 'Unpaid' THEN 1 ELSE 0 END) as unpaid_count,
        SUM(CASE WHEN payment_status = 'Paid' THEN total_price ELSE 0 END) as total_revenue,
        AVG(CASE WHEN payment_status = 'Paid' THEN total_price ELSE NULL END) as average_booking_value
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;

    try {
      const [rows] = await db.execute(query);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching booking statistics:', error);
      throw error;
    }
  }

  // Get recent bookings (last 10)
  static async getRecentBookings() {
    const query = `
      SELECT 
        bk.booking_id,
        bk.booking_date,
        bk.booking_time,
        bk.status,
        bk.payment_status,
        bk.total_price,
        u.full_name as customer_name,
        b.name as boat_name
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.user_id
      LEFT JOIN boats b ON bk.boat_id = b.boat_id
      ORDER BY bk.created_at DESC
      LIMIT 10
    `;

    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }
  }

  // Get bookings by date range
  static async getBookingsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        bk.booking_id,
        bk.booking_date,
        bk.booking_time,
        bk.status,
        bk.payment_status,
        bk.total_price,
        u.full_name as customer_name,
        b.name as boat_name
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.user_id
      LEFT JOIN boats b ON bk.boat_id = b.boat_id
      WHERE bk.booking_date BETWEEN ? AND ?
      ORDER BY bk.booking_date ASC, bk.booking_time ASC
    `;

    try {
      const [rows] = await db.execute(query, [startDate, endDate]);
      return rows;
    } catch (error) {
      console.error('Error fetching bookings by date range:', error);
      throw error;
    }
  }
}

module.exports = AdminBookingModel;
