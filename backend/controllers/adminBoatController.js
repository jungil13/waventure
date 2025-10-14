const AdminBoatModel = require('../models/adminBoatModel');

class AdminBoatController {
  // Get all boats for admin
  static async getAllBoats(req, res) {
    try {
      const boats = await AdminBoatModel.getAllBoats();

      res.json({
        success: true,
        data: { boats }
      });

    } catch (error) {
      console.error('Error fetching all boats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get boat statistics
  static async getBoatStats(req, res) {
    try {
      const stats = await AdminBoatModel.getBoatStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching boat stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get boat by ID with full details
  static async getBoatById(req, res) {
    try {
      const { boatId } = req.params;
      const boat = await AdminBoatModel.getBoatById(boatId);

      if (!boat) {
        return res.status(404).json({
          success: false,
          message: 'Boat not found'
        });
      }

      res.json({
        success: true,
        data: { boat }
      });

    } catch (error) {
      console.error('Error fetching boat by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AdminBoatController;
