const express = require('express');
const router = express.Router();
const islandController = require('../controllers/islandController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// BoatOwner suggest island with images
router.post('/suggest', auth, upload.array('images', 5), islandController.addIsland);

// BoatOwner edit own island
router.put('/edit/:island_id', auth, upload.array('images', 5), islandController.editIsland);

// Admin approve/reject
router.put('/approve/:island_id', auth, islandController.approveIsland);
router.put('/reject/:island_id', auth, islandController.rejectIsland);

// Get all islands
router.get('/', islandController.getAllIslands);

// Get islands by user
router.get('/user/:user_id', auth, islandController.getIslandsByUser);

module.exports = router;
