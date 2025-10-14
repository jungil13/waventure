const MaintenanceModel = require('../models/maintenanceModel');
const BoatModel = require('../models/boatModel');

class MaintenanceController {
  // Get all maintenance records
  static async getAllMaintenance(req, res) {
    try {
      const maintenance = await MaintenanceModel.getAllMaintenance();
      
      res.json({
        success: true,
        data: maintenance,
        message: 'Maintenance records retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance records',
        error: error.message
      });
    }
  }

  // Get maintenance records for a specific boat
  static async getMaintenanceByBoatId(req, res) {
    try {
      const { boatId } = req.params;
      
      if (!boatId || isNaN(boatId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid boat ID is required'
        });
      }

      const maintenance = await MaintenanceModel.getMaintenanceByBoatId(parseInt(boatId));
      
      res.json({
        success: true,
        data: maintenance,
        message: 'Boat maintenance records retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getMaintenanceByBoatId:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve boat maintenance records',
        error: error.message
      });
    }
  }

  // Get upcoming maintenance
  static async getUpcomingMaintenance(req, res) {
    try {
      const maintenance = await MaintenanceModel.getUpcomingMaintenance();
      
      res.json({
        success: true,
        data: maintenance,
        message: 'Upcoming maintenance retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getUpcomingMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve upcoming maintenance',
        error: error.message
      });
    }
  }

  // Schedule new maintenance
  static async scheduleMaintenance(req, res) {
    try {
      const {
        boat_id,
        scheduled_date,
        scheduled_time,
        maintenance_type = 'Routine',
        description,
        assigned_technician,
        estimated_duration,
        cost,
        notes
      } = req.body;

      // Validate required fields
      if (!boat_id || !scheduled_date || !scheduled_time) {
        return res.status(400).json({
          success: false,
          message: 'Boat ID, scheduled date, and scheduled time are required'
        });
      }

      // Validate date format
      const scheduledDateTime = new Date(`${scheduled_date} ${scheduled_time}`);
      if (isNaN(scheduledDateTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date or time format'
        });
      }

      // Check if date is in the past
      if (scheduledDateTime < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot schedule maintenance in the past'
        });
      }

      // Get admin user ID from token
      const created_by = req.user.user_id;

      const maintenanceData = {
        boat_id: parseInt(boat_id),
        scheduled_date,
        scheduled_time,
        maintenance_type,
        description,
        assigned_technician,
        estimated_duration: estimated_duration ? parseInt(estimated_duration) : null,
        cost: cost ? parseFloat(cost) : null,
        notes,
        created_by
      };

      const maintenanceId = await MaintenanceModel.scheduleMaintenance(maintenanceData);
      
      // Get the created maintenance record
      const maintenance = await MaintenanceModel.getMaintenanceById(maintenanceId);

      res.status(201).json({
        success: true,
        data: maintenance,
        message: 'Maintenance scheduled successfully'
      });
    } catch (error) {
      console.error('Error in scheduleMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule maintenance',
        error: error.message
      });
    }
  }

  // Update maintenance status
  static async updateMaintenanceStatus(req, res) {
    try {
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
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      // Get the updated maintenance record
      const maintenance = await MaintenanceModel.getMaintenanceById(parseInt(maintenanceId));

      res.json({
        success: true,
        data: maintenance,
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

  // Get maintenance by ID
  static async getMaintenanceById(req, res) {
    try {
      const { maintenanceId } = req.params;

      if (!maintenanceId || isNaN(maintenanceId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid maintenance ID is required'
        });
      }

      const maintenance = await MaintenanceModel.getMaintenanceById(parseInt(maintenanceId));

      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      res.json({
        success: true,
        data: maintenance,
        message: 'Maintenance record retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getMaintenanceById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance record',
        error: error.message
      });
    }
  }

  // Delete maintenance record
  static async deleteMaintenance(req, res) {
    try {
      const { maintenanceId } = req.params;

      if (!maintenanceId || isNaN(maintenanceId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid maintenance ID is required'
        });
      }

      // Check if maintenance exists
      const maintenance = await MaintenanceModel.getMaintenanceById(parseInt(maintenanceId));
      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      const deleted = await MaintenanceModel.deleteMaintenance(parseInt(maintenanceId));

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete maintenance record'
        });
      }

      // If maintenance was scheduled or in progress, update boat status to Available
      if (maintenance.status === 'Scheduled' || maintenance.status === 'In Progress') {
        await MaintenanceModel.updateBoatStatusForMaintenance(maintenance.boat_id, 'Available');
      }

      res.json({
        success: true,
        message: 'Maintenance record deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteMaintenance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete maintenance record',
        error: error.message
      });
    }
  }

  // Get maintenance statistics
  static async getMaintenanceStats(req, res) {
    try {
      const stats = await MaintenanceModel.getMaintenanceStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Maintenance statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getMaintenanceStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance statistics',
        error: error.message
      });
    }
  }

  // Get fleet overview (boats with maintenance info)
  static async getFleetOverview(req, res) {
    try {
      // Get all boats with their maintenance status
      const boats = await BoatModel.getAllBoats();
      
      const fleetOverview = await Promise.all(
        boats.map(async (boat) => {
          const hasScheduledMaintenance = await MaintenanceModel.hasScheduledMaintenance(boat.boat_id);
          const recentMaintenance = await MaintenanceModel.getMaintenanceByBoatId(boat.boat_id);
          
          return {
            ...boat,
            has_scheduled_maintenance: hasScheduledMaintenance,
            last_maintenance: recentMaintenance[0] || null,
            maintenance_count: recentMaintenance.length
          };
        })
      );

      res.json({
        success: true,
        data: fleetOverview,
        message: 'Fleet overview retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getFleetOverview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve fleet overview',
        error: error.message
      });
    }
  }
}

module.exports = MaintenanceController;
