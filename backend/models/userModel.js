const db = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [users] = await db.query(
        `SELECT user_id, profile_pic, full_name, email, phone_number, location, bio, password_hash, user_type 
         FROM users WHERE email = ?`,
        [email]
      );
      
      return users[0] || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  // Create new user
  create: async (fullName, email, passwordHash, userType) => {
    try {
      const [result] = await db.query(
        `INSERT INTO users (full_name, email, password_hash, user_type) VALUES (?, ?, ?, ?)`,
        [fullName, email, passwordHash, userType]
      );
      
      return result.insertId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Get user profile by ID
  getUserProfile: async (userId) => {
    try {
      const [users] = await db.query(
        `SELECT user_id, profile_pic, full_name, email, phone_number, location, bio, user_type 
         FROM users WHERE user_id = ?`,
        [userId]
      );
      
      return users[0] || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const { full_name, email, phone_number, location, bio, profile_pic } = profileData;
      
      // Build dynamic update query to only update provided fields
      const updateFields = [];
      const updateValues = [];
      
      if (full_name !== undefined) {
        updateFields.push('full_name = ?');
        updateValues.push(full_name);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (phone_number !== undefined) {
        updateFields.push('phone_number = ?');
        updateValues.push(phone_number);
      }
      if (location !== undefined) {
        updateFields.push('location = ?');
        updateValues.push(location);
      }
      if (bio !== undefined) {
        updateFields.push('bio = ?');
        updateValues.push(bio);
      }
      if (profile_pic !== undefined) {
        updateFields.push('profile_pic = ?');
        updateValues.push(profile_pic);
      }
      
      if (updateFields.length === 0) {
        return true; // No fields to update
      }
      
      updateValues.push(userId);
      
      const [result] = await db.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
        updateValues
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Update user password
  updateUserPassword: async (userId, currentPassword, newPassword) => {
    try {
      // First, verify current password
      const [users] = await db.query(
        `SELECT password_hash FROM users WHERE user_id = ?`,
        [userId]
      );
      
      if (users.length === 0) {
        throw new Error("User not found");
      }
      
      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!isValidPassword) {
        throw new Error("Current password is incorrect");
      }
      
      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password
      const [result] = await db.query(
        `UPDATE users SET password_hash = ? WHERE user_id = ?`,
        [hashedPassword, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  // Check if email is already taken by another user
  isEmailTaken: async (email, excludeUserId = null) => {
    try {
      let query = `SELECT user_id FROM users WHERE email = ?`;
      let params = [email];
      
      if (excludeUserId) {
        query += ` AND user_id != ?`;
        params.push(excludeUserId);
      }
      
      const [users] = await db.query(query, params);
      return users.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  },

  // Get user's boats count
  getUserBoatsCount: async (userId) => {
    try {
      const [result] = await db.query(
        `SELECT COUNT(*) as boats_count FROM boats WHERE owner_id = ?`,
        [userId]
      );
      
      return result[0].boats_count;
    } catch (error) {
      console.error("Error fetching boats count:", error);
      throw error;
    }
  },

  // Get user's bookings count
  getUserBookingsCount: async (userId) => {
    try {
      const [result] = await db.query(
        `SELECT COUNT(*) as bookings_count FROM bookings WHERE user_id = ?`,
        [userId]
      );
      
      return result[0].bookings_count;
    } catch (error) {
      console.error("Error fetching bookings count:", error);
      throw error;
    }
  },

  // Get user's total earnings (for boat owners)
  getUserTotalEarnings: async (userId) => {
    try {
      const [result] = await db.query(
        `SELECT SUM(b.total_price) as total_earnings 
         FROM bookings b 
         JOIN boats bo ON b.boat_id = bo.boat_id 
         WHERE bo.owner_id = ? AND b.status = 'Completed'`,
        [userId]
      );
      
      return result[0].total_earnings || 0;
    } catch (error) {
      console.error("Error fetching total earnings:", error);
      throw error;
    }
  },

  // Get user's average rating (for boat owners)
  getUserAverageRating: async (userId) => {
    try {
    const [result] = await db.query(
        `SELECT AVG(r.rating) as avg_rating, COUNT(r.rating) as total_reviews
         FROM reviews r 
         JOIN boats bo ON r.boat_id = bo.boat_id 
         WHERE bo.owner_id = ?`,
        [userId]
      );
      
      return {
        avgRating: result[0].avg_rating || 0,
        totalReviews: result[0].total_reviews || 0
      };
    } catch (error) {
      console.error("Error fetching average rating:", error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async (userId) => {
    try {
      const [user] = await db.query(
        `SELECT user_type FROM users WHERE user_id = ?`,
        [userId]
      );
      
      if (user.length === 0) {
        throw new Error("User not found");
      }
      
      const userType = user[0].user_type;
      const stats = {
        userType: userType,
        boatsCount: 0,
        bookingsCount: 0,
        totalEarnings: 0,
        avgRating: 0,
        totalReviews: 0
      };
      
      if (userType === 'BoatOwner') {
        stats.boatsCount = await User.getUserBoatsCount(userId);
        stats.totalEarnings = await User.getUserTotalEarnings(userId);
        const ratingData = await User.getUserAverageRating(userId);
        stats.avgRating = ratingData.avgRating;
        stats.totalReviews = ratingData.totalReviews;
      }
      
      stats.bookingsCount = await User.getUserBookingsCount(userId);
      
      return stats;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  // Create password reset token
  createPasswordResetToken: async (email) => {
    try {
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate reset token
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Store reset token in database (we'll create a simple table for this)
      await db.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)`,
        [user.user_id, resetToken, expiresAt]
      );

      return { resetToken, user };
    } catch (error) {
      console.error("Error creating password reset token:", error);
      throw error;
    }
  },

  // Verify password reset token
  verifyPasswordResetToken: async (token) => {
    try {
      const [tokens] = await db.query(
        `SELECT prt.*, u.email, u.full_name 
         FROM password_reset_tokens prt 
         JOIN users u ON prt.user_id = u.user_id 
         WHERE prt.token = ? AND prt.expires_at > NOW()`,
        [token]
      );

      if (tokens.length === 0) {
        throw new Error("Invalid or expired token");
      }

      return tokens[0];
    } catch (error) {
      console.error("Error verifying password reset token:", error);
      throw error;
    }
  },

  // Reset password with token
  resetPasswordWithToken: async (token, newPassword) => {
    try {
      // Verify token
      const tokenData = await User.verifyPasswordResetToken(token);
      
      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password
      const [result] = await db.query(
        `UPDATE users SET password_hash = ? WHERE user_id = ?`,
        [hashedPassword, tokenData.user_id]
      );
      
      // Delete used token
      await db.query(
        `DELETE FROM password_reset_tokens WHERE token = ?`,
        [token]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }
};

module.exports = User;
