const express = require('express');
const multer = require('multer');
const path = require('path');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get user profile
router.get('/profile/:userId', settingsController.getUserProfile);

// Update user profile
router.put('/profile/:userId', settingsController.updateUserProfile);

// Upload profile picture
router.post('/profile-picture/:userId', upload.single('profilePicture'), settingsController.uploadProfilePicture);

// Change password
router.put('/password/:userId', settingsController.changePassword);

// Update preferences
router.put('/preferences/:userId', settingsController.updatePreferences);

module.exports = router;
