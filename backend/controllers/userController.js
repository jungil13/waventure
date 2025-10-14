const User = require("../models/userModel");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await User.getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Get user statistics
    const stats = await User.getUserStats(userId);
    
    res.json({
      success: true,
      profile: {
        ...profile,
        profile_pic: profile.profile_pic ? `http://localhost:5000${profile.profile_pic}` : null
      },
      stats: stats
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { full_name, email, phone_number, location, bio, profile_pic } = req.body;
    
    // Check if email is already taken by another user
    const isEmailTaken = await User.isEmailTaken(email, userId);
    if (isEmailTaken) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken by another user"
      });
    }
    
    // Update profile
    const success = await User.updateUserProfile(userId, {
      full_name,
      email,
      phone_number,
      location,
      bio,
      profile_pic
    });
    
    if (success) {
      res.json({
        success: true,
        message: "Profile updated successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update profile"
      });
    }
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// Update user password
exports.updateUserPassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }
    
    // Update password
    const success = await User.updateUserPassword(userId, currentPassword, newPassword);
    
    if (success) {
      res.json({
        success: true,
        message: "Password updated successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update password"
      });
    }
  } catch (error) {
    console.error("Update password error:", error);
    
    if (error.message === "Current password is incorrect") {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message
    });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }
    
    const profilePicPath = `/uploads/profiles/${req.file.filename}`;
    
    // Update only the profile_pic field
    const success = await User.updateUserProfile(userId, {
      profile_pic: profilePicPath
    });
    
    if (success) {
      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        profile_pic: `http://localhost:5000${profilePicPath}`
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update profile picture"
      });
    }
  } catch (error) {
    console.error("Upload profile picture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
      error: error.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await User.getUserStats(userId);
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message
    });
  }
};
