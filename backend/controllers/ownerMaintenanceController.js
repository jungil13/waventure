const OwnerMaintenanceModel = require('../models/ownerMaintenanceModel');

class OwnerMaintenanceController {
  // Get maintenance records for owner's boats
  static async getOwnerMaintenance(req, res) {
    try {
      const ownerId = req.user.user_id;
      const { 
        status = 'all', 
        maintenance_type = 'all', 
        page = 1, 
        limit = 20 
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const filters = { status, maintenance_type, limit: parseInt(limit), offset };

      const [maintenance, totalCount] = await Promise.all([
        OwnerMaintenanceModel.getOwnerMaintenance(ownerId, filters),
        OwnerMaintenanceModel.getOwnerMaintenanceCount(ownerId, filters)
      ]);

      res.json({
        success: true,
        data: {
          maintenance,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(totalCount / parseInt(limit)),
            total_records: totalCount,
            limit: parseInt(limit)
          }
        },
        message: 'Owner maintenance records retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance records',
        error: error.message
      });
    }
  }

  // Get owner's boats with maintenance status
  static async getOwnerBoatsWithMaintenance(req, res) {
    try {
      const ownerId = req.user.user_id;
      const boats = await OwnerMaintenanceModel.getOwnerBoatsWithMaintenance(ownerId);

      res.json({
        success: true,
        data: boats,
        message: 'Owner boats with maintenance status retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerBoatsWithMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boats with maintenance status',
        error: error.message
      });
    }
  }

  // Get upcoming maintenance for owner
  static async getOwnerUpcomingMaintenance(req, res) {
    try {
      const ownerId = req.user.user_id;
      const maintenance = await OwnerMaintenanceModel.getOwnerUpcomingMaintenance(ownerId);

      res.json({
        success: true,
        data: maintenance,
        message: 'Upcoming maintenance retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerUpcomingMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve upcoming maintenance',
        error: error.message
      });
    }
  }

  // Get maintenance statistics for owner
  static async getOwnerMaintenanceStats(req, res) {
    try {
      const ownerId = req.user.user_id;
      const stats = await OwnerMaintenanceModel.getOwnerMaintenanceStats(ownerId);

      res.json({
        success: true,
        data: stats,
        message: 'Maintenance statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerMaintenanceStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance statistics',
        error: error.message
      });
    }
  }

  // Get maintenance by ID for owner
  static async getOwnerMaintenanceById(req, res) {
    try {
      const ownerId = req.user.user_id;
      const { maintenanceId } = req.params;

      if (!maintenanceId || isNaN(maintenanceId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid maintenance ID is required'
        });
      }

      const maintenance = await OwnerMaintenanceModel.getOwnerMaintenanceById(
        ownerId, 
        parseInt(maintenanceId)
      );

      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found or access denied'
        });
      }

      res.json({
        success: true,
        data: maintenance,
        message: 'Maintenance record retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerMaintenanceById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance record',
        error: error.message
      });
    }
  }

  // Get maintenance history for a specific boat
  static async getOwnerBoatMaintenanceHistory(req, res) {
    try {
      const ownerId = req.user.user_id;
      const { boatId } = req.params;

      if (!boatId || isNaN(boatId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid boat ID is required'
        });
      }

      const maintenance = await OwnerMaintenanceModel.getOwnerBoatMaintenanceHistory(
        ownerId, 
        parseInt(boatId)
      );

      res.json({
        success: true,
        data: maintenance,
        message: 'Boat maintenance history retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerBoatMaintenanceHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boat maintenance history',
        error: error.message
      });
    }
  }

  // Get maintenance calendar for owner
  static async getOwnerMaintenanceCalendar(req, res) {
    try {
      const ownerId = req.user.user_id;
      const maintenance = await OwnerMaintenanceModel.getOwnerMaintenanceCalendar(ownerId);

      res.json({
        success: true,
        data: maintenance,
        message: 'Maintenance calendar retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOwnerMaintenanceCalendar:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance calendar',
        error: error.message
      });
    }
  }

  // Update maintenance status for owner
  static async updateMaintenanceStatus(req, res) {
    try {
      const ownerId = req.user.user_id;
      const { maintenanceId } = req.params;
      const { status, actual_duration, notes } = req.body;

      if (!maintenanceId || isNaN(maintenanceId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid maintenance ID is required'
        });
      }

      const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required (Scheduled, In Progress, Completed, Cancelled)'
        });
      }

      // Verify ownership first
      const maintenance = await OwnerMaintenanceModel.getOwnerMaintenanceById(ownerId, parseInt(maintenanceId));
      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found or access denied'
        });
      }

      // Update the maintenance status
      const MaintenanceModel = require('../models/maintenanceModel');
      const additionalData = {};
      if (actual_duration !== undefined) {
        additionalData.actual_duration = parseInt(actual_duration);
      }
      if (notes !== undefined) {
        additionalData.notes = notes;
      }

      const updated = await MaintenanceModel.updateMaintenanceStatus(
        parseInt(maintenanceId), 
        status, 
        additionalData
      );

      if (!updated) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update maintenance status'
        });
      }

      // If maintenance is completed, update boat status to Available
      if (status === 'Completed') {
        try {
          await MaintenanceModel.updateBoatStatusForMaintenance(maintenance.boat_id, 'Available');
          console.log(`Boat ${maintenance.boat_id} status updated to Available after maintenance completion`);
        } catch (boatStatusError) {
          console.error('Error updating boat status after maintenance completion:', boatStatusError);
          // Don't fail the entire request if boat status update fails
        }
      }

      // Get the updated maintenance record
      const updatedMaintenance = await OwnerMaintenanceModel.getOwnerMaintenanceById(ownerId, parseInt(maintenanceId));

      res.json({
        success: true,
        data: updatedMaintenance,
        message: 'Maintenance status updated successfully'
      });
    } catch (error) {
      console.error('Error in updateMaintenanceStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update maintenance status',
        error: error.message
      });
    }
  }
}

module.exports = OwnerMaintenanceController;
