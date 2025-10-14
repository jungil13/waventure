const db = require('../config/db');

class AdminIslandsModel {
  // Get all islands with their details
  static async getAllIslands(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let params = [];

    // Build where clause based on filters
    if (filters.search) {
      whereClause += ` AND (i.name LIKE ? OR i.description LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ` AND i.status = ?`;
      params.push(filters.status);
    }

    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        whereClause += ` AND i.price >= ?`;
        params.push(filters.priceRange.min);
      }
      if (filters.priceRange.max !== undefined) {
        whereClause += ` AND i.price <= ?`;
        params.push(filters.priceRange.max);
      }
    }

    const query = `
      SELECT 
        i.island_id,
        i.name,
        i.description,
        i.images,
        i.status,
        i.price,
        i.features,
        i.created_at,
        u.full_name as created_by_name,
        u.email as created_by_email,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END) as completed_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.review_id) as total_reviews
      FROM islands i
      LEFT JOIN users u ON i.created_by = u.user_id
      LEFT JOIN booking_islands bi ON i.island_id = bi.island_id
      LEFT JOIN bookings bk ON bi.booking_id = bk.booking_id
      LEFT JOIN reviews r ON i.island_id = r.boat_id
      WHERE 1=1 ${whereClause}
      GROUP BY i.island_id
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    try {
      const [rows] = await db.execute(query, params);
      
      // Parse JSON fields and format data
      const formattedRows = rows.map(island => ({
        ...island,
        images: island.images ? JSON.parse(island.images) : [],
        features: island.features ? island.features.split(',').map(f => f.trim()) : [],
        total_bookings: parseInt(island.total_bookings) || 0,
        completed_bookings: parseInt(island.completed_bookings) || 0,
        total_revenue: parseFloat(island.total_revenue) || 0,
        average_rating: parseFloat(island.average_rating) || 0,
        total_reviews: parseInt(island.total_reviews) || 0,
        price: parseFloat(island.price) || 0
      }));

      return formattedRows;
    } catch (error) {
      console.error('Error fetching islands:', error);
      throw error;
    }
  }

  // Get total count of islands for pagination
  static async getIslandsCount(filters = {}) {
    let whereClause = '';
    let params = [];

    if (filters.search) {
      whereClause += ` AND (i.name LIKE ? OR i.description LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ` AND i.status = ?`;
      params.push(filters.status);
    }

    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        whereClause += ` AND i.price >= ?`;
        params.push(filters.priceRange.min);
      }
      if (filters.priceRange.max !== undefined) {
        whereClause += ` AND i.price <= ?`;
        params.push(filters.priceRange.max);
      }
    }

    const query = `
      SELECT COUNT(DISTINCT i.island_id) as total
      FROM islands i
      WHERE 1=1 ${whereClause}
    `;

    try {
      const [rows] = await db.execute(query, params);
      return rows[0].total;
    } catch (error) {
      console.error('Error getting islands count:', error);
      throw error;
    }
  }

  // Get island by ID with full details
  static async getIslandById(islandId) {
    const query = `
      SELECT 
        i.island_id,
        i.name,
        i.description,
        i.images,
        i.status,
        i.price,
        i.features,
        i.created_at,
        u.full_name as created_by_name,
        u.email as created_by_email,
        u.phone_number as created_by_phone,
        COUNT(DISTINCT bk.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bk.booking_id END) as completed_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Pending' THEN bk.booking_id END) as pending_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Cancelled' THEN bk.booking_id END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.review_id) as total_reviews
      FROM islands i
      LEFT JOIN users u ON i.created_by = u.user_id
      LEFT JOIN booking_islands bi ON i.island_id = bi.island_id
      LEFT JOIN bookings bk ON bi.booking_id = bk.booking_id
      LEFT JOIN reviews r ON i.island_id = r.boat_id
      WHERE i.island_id = ?
      GROUP BY i.island_id
    `;

    try {
      const [rows] = await db.execute(query, [islandId]);
      if (rows.length === 0) return null;

      const island = rows[0];
      
      // Parse JSON fields and format data
      island.images = island.images ? JSON.parse(island.images) : [];
      island.features = island.features ? island.features.split(',').map(f => f.trim()) : [];
      island.total_bookings = parseInt(island.total_bookings) || 0;
      island.completed_bookings = parseInt(island.completed_bookings) || 0;
      island.pending_bookings = parseInt(island.pending_bookings) || 0;
      island.cancelled_bookings = parseInt(island.cancelled_bookings) || 0;
      island.total_revenue = parseFloat(island.total_revenue) || 0;
      island.average_rating = parseFloat(island.average_rating) || 0;
      island.total_reviews = parseInt(island.total_reviews) || 0;
      island.price = parseFloat(island.price) || 0;

      // Get detailed booking history for this island
      const bookingsQuery = `
        SELECT 
          bk.booking_id,
          bk.booking_date,
          bk.booking_time,
          bk.status,
          bk.payment_status,
          bk.total_price,
          u.full_name as customer_name,
          u.email as customer_email,
          b.name as boat_name,
          u2.full_name as boat_owner_name
        FROM booking_islands bi
        LEFT JOIN bookings bk ON bi.booking_id = bk.booking_id
        LEFT JOIN users u ON bk.user_id = u.user_id
        LEFT JOIN boats b ON bk.boat_id = b.boat_id
        LEFT JOIN users u2 ON b.owner_id = u2.user_id
        WHERE bi.island_id = ?
        ORDER BY bk.created_at DESC
        LIMIT 20
      `;
      const [bookings] = await db.execute(bookingsQuery, [islandId]);
      island.booking_history = bookings;

      // Get reviews for this island
      const reviewsQuery = `
        SELECT 
          r.review_id,
          r.rating,
          r.review_text as comment,
          r.created_at,
          u.full_name as customer_name,
          u.profile_pic as customer_avatar
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.user_id
        WHERE r.boat_id = ?
        ORDER BY r.created_at DESC
        LIMIT 10
      `;
      const [reviews] = await db.execute(reviewsQuery, [islandId]);
      island.reviews = reviews;

      return island;
    } catch (error) {
      console.error('Error fetching island by ID:', error);
      throw error;
    }
  }

  // Get island statistics
  static async getIslandStats() {
    const query = `
      SELECT 
        COUNT(DISTINCT i.island_id) as total_islands,
        COUNT(DISTINCT CASE WHEN i.status = 'Approved' THEN i.island_id END) as approved_islands,
        COUNT(DISTINCT CASE WHEN i.status = 'Pending' THEN i.island_id END) as pending_islands,
        COUNT(DISTINCT CASE WHEN i.status = 'Rejected' THEN i.island_id END) as rejected_islands,
        COUNT(DISTINCT bi.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bi.booking_id END) as completed_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COALESCE(AVG(i.price), 0) as average_price
      FROM islands i
      LEFT JOIN booking_islands bi ON i.island_id = bi.island_id
      LEFT JOIN bookings bk ON bi.booking_id = bk.booking_id
      LEFT JOIN reviews r ON i.island_id = r.boat_id
    `;

    try {
      const [rows] = await db.execute(query);
      const stats = rows[0] || {};
      
      return {
        total_islands: parseInt(stats.total_islands) || 0,
        approved_islands: parseInt(stats.approved_islands) || 0,
        pending_islands: parseInt(stats.pending_islands) || 0,
        rejected_islands: parseInt(stats.rejected_islands) || 0,
        total_bookings: parseInt(stats.total_bookings) || 0,
        completed_bookings: parseInt(stats.completed_bookings) || 0,
        total_revenue: parseFloat(stats.total_revenue) || 0,
        average_rating: parseFloat(stats.average_rating) || 0,
        average_price: parseFloat(stats.average_price) || 0
      };
    } catch (error) {
      console.error('Error fetching island statistics:', error);
      throw error;
    }
  }

  // Get top performing islands
  static async getTopPerformingIslands(limit = 10) {
    const query = `
      SELECT 
        i.island_id,
        i.name,
        i.description,
        i.images,
        i.status,
        i.price,
        COUNT(DISTINCT bi.booking_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN bk.status = 'Completed' THEN bi.booking_id END) as completed_bookings,
        COALESCE(SUM(CASE WHEN bk.payment_status = 'Paid' AND bk.status = 'Completed' THEN bk.total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.review_id) as total_reviews
      FROM islands i
      LEFT JOIN booking_islands bi ON i.island_id = bi.island_id
      LEFT JOIN bookings bk ON bi.booking_id = bk.booking_id
      LEFT JOIN reviews r ON i.island_id = r.boat_id
      WHERE i.status = 'Approved'
      GROUP BY i.island_id
      ORDER BY total_revenue DESC, total_bookings DESC
      LIMIT ?
    `;

    try {
      const [rows] = await db.execute(query, [limit]);
      
      return rows.map(island => ({
        ...island,
        images: island.images ? JSON.parse(island.images) : [],
        total_bookings: parseInt(island.total_bookings) || 0,
        completed_bookings: parseInt(island.completed_bookings) || 0,
        total_revenue: parseFloat(island.total_revenue) || 0,
        average_rating: parseFloat(island.average_rating) || 0,
        total_reviews: parseInt(island.total_reviews) || 0,
        price: parseFloat(island.price) || 0
      }));
    } catch (error) {
      console.error('Error fetching top performing islands:', error);
      throw error;
    }
  }

  // Update island status
  static async updateIslandStatus(islandId, status) {
    const query = `
      UPDATE islands 
      SET status = ?
      WHERE island_id = ?
    `;

    try {
      const [result] = await db.execute(query, [status, islandId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating island status:', error);
      throw error;
    }
  }

  // Create new island
  static async createIsland(islandData) {
    const query = `
      INSERT INTO islands (name, description, images, status, price, features, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      islandData.name,
      islandData.description,
      JSON.stringify(islandData.images || []),
      islandData.status || 'Pending',
      islandData.price || 0,
      islandData.features ? islandData.features.join(', ') : null,
      islandData.created_by
    ];

    try {
      const [result] = await db.execute(query, params);
      return result.insertId;
    } catch (error) {
      console.error('Error creating island:', error);
      throw error;
    }
  }

  // Update island
  static async updateIsland(islandId, islandData) {
    const query = `
      UPDATE islands 
      SET name = ?, description = ?, images = ?, status = ?, price = ?, features = ?
      WHERE island_id = ?
    `;

    const params = [
      islandData.name,
      islandData.description,
      JSON.stringify(islandData.images || []),
      islandData.status,
      islandData.price,
      islandData.features ? islandData.features.join(', ') : null,
      islandId
    ];

    try {
      const [result] = await db.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating island:', error);
      throw error;
    }
  }

  // Delete island
  static async deleteIsland(islandId) {
    const query = `DELETE FROM islands WHERE island_id = ?`;

    try {
      const [result] = await db.execute(query, [islandId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting island:', error);
      throw error;
    }
  }
}

module.exports = AdminIslandsModel;
