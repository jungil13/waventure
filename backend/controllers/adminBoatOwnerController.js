const AdminBoatOwnerModel = require('../models/adminBoatOwnerModel');

class AdminBoatOwnerController {
  // Get all boat owners with pagination and filters
  static async getAllBoatOwners(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        search: req.query.search || '',
        status: req.query.status || '',
        location: req.query.location || ''
      };

      const [owners, totalCount] = await Promise.all([
        AdminBoatOwnerModel.getAllBoatOwners(page, limit, filters),
        AdminBoatOwnerModel.getBoatOwnersCount(filters)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          owners,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        message: 'Boat owners retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllBoatOwners:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boat owners',
        error: error.message
      });
    }
  }

  // Get boat owner by ID with full details
  static async getBoatOwnerById(req, res) {
    try {
      const { ownerId } = req.params;

      if (!ownerId || isNaN(ownerId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid owner ID is required'
        });
      }

      const owner = await AdminBoatOwnerModel.getBoatOwnerById(parseInt(ownerId));

      if (!owner) {
        return res.status(404).json({
          success: false,
          message: 'Boat owner not found'
        });
      }

      res.json({
        success: true,
        data: owner,
        message: 'Boat owner details retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getBoatOwnerById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boat owner details',
        error: error.message
      });
    }
  }

  // Note: Status update functionality removed as users table doesn't have a status column
  // Boat owners are managed through their user_type and boat statuses

  // Get boat owner statistics
  static async getBoatOwnerStats(req, res) {
    try {
      const stats = await AdminBoatOwnerModel.getBoatOwnerStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Boat owner statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getBoatOwnerStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boat owner statistics',
        error: error.message
      });
    }
  }

  // Get top performing boat owners
  static async getTopPerformingOwners(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const topOwners = await AdminBoatOwnerModel.getTopPerformingOwners(limit);
      
      res.json({
        success: true,
        data: topOwners,
        message: 'Top performing boat owners retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getTopPerformingOwners:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve top performing boat owners',
        error: error.message
      });
    }
  }

  // Get boat owners by location
  static async getBoatOwnersByLocation(req, res) {
    try {
      const locationStats = await AdminBoatOwnerModel.getBoatOwnersByLocation();
      
      res.json({
        success: true,
        data: locationStats,
        message: 'Boat owners by location retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getBoatOwnersByLocation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boat owners by location',
        error: error.message
      });
    }
  }
}

module.exports = AdminBoatOwnerController;
