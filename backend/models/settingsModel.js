const db = require('../config/db');

// Get user by ID
const getUserById = async (userId) => {
  try {
    const [rows] = await db.execute(
      'SELECT user_id, full_name, email, phone, location, bio, profile_pic, email_notifications, push_notifications, newsletter_subscription FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.execute(
      'SELECT user_id, email FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Update user profile
const updateUserProfile = async (userId, profileData) => {
  try {
    const { fullName, email, phone, location, bio, profile_pic } = profileData;
    
    const updateFields = [];
    const updateValues = [];

    if (fullName !== undefined) {
      updateFields.push('full_name = ?');
      updateValues.push(fullName);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
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
      throw new Error('No fields to update');
    }

    updateValues.push(userId);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    await db.execute(query, updateValues);

    // Return updated user
    return await getUserById(userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user password
const updateUserPassword = async (userId, hashedPassword) => {
  try {
    await db.execute(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

// Update user preferences
const updateUserPreferences = async (userId, preferences) => {
  try {
    const { emailNotifications, pushNotifications, newsletterSubscription } = preferences;
    
    const updateFields = [];
    const updateValues = [];

    if (emailNotifications !== undefined) {
      updateFields.push('email_notifications = ?');
      updateValues.push(emailNotifications ? 1 : 0);
    }
    if (pushNotifications !== undefined) {
      updateFields.push('push_notifications = ?');
      updateValues.push(pushNotifications ? 1 : 0);
    }
    if (newsletterSubscription !== undefined) {
      updateFields.push('newsletter_subscription = ?');
      updateValues.push(newsletterSubscription ? 1 : 0);
    }

    if (updateFields.length === 0) {
      throw new Error('No preferences to update');
    }

    updateValues.push(userId);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    await db.execute(query, updateValues);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserProfile,
  updateUserPassword,
  updateUserPreferences
};
