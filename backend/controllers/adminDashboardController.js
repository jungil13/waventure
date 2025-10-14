const AdminDashboardModel = require('../models/adminDashboardModel');
const User = require('../models/userModel');

class AdminDashboardController {
  // Get admin profile
  static async getAdminProfile(req, res) {
    try {
      const userId = req.user.user_id;
      const profile = await User.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Admin profile not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          ...profile,
          profile_pic: profile.profile_pic ? `http://localhost:5000${profile.profile_pic}` : null
        }
      });
    } catch (error) {
      console.error('Error getting admin profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get dashboard overview data
  static async getDashboardOverview(req, res) {
    try {
      // Fetch all dashboard metrics in parallel
      const [
        totalBookings,
        lastMonthBookings,
        activeBoats,
        lastWeekBoats,
        totalRevenue,
        lastMonthRevenue,
        averageSatisfaction,
        satisfactionImprovement
      ] = await Promise.all([
        AdminDashboardModel.getTotalBookings(),
        AdminDashboardModel.getBookingsFromLastMonth(),
        AdminDashboardModel.getActiveBoats(),
        AdminDashboardModel.getBoatsFromLastWeek(),
        AdminDashboardModel.getTotalRevenue(),
        AdminDashboardModel.getRevenueFromLastMonth(),
        AdminDashboardModel.getAverageCustomerSatisfaction(),
        AdminDashboardModel.getSatisfactionImprovement()
      ]);

      // Calculate percentage changes
      const bookingChange = lastMonthBookings > 0 
        ? Math.round(((totalBookings - lastMonthBookings) / lastMonthBookings) * 100)
        : 0;
      
      const revenueChange = lastMonthRevenue > 0 
        ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0;

      const boatsChange = lastWeekBoats > 0 
        ? Math.round(((activeBoats - lastWeekBoats) / lastWeekBoats) * 100)
        : 0;

      res.json({
        success: true,
        data: {
          totalBookings,
          bookingChange: `${bookingChange > 0 ? '+' : ''}${bookingChange}% From Last Month`,
          activeBoats,
          activeBoatsChange: `${boatsChange > 0 ? '+' : ''}${boatsChange}% From Last Week`,
          revenue: totalRevenue,
          revenueChange: `${revenueChange > 0 ? '+' : ''}${revenueChange}% From Last Month`,
          customerSatisfaction: averageSatisfaction ? parseFloat(Number(averageSatisfaction).toFixed(1)) : 0,
          customerSatisfactionChange: `${satisfactionImprovement > 0 ? '+' : ''}${satisfactionImprovement ? Number(satisfactionImprovement).toFixed(1) : '0.0'} Improvement`
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get system activities
  static async getSystemActivities(req, res) {
    try {
      const { limit = 10 } = req.query;
      const activities = await AdminDashboardModel.getSystemActivities(parseInt(limit));

      res.json({
        success: true,
        data: activities
      });

    } catch (error) {
      console.error('Error fetching system activities:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get booking statistics for charts
  static async getBookingStats(req, res) {
    try {
      const stats = await AdminDashboardModel.getBookingStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching booking stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user statistics for charts
  static async getUserStats(req, res) {
    try {
      const stats = await AdminDashboardModel.getUserStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get boat status statistics for charts
  static async getBoatStatusStats(req, res) {
    try {
      const stats = await AdminDashboardModel.getBoatStatusStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching boat status stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get payment statistics for charts
  static async getPaymentStats(req, res) {
    try {
      const stats = await AdminDashboardModel.getPaymentStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all dashboard data (overview + charts data)
  static async getAllDashboardData(req, res) {
    try {
      const [
        overviewData,
        activities,
        bookingStats,
        userStats,
        boatStatusStats,
        paymentStats
      ] = await Promise.all([
        AdminDashboardController.getDashboardOverviewData(),
        AdminDashboardModel.getSystemActivities(10),
        AdminDashboardModel.getBookingStats(),
        AdminDashboardModel.getUserStats(),
        AdminDashboardModel.getBoatStatusStats(),
        AdminDashboardModel.getPaymentStats()
      ]);

      res.json({
        success: true,
        data: {
          overview: overviewData,
          activities,
          charts: {
            bookingStats,
            userStats,
            boatStatusStats,
            paymentStats
          }
        }
      });

    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Helper method to get overview data without sending response
  static async getDashboardOverviewData() {
    const [
      totalBookings,
      lastMonthBookings,
      activeBoats,
      lastWeekBoats,
      totalRevenue,
      lastMonthRevenue,
      averageSatisfaction,
      satisfactionImprovement
    ] = await Promise.all([
      AdminDashboardModel.getTotalBookings(),
      AdminDashboardModel.getBookingsFromLastMonth(),
      AdminDashboardModel.getActiveBoats(),
      AdminDashboardModel.getBoatsFromLastWeek(),
      AdminDashboardModel.getTotalRevenue(),
      AdminDashboardModel.getRevenueFromLastMonth(),
      AdminDashboardModel.getAverageCustomerSatisfaction(),
      AdminDashboardModel.getSatisfactionImprovement()
    ]);

    const bookingChange = lastMonthBookings > 0 
      ? Math.round(((totalBookings - lastMonthBookings) / lastMonthBookings) * 100)
      : 0;
    
    const revenueChange = lastMonthRevenue > 0 
      ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    const boatsChange = lastWeekBoats > 0 
      ? Math.round(((activeBoats - lastWeekBoats) / lastWeekBoats) * 100)
      : 0;

    return {
      totalBookings,
      bookingChange: `${bookingChange > 0 ? '+' : ''}${bookingChange}% From Last Month`,
      activeBoats,
      activeBoatsChange: `${boatsChange > 0 ? '+' : ''}${boatsChange}% From Last Week`,
      revenue: totalRevenue,
      revenueChange: `${revenueChange > 0 ? '+' : ''}${revenueChange}% From Last Month`,
      customerSatisfaction: averageSatisfaction ? parseFloat(Number(averageSatisfaction).toFixed(1)) : 0,
      customerSatisfactionChange: `${satisfactionImprovement > 0 ? '+' : ''}${satisfactionImprovement ? Number(satisfactionImprovement).toFixed(1) : '0.0'} Improvement`
    };
  }
}

module.exports = AdminDashboardController;
