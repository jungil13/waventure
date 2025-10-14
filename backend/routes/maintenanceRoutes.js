const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all maintenance records
router.get('/', MaintenanceController.getAllMaintenance);

// Get maintenance statistics
router.get('/stats', MaintenanceController.getMaintenanceStats);

// Get fleet overview (boats with maintenance info)
router.get('/fleet-overview', MaintenanceController.getFleetOverview);

// Get upcoming maintenance
router.get('/upcoming', MaintenanceController.getUpcomingMaintenance);

// Get maintenance records for a specific boat
router.get('/boat/:boatId', MaintenanceController.getMaintenanceByBoatId);

// Get maintenance by ID
router.get('/:maintenanceId', MaintenanceController.getMaintenanceById);

// Schedule new maintenance
router.post('/', MaintenanceController.scheduleMaintenance);

// Update maintenance status
router.put('/:maintenanceId/status', MaintenanceController.updateMaintenanceStatus);

// Delete maintenance record
router.delete('/:maintenanceId', MaintenanceController.deleteMaintenance);

module.exports = router;
