const Dashboard = require('../models/dashboardModel');

// Get dashboard statistics for a user
const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const stats = await Dashboard.getUserStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get recent bookings for a user
const getUserRecentBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = req.query.limit || 5;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const bookings = await Dashboard.getUserRecentBookings(userId, limit);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent bookings',
      error: error.message
    });
  }
};

// Get featured boats
const getFeaturedBoats = async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    
    const boats = await Dashboard.getFeaturedBoats(limit);
    
    res.json({
      success: true,
      data: boats
    });
  } catch (error) {
    console.error('Error fetching featured boats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured boats',
      error: error.message
    });
  }
};

module.exports = {
  getUserDashboardStats,
  getUserRecentBookings,
  getFeaturedBoats
};
