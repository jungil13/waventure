const express = require('express');
const router = express.Router();
const AdminBoatController = require('../controllers/adminBoatController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all boats for admin
router.get('/', AdminBoatController.getAllBoats);

// Get boat statistics
router.get('/stats', AdminBoatController.getBoatStats);

// Get boat by ID with full details
router.get('/:boatId', AdminBoatController.getBoatById);

module.exports = router;
