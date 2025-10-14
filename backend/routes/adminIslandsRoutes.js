const express = require('express');
const router = express.Router();
const AdminIslandsController = require('../controllers/adminIslandsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all islands with pagination and filters
router.get('/', AdminIslandsController.getAllIslands);

// Get island by ID with full details
router.get('/:id', AdminIslandsController.getIslandById);

// Get island statistics
router.get('/stats/overview', AdminIslandsController.getIslandStats);

// Get top performing islands
router.get('/stats/top-performing', AdminIslandsController.getTopPerformingIslands);

// Get comprehensive dashboard data
router.get('/dashboard/data', AdminIslandsController.getDashboardData);

// Update island status
router.patch('/:id/status', AdminIslandsController.updateIslandStatus);

// Create new island
router.post('/', AdminIslandsController.createIsland);

// Update island
router.put('/:id', AdminIslandsController.updateIsland);

// Delete island
router.delete('/:id', AdminIslandsController.deleteIsland);

module.exports = router;
