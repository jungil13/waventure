const express = require('express');
const router = express.Router();
const OwnerMaintenanceController = require('../controllers/ownerMaintenanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get maintenance records for owner's boats
router.get('/', OwnerMaintenanceController.getOwnerMaintenance);

// Get owner's boats with maintenance status
router.get('/boats', OwnerMaintenanceController.getOwnerBoatsWithMaintenance);

// Get upcoming maintenance for owner
router.get('/upcoming', OwnerMaintenanceController.getOwnerUpcomingMaintenance);

// Get maintenance statistics for owner
router.get('/stats', OwnerMaintenanceController.getOwnerMaintenanceStats);

// Get maintenance calendar for owner
router.get('/calendar', OwnerMaintenanceController.getOwnerMaintenanceCalendar);

// Get maintenance by ID for owner
router.get('/:maintenanceId', OwnerMaintenanceController.getOwnerMaintenanceById);

// Get maintenance history for a specific boat
router.get('/boat/:boatId/history', OwnerMaintenanceController.getOwnerBoatMaintenanceHistory);

// Update maintenance status
router.put('/:maintenanceId/status', OwnerMaintenanceController.updateMaintenanceStatus);

module.exports = router;
