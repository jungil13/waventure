const AdminIslandsModel = require('../models/adminIslandsModel');

class AdminIslandsController {
  // Get all islands with pagination and filters
  static async getAllIslands(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        minPrice, 
        maxPrice 
      } = req.query;

      const filters = {
        search,
        status,
        priceRange: {
          min: minPrice ? parseFloat(minPrice) : undefined,
          max: maxPrice ? parseFloat(maxPrice) : undefined
        }
      };

      const [islands, totalCount] = await Promise.all([
        AdminIslandsModel.getAllIslands(parseInt(page), parseInt(limit), filters),
        AdminIslandsModel.getIslandsCount(filters)
      ]);

      res.status(200).json({
        success: true,
        data: {
          islands,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            totalCount,
            hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
            hasPrev: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Error in getAllIslands:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch islands',
        error: error.message
      });
    }
  }

  // Get island by ID with full details
  static async getIslandById(req, res) {
    try {
      const { id } = req.params;
      
      const island = await AdminIslandsModel.getIslandById(parseInt(id));
      
      if (!island) {
        return res.status(404).json({
          success: false,
          message: 'Island not found'
        });
      }

      res.status(200).json({
        success: true,
        data: island
      });
    } catch (error) {
      console.error('Error in getIslandById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch island details',
        error: error.message
      });
    }
  }

  // Get island statistics
  static async getIslandStats(req, res) {
    try {
      const stats = await AdminIslandsModel.getIslandStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getIslandStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch island statistics',
        error: error.message
      });
    }
  }

  // Get top performing islands
  static async getTopPerformingIslands(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const topIslands = await AdminIslandsModel.getTopPerformingIslands(parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: topIslands
      });
    } catch (error) {
      console.error('Error in getTopPerformingIslands:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top performing islands',
        error: error.message
      });
    }
  }

  // Update island status
  static async updateIslandStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Approved', 'Pending', 'Rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: Approved, Pending, Rejected'
        });
      }

      const updated = await AdminIslandsModel.updateIslandStatus(parseInt(id), status);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Island not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Island status updated successfully'
      });
    } catch (error) {
      console.error('Error in updateIslandStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update island status',
        error: error.message
      });
    }
  }

  // Create new island
  static async createIsland(req, res) {
    try {
      const islandData = {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images || [],
        status: req.body.status || 'Pending',
        price: parseFloat(req.body.price) || 0,
        features: req.body.features || [],
        created_by: req.user.user_id // Assuming user ID is available in req.user
      };

      // Validate required fields
      if (!islandData.name || !islandData.description) {
        return res.status(400).json({
          success: false,
          message: 'Name and description are required'
        });
      }

      const islandId = await AdminIslandsModel.createIsland(islandData);
      
      res.status(201).json({
        success: true,
        message: 'Island created successfully',
        data: { islandId }
      });
    } catch (error) {
      console.error('Error in createIsland:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create island',
        error: error.message
      });
    }
  }

  // Update island
  static async updateIsland(req, res) {
    try {
      const { id } = req.params;
      const islandData = {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images || [],
        status: req.body.status,
        price: parseFloat(req.body.price) || 0,
        features: req.body.features || []
      };

      // Validate required fields
      if (!islandData.name || !islandData.description) {
        return res.status(400).json({
          success: false,
          message: 'Name and description are required'
        });
      }

      const updated = await AdminIslandsModel.updateIsland(parseInt(id), islandData);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Island not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Island updated successfully'
      });
    } catch (error) {
      console.error('Error in updateIsland:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update island',
        error: error.message
      });
    }
  }

  // Delete island
  static async deleteIsland(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await AdminIslandsModel.deleteIsland(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Island not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Island deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteIsland:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete island',
        error: error.message
      });
    }
  }

  // Get comprehensive dashboard data
  static async getDashboardData(req, res) {
    try {
      const [stats, topIslands] = await Promise.all([
        AdminIslandsModel.getIslandStats(),
        AdminIslandsModel.getTopPerformingIslands(5)
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats,
          topIslands
        }
      });
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message
      });
    }
  }
}

module.exports = AdminIslandsController;
