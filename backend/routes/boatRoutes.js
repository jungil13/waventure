const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer config

// Owner can create boats (token required)
router.post('/', authMiddleware, upload.array('images', 10), boatController.createBoat);

// Owner can update his boats only
router.put('/:id', authMiddleware, upload.array('images', 10), boatController.updateBoat);

// Get all boats (public)
router.get('/', boatController.getAllBoats);

// Get available boats for booking
router.get('/available', boatController.getAvailableBoats);

router.get("/my", authMiddleware, boatController.getMyBoats); // ✅ Boat owner's boats

// Get one boat (public)
router.get('/:id', boatController.getBoatById);

// Delete boat (owner only)
router.delete('/:id', authMiddleware, boatController.deleteBoat);

module.exports = router;
