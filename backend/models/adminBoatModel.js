const db = require('../config/db');

class AdminBoatModel {
  // Get all boats for admin
  static async getAllBoats() {
    try {
      const query = `
        SELECT 
          b.boat_id,
          b.name as boat_name,
          b.boat_type,
          b.status,
          b.capacity,
          b.rental_price,
          u.full_name as owner_name,
          u.user_id as owner_id
        FROM boats b
        JOIN users u ON b.owner_id = u.user_id
        ORDER BY b.name ASC
      `;
      
      const [boats] = await db.execute(query);
      return boats;
    } catch (error) {
      throw error;
    }
  }

  // Get boat statistics
  static async getBoatStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_boats,
          COUNT(CASE WHEN status = 'Available' THEN 1 END) as available_boats,
          COUNT(CASE WHEN status = 'Rented' THEN 1 END) as rented_boats,
          COUNT(CASE WHEN status = 'UnderMaintenance' THEN 1 END) as maintenance_boats,
          COUNT(DISTINCT owner_id) as total_owners,
          AVG(rental_price) as average_price
        FROM boats
      `;
      
      const [result] = await db.execute(query);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // Get boat by ID with full details
  static async getBoatById(boatId) {
    try {
      const query = `
        SELECT 
          b.boat_id,
          b.name as boat_name,
          b.features,
          b.capacity,
          b.boat_type,
          b.rental_price,
          b.duration_options,
          b.status,
          u.full_name as owner_name,
          u.user_id as owner_id,
          u.email as owner_email,
          u.phone_number as owner_phone
        FROM boats b
        JOIN users u ON b.owner_id = u.user_id
        WHERE b.boat_id = ?
      `;
      
      const [boats] = await db.execute(query, [boatId]);
      return boats.length > 0 ? boats[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminBoatModel;
