const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/upload");

// Get user profile
router.get("/:userId/profile", userController.getUserProfile);

// Update user profile
router.put("/:userId/profile", userController.updateUserProfile);

// Update user password
router.put("/:userId/password", userController.updateUserPassword);

// Upload profile picture
router.post("/:userId/profile-picture", upload.single("profile_pic"), userController.uploadProfilePicture);

// Get user statistics
router.get("/:userId/stats", userController.getUserStats);

module.exports = router;
