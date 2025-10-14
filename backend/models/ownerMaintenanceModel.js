const db = require('../config/db');

class OwnerMaintenanceModel {
  // Get maintenance records for a specific owner's boats
  static async getOwnerMaintenance(ownerId, filters = {}) {
    const { status, maintenance_type, limit = 50, offset = 0 } = filters;
    
    let query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        b.status as boat_status,
        (SELECT bi.image_url FROM boatimages bi WHERE bi.boat_id = b.boat_id LIMIT 1) as boat_image,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE b.owner_id = ?
    `;
    
    const params = [ownerId];
    
    // Add status filter
    if (status && status !== 'all') {
      query += ' AND m.status = ?';
      params.push(status);
    }
    
    // Add maintenance type filter
    if (maintenance_type && maintenance_type !== 'all') {
      query += ' AND m.maintenance_type = ?';
      params.push(maintenance_type);
    }
    
    query += ' ORDER BY m.scheduled_date DESC, m.scheduled_time DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching owner maintenance records:', error);
      throw error;
    }
  }

  // Get maintenance count for owner
  static async getOwnerMaintenanceCount(ownerId, filters = {}) {
    const { status, maintenance_type } = filters;
    
    let query = `
      SELECT COUNT(*) as total
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      WHERE b.owner_id = ?
    `;
    
    const params = [ownerId];
    
    // Add status filter
    if (status && status !== 'all') {
      query += ' AND m.status = ?';
      params.push(status);
    }
    
    // Add maintenance type filter
    if (maintenance_type && maintenance_type !== 'all') {
      query += ' AND m.maintenance_type = ?';
      params.push(maintenance_type);
    }
    
    try {
      const [rows] = await db.execute(query, params);
      return rows[0].total;
    } catch (error) {
      console.error('Error fetching owner maintenance count:', error);
      throw error;
    }
  }

  // Get owner's boats with maintenance status
  static async getOwnerBoatsWithMaintenance(ownerId) {
    const query = `
      SELECT 
        b.*,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM maintenance m 
            WHERE m.boat_id = b.boat_id 
            AND m.status IN ('Scheduled', 'In Progress')
          ) THEN 'UnderMaintenance'
          ELSE b.status
        END as current_status,
        (SELECT COUNT(*) FROM maintenance m WHERE m.boat_id = b.boat_id) as total_maintenance,
        (SELECT COUNT(*) FROM maintenance m WHERE m.boat_id = b.boat_id AND m.status = 'Completed') as completed_maintenance,
        (SELECT MAX(m.scheduled_date) FROM maintenance m WHERE m.boat_id = b.boat_id) as last_maintenance_date
      FROM boats b
      WHERE b.owner_id = ?
      ORDER BY b.name ASC
    `;
    
    try {
      const [rows] = await db.execute(query, [ownerId]);
      return rows;
    } catch (error) {
      console.error('Error fetching owner boats with maintenance:', error);
      throw error;
    }
  }

  // Get upcoming maintenance for owner
  static async getOwnerUpcomingMaintenance(ownerId) {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        (SELECT bi.image_url FROM boatimages bi WHERE bi.boat_id = b.boat_id LIMIT 1) as boat_image,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE b.owner_id = ? 
      AND m.status IN ('Scheduled', 'In Progress')
      AND m.scheduled_date >= CURDATE()
      ORDER BY m.scheduled_date ASC, m.scheduled_time ASC
    `;
    
    try {
      const [rows] = await db.execute(query, [ownerId]);
      return rows;
    } catch (error) {
      console.error('Error fetching owner upcoming maintenance:', error);
      throw error;
    }
  }

  // Get maintenance statistics for owner
  static async getOwnerMaintenanceStats(ownerId) {
    const query = `
      SELECT 
        COUNT(*) as total_maintenance,
        SUM(CASE WHEN m.status = 'Scheduled' THEN 1 ELSE 0 END) as scheduled_count,
        SUM(CASE WHEN m.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN m.status = 'Completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN m.status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        AVG(CASE WHEN m.actual_duration IS NOT NULL THEN m.actual_duration ELSE NULL END) as avg_duration,
        SUM(CASE WHEN m.cost IS NOT NULL THEN m.cost ELSE 0 END) as total_cost,
        COUNT(DISTINCT b.boat_id) as boats_with_maintenance
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      WHERE b.owner_id = ?
      AND m.scheduled_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    `;
    
    try {
      const [rows] = await db.execute(query, [ownerId]);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching owner maintenance statistics:', error);
      throw error;
    }
  }

  // Get maintenance by ID for owner (with ownership verification)
  static async getOwnerMaintenanceById(ownerId, maintenanceId) {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        b.status as boat_status,
        (SELECT bi.image_url FROM boatimages bi WHERE bi.boat_id = b.boat_id LIMIT 1) as boat_image,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE m.maintenance_id = ? AND b.owner_id = ?
    `;
    
    try {
      const [rows] = await db.execute(query, [maintenanceId, ownerId]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching owner maintenance by ID:', error);
      throw error;
    }
  }

  // Get maintenance history for a specific boat (owner verification)
  static async getOwnerBoatMaintenanceHistory(ownerId, boatId) {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE m.boat_id = ? AND b.owner_id = ?
      ORDER BY m.scheduled_date DESC, m.scheduled_time DESC
    `;
    
    try {
      const [rows] = await db.execute(query, [boatId, ownerId]);
      return rows;
    } catch (error) {
      console.error('Error fetching owner boat maintenance history:', error);
      throw error;
    }
  }

  // Get maintenance calendar for owner (next 30 days)
  static async getOwnerMaintenanceCalendar(ownerId) {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.boat_type,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE b.owner_id = ? 
      AND m.scheduled_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY m.scheduled_date ASC, m.scheduled_time ASC
    `;
    
    try {
      const [rows] = await db.execute(query, [ownerId]);
      return rows;
    } catch (error) {
      console.error('Error fetching owner maintenance calendar:', error);
      throw error;
    }
  }
}

module.exports = OwnerMaintenanceModel;
