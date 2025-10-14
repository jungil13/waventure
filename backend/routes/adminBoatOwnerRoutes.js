const express = require('express');
const router = express.Router();
const AdminBoatOwnerController = require('../controllers/adminBoatOwnerController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all boat owners with pagination and filters
router.get('/', AdminBoatOwnerController.getAllBoatOwners);

// Get boat owner statistics
router.get('/stats', AdminBoatOwnerController.getBoatOwnerStats);

// Get top performing boat owners
router.get('/top-performing', AdminBoatOwnerController.getTopPerformingOwners);

// Get boat owners by location
router.get('/by-location', AdminBoatOwnerController.getBoatOwnersByLocation);

// Get boat owner by ID with full details
router.get('/:ownerId', AdminBoatOwnerController.getBoatOwnerById);

module.exports = router;
