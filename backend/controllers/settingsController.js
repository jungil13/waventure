const settingsModel = require('../models/settingsModel');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await settingsModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, phone, location, bio } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await settingsModel.getUserByEmail(email);
      if (existingUser && existingUser.user_id !== parseInt(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    const updatedUser = await settingsModel.updateUserProfile(userId, {
      fullName,
      email,
      phone,
      location,
      bio
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get current user to delete old profile picture
    const currentUser = await settingsModel.getUserById(userId);
    if (currentUser && currentUser.profile_pic) {
      const oldImagePath = path.join(__dirname, '../uploads/profiles', currentUser.profile_pic);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user profile picture path
    const profilePicPath = `/uploads/profiles/${req.file.filename}`;
    await settingsModel.updateUserProfile(userId, { profile_pic: profilePicPath });

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profile_pic: profilePicPath
      }
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = await settingsModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await settingsModel.updateUserPassword(userId, hashedNewPassword);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update preferences
const updatePreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { emailNotifications, pushNotifications, newsletterSubscription } = req.body;

    await settingsModel.updateUserPreferences(userId, {
      emailNotifications,
      pushNotifications,
      newsletterSubscription
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  changePassword,
  updatePreferences
};
