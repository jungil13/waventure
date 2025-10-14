const db = require('../config/db');

class MaintenanceModel {
  // Get all maintenance records with boat and owner information
  static async getAllMaintenance() {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        b.status as boat_status,
        u.full_name as owner_name,
        u.email as owner_email,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users u ON b.owner_id = u.user_id
      JOIN users admin ON m.created_by = admin.user_id
      ORDER BY m.scheduled_date DESC, m.scheduled_time DESC
    `;
    
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching all maintenance records:', error);
      throw error;
    }
  }

  // Get maintenance records for a specific boat
  static async getMaintenanceByBoatId(boatId) {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE m.boat_id = ?
      ORDER BY m.scheduled_date DESC, m.scheduled_time DESC
    `;
    
    try {
      const [rows] = await db.execute(query, [boatId]);
      return rows;
    } catch (error) {
      console.error('Error fetching maintenance records for boat:', error);
      throw error;
    }
  }

  // Get upcoming maintenance (scheduled and in progress)
  static async getUpcomingMaintenance() {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        u.full_name as owner_name,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users u ON b.owner_id = u.user_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE m.status IN ('Scheduled', 'In Progress')
      ORDER BY m.scheduled_date ASC, m.scheduled_time ASC
    `;
    
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching upcoming maintenance:', error);
      throw error;
    }
  }

  // Schedule new maintenance
  static async scheduleMaintenance(maintenanceData) {
    const {
      boat_id,
      scheduled_date,
      scheduled_time,
      maintenance_type,
      description,
      assigned_technician,
      estimated_duration,
      cost,
      notes,
      created_by
    } = maintenanceData;

    const query = `
      INSERT INTO maintenance (
        boat_id, scheduled_date, scheduled_time, maintenance_type,
        description, assigned_technician, estimated_duration, cost, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.execute(query, [
        boat_id, scheduled_date, scheduled_time, maintenance_type,
        description, assigned_technician, estimated_duration, cost, notes, created_by
      ]);

      // Update boat status to UnderMaintenance if it's scheduled
      await this.updateBoatStatusForMaintenance(boat_id, 'UnderMaintenance');

      return result.insertId;
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      throw error;
    }
  }

  // Update maintenance status
  static async updateMaintenanceStatus(maintenanceId, status, additionalData = {}) {
    const { actual_duration, notes } = additionalData;
    
    let query = 'UPDATE maintenance SET status = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [status];

    if (actual_duration !== undefined) {
      query += ', actual_duration = ?';
      params.push(actual_duration);
    }

    if (notes !== undefined) {
      query += ', notes = ?';
      params.push(notes);
    }

    query += ' WHERE maintenance_id = ?';
    params.push(maintenanceId);

    try {
      const [result] = await db.execute(query, params);

      // If maintenance is completed, check if boat should be available
      if (status === 'Completed') {
        const maintenance = await this.getMaintenanceById(maintenanceId);
        if (maintenance) {
          await this.updateBoatStatusForMaintenance(maintenance.boat_id, 'Available');
        }
      }

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      throw error;
    }
  }

  // Get maintenance by ID
  static async getMaintenanceById(maintenanceId) {
    const query = `
      SELECT 
        m.*,
        b.name as boat_name,
        b.capacity,
        b.boat_type,
        b.status as boat_status,
        u.full_name as owner_name,
        admin.full_name as created_by_name
      FROM maintenance m
      JOIN boats b ON m.boat_id = b.boat_id
      JOIN users u ON b.owner_id = u.user_id
      JOIN users admin ON m.created_by = admin.user_id
      WHERE m.maintenance_id = ?
    `;
    
    try {
      const [rows] = await db.execute(query, [maintenanceId]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching maintenance by ID:', error);
      throw error;
    }
  }

  // Delete maintenance record
  static async deleteMaintenance(maintenanceId) {
    const query = 'DELETE FROM maintenance WHERE maintenance_id = ?';
    
    try {
      const [result] = await db.execute(query, [maintenanceId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      throw error;
    }
  }

  // Update boat status based on maintenance
  static async updateBoatStatusForMaintenance(boatId, status) {
    const query = 'UPDATE boats SET status = ? WHERE boat_id = ?';
    
    try {
      const [result] = await db.execute(query, [status, boatId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating boat status:', error);
      throw error;
    }
  }

  // Get maintenance statistics
  static async getMaintenanceStats() {
    const query = `
      SELECT 
        COUNT(*) as total_maintenance,
        SUM(CASE WHEN status = 'Scheduled' THEN 1 ELSE 0 END) as scheduled_count,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        AVG(CASE WHEN actual_duration IS NOT NULL THEN actual_duration ELSE NULL END) as avg_duration,
        SUM(CASE WHEN cost IS NOT NULL THEN cost ELSE 0 END) as total_cost
      FROM maintenance
      WHERE scheduled_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `;
    
    try {
      const [rows] = await db.execute(query);
      return rows[0] || {};
    } catch (error) {
      console.error('Error fetching maintenance statistics:', error);
      throw error;
    }
  }

  // Check if boat has scheduled maintenance
  static async hasScheduledMaintenance(boatId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM maintenance 
      WHERE boat_id = ? AND status IN ('Scheduled', 'In Progress')
    `;
    
    try {
      const [rows] = await db.execute(query, [boatId]);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error checking scheduled maintenance:', error);
      throw error;
    }
  }
}

module.exports = MaintenanceModel;
