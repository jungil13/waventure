const db = require('../config/db');

class AdminBoatOwnerModel {
  // Get all boat owners with their boats and statistics
  static async getAllBoatOwners(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let params = [];

    // Build where clause based on filters
    if (filters.search) {
      whereClause += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR b.name LIKE ?)`;
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
        COUNT(DISTINCT b.boat_id) as total_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'Available' THEN b.boat_id END) as active_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'Rented' THEN b.boat_id END) as rented_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'UnderMaintenance' THEN b.boat_id END) as maintenance_boats,
        (
          SELECT COUNT(DISTINCT bk.booking_id) 
          FROM bookings bk 
          JOIN boats bo ON bk.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as total_bookings,
        (
          SELECT COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0)
          FROM bookings bk 
          JOIN boats bo ON bk.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as total_revenue,
        (
          SELECT COALESCE(AVG(r.rating), 0)
          FROM reviews r 
          JOIN boats bo ON r.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as average_rating,
        (
          SELECT COUNT(DISTINCT r.review_id)
          FROM reviews r 
          JOIN boats bo ON r.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as total_reviews
      FROM users u
      LEFT JOIN boats b ON u.user_id = b.owner_id
      WHERE u.user_type = 'BoatOwner' ${whereClause}
      GROUP BY u.user_id
      ORDER BY u.user_id DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    try {
      const [rows] = await db.execute(query, params);
      
      // Get boats for each owner
      for (let owner of rows) {
        const boatsQuery = `
          SELECT 
            boat_id,
            name,
            boat_type,
            capacity,
            status
          FROM boats 
          WHERE owner_id = ?
          ORDER BY boat_id DESC
        `;
        const [boats] = await db.execute(boatsQuery, [owner.user_id]);
        owner.boats = boats;
      }

      return rows;
    } catch (error) {
      console.error('Error fetching boat owners:', error);
      throw error;
    }
  }

  // Get total count of boat owners for pagination
  static async getBoatOwnersCount(filters = {}) {
    let whereClause = '';
    let params = [];

    if (filters.search) {
      whereClause += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR b.name LIKE ?)`;
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
      LEFT JOIN boats b ON u.user_id = b.owner_id
      WHERE u.user_type = 'BoatOwner' ${whereClause}
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows[0].total;
    } catch (error) {
      console.error('Error getting boat owners count:', error);
      throw error;
    }
  }

  // Get boat owner by ID with full details
  static async getBoatOwnerById(ownerId) {
    const query = `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.location,
        u.profile_pic,
        u.user_type,
        COUNT(DISTINCT b.boat_id) as total_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'Available' THEN b.boat_id END) as active_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'Rented' THEN b.boat_id END) as rented_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'UnderMaintenance' THEN b.boat_id END) as maintenance_boats,
        (
          SELECT COUNT(DISTINCT bk.booking_id) 
          FROM bookings bk 
          JOIN boats bo ON bk.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as total_bookings,
        (
          SELECT COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0)
          FROM bookings bk 
          JOIN boats bo ON bk.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as total_revenue,
        (
          SELECT COALESCE(AVG(r.rating), 0)
          FROM reviews r 
          JOIN boats bo ON r.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as average_rating,
        (
          SELECT COUNT(DISTINCT r.review_id)
          FROM reviews r 
          JOIN boats bo ON r.boat_id = bo.boat_id 
          WHERE bo.owner_id = u.user_id
        ) as total_reviews
      FROM users u
      LEFT JOIN boats b ON u.user_id = b.owner_id
      WHERE u.user_id = ? AND u.user_type = 'BoatOwner'
      GROUP BY u.user_id
    `;

    try {
      const [rows] = await db.execute(query, [ownerId]);
      if (rows.length === 0) return null;

      const owner = rows[0];

      // Get detailed boats information
      const boatsQuery = `
        SELECT 
          b.boat_id,
          b.name,
          b.boat_type,
          b.capacity,
          b.status,
          b.features,
          (
            SELECT COUNT(DISTINCT bk.booking_id) 
            FROM bookings bk 
            WHERE bk.boat_id = b.boat_id
          ) as total_bookings,
          (
            SELECT COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0)
            FROM bookings bk 
            WHERE bk.boat_id = b.boat_id
          ) as boat_revenue,
          (
            SELECT COALESCE(AVG(r.rating), 0)
            FROM reviews r 
            WHERE r.boat_id = b.boat_id
          ) as boat_rating,
          (
            SELECT COUNT(DISTINCT r.review_id)
            FROM reviews r 
            WHERE r.boat_id = b.boat_id
          ) as boat_reviews
        FROM boats b
        WHERE b.owner_id = ?
        ORDER BY b.boat_id DESC
      `;
      const [boats] = await db.execute(boatsQuery, [ownerId]);
      owner.boats = boats;

      // Get recent bookings
      const recentBookingsQuery = `
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
        WHERE b.owner_id = ?
        ORDER BY bk.created_at DESC
        LIMIT 10
      `;
      const [recentBookings] = await db.execute(recentBookingsQuery, [ownerId]);
      owner.recent_bookings = recentBookings;

      return owner;
    } catch (error) {
      console.error('Error fetching boat owner by ID:', error);
      throw error;
    }
  }

  // Note: Status management removed as users table doesn't have a status column
  // Boat owners are managed through their user_type and boat statuses

  // Get boat owner statistics
  static async getBoatOwnerStats() {
    const query = `
      SELECT 
        COUNT(DISTINCT u.user_id) as total_owners,
        COUNT(DISTINCT b.boat_id) as total_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'Available' THEN b.boat_id END) as available_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'Rented' THEN b.boat_id END) as rented_boats,
        COUNT(DISTINCT CASE WHEN b.status = 'UnderMaintenance' THEN b.boat_id END) as maintenance_boats,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM users u
      LEFT JOIN boats b ON u.user_id = b.owner_id
      LEFT JOIN bookings bk ON b.boat_id = bk.boat_id
      LEFT JOIN reviews r ON b.boat_id = r.boat_id
      WHERE u.user_type = 'BoatOwner'
    `;

    try {
      const [rows] = await db.execute(query);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching boat owner statistics:', error);
      throw error;
    }
  }

  // Get top performing boat owners
  static async getTopPerformingOwners(limit = 5) {
    const query = `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.profile_pic,
        COUNT(DISTINCT b.boat_id) as total_boats,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM users u
      LEFT JOIN boats b ON u.user_id = b.owner_id
      LEFT JOIN bookings bk ON b.boat_id = bk.boat_id
      LEFT JOIN reviews r ON b.boat_id = r.boat_id
      WHERE u.user_type = 'BoatOwner'
      GROUP BY u.user_id
      ORDER BY total_revenue DESC, average_rating DESC
      LIMIT ?
    `;

    try {
      const [rows] = await db.execute(query, [limit]);
      return rows;
    } catch (error) {
      console.error('Error fetching top performing owners:', error);
      throw error;
    }
  }

  // Get boat owners by location
  static async getBoatOwnersByLocation() {
    const query = `
      SELECT 
        u.location,
        COUNT(DISTINCT u.user_id) as owner_count,
        COUNT(DISTINCT b.boat_id) as boat_count
      FROM users u
      LEFT JOIN boats b ON u.user_id = b.owner_id
      WHERE u.user_type = 'BoatOwner' AND u.location IS NOT NULL AND u.location != ''
      GROUP BY u.location
      ORDER BY owner_count DESC
    `;

    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching boat owners by location:', error);
      throw error;
    }
  }
}

module.exports = AdminBoatOwnerModel;
