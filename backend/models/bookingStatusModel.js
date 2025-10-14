const db = require('../config/db');

const bookingStatusModel = {
  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const query = `
        SELECT * FROM bookings 
        WHERE booking_id = ?
      `;
      const [result] = await db.query(query, [bookingId]);
      return result[0];
    } catch (error) {
      console.error('Error getting booking by ID:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const query = `
        UPDATE bookings 
        SET status = ? 
        WHERE booking_id = ?
      `;
      const [result] = await db.query(query, [status, bookingId]);
      return result;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Update boat status based on booking status
  updateBoatStatus: async (boatId, status) => {
    try {
      const query = `
        UPDATE boats 
        SET status = ? 
        WHERE boat_id = ?
      `;
      const [result] = await db.query(query, [status, boatId]);
      return result;
    } catch (error) {
      console.error('Error updating boat status:', error);
      throw error;
    }
  },

  // Get detailed booking information with boat and user details
  getBookingDetails: async (bookingId) => {
    try {
      const query = `
        SELECT 
          b.*,
          u.full_name as user_name,
          u.email as user_email,
          boat.name as boat_name,
          boat.owner_id as boat_owner_id,
          owner.full_name as owner_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.user_id
        LEFT JOIN boats boat ON b.boat_id = boat.boat_id
        LEFT JOIN users owner ON boat.owner_id = owner.user_id
        WHERE b.booking_id = ?
      `;
      const [result] = await db.query(query, [bookingId]);
      return result[0];
    } catch (error) {
      console.error('Error getting booking details:', error);
      throw error;
    }
  },

  // Create notification
  createNotification: async (notificationData) => {
    try {
      const { owner_id, user_id, boat_id, booking_id, type, title, message } = notificationData;
      const query = `
        INSERT INTO notifications (owner_id, user_id, boat_id, booking_id, type, title, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [owner_id, user_id, boat_id, booking_id, type, title, message]);
      return result;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get all bookings for a boat owner
  getOwnerBookings: async (ownerId) => {
    try {
      const query = `
        SELECT 
          b.*,
          u.full_name as user_name,
          u.email as user_email,
          boat.name as boat_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.user_id
        LEFT JOIN boats boat ON b.boat_id = boat.boat_id
        WHERE boat.owner_id = ?
        ORDER BY b.created_at DESC
      `;
      const [result] = await db.query(query, [ownerId]);
      return result;
    } catch (error) {
      console.error('Error getting owner bookings:', error);
      throw error;
    }
  },

  // Get bookings by status for owner
  getBookingsByStatus: async (ownerId, status) => {
    try {
      const query = `
        SELECT 
          b.*,
          u.full_name as user_name,
          u.email as user_email,
          boat.name as boat_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.user_id
        LEFT JOIN boats boat ON b.boat_id = boat.boat_id
        WHERE boat.owner_id = ? AND b.status = ?
        ORDER BY b.created_at DESC
      `;
      const [result] = await db.query(query, [ownerId, status]);
      return result;
    } catch (error) {
      console.error('Error getting bookings by status:', error);
      throw error;
    }
  }
};

module.exports = bookingStatusModel;
