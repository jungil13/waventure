const AdminReportsModel = require('../models/adminReportsModel');

class AdminReportsController {
  // Get overall statistics
  static async getOverallStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await AdminReportsModel.getOverallStats(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: {
          totalRevenue: parseFloat(stats.total_revenue) || 0,
          totalBookings: parseInt(stats.total_bookings) || 0,
          activeBoats: parseInt(stats.active_boats) || 0,
          customerSatisfaction: parseFloat(stats.average_rating) || 0,
          totalCustomers: parseInt(stats.total_customers) || 0,
          completedBookings: parseInt(stats.completed_bookings) || 0,
          pendingBookings: parseInt(stats.pending_bookings) || 0,
          cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
          totalReviews: parseInt(stats.total_reviews) || 0
        }
      });
    } catch (error) {
      console.error('Error in getOverallStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overall statistics',
        error: error.message
      });
    }
  }

  // Get revenue data for charts
  static async getRevenueData(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const revenueData = await AdminReportsModel.getRevenueData(startDate, endDate);
      
      // Format data for frontend charts
      const formattedData = revenueData.map(item => ({
        month: item.month_name,
        revenue: parseFloat(item.revenue) || 0,
        bookings: parseInt(item.bookings_count) || 0
      }));
      
      res.status(200).json({
        success: true,
        data: formattedData
      });
    } catch (error) {
      console.error('Error in getRevenueData:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue data',
        error: error.message
      });
    }
  }

  // Get booking trends
  static async getBookingTrends(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const trendsData = await AdminReportsModel.getBookingTrends(startDate, endDate);
      
      // Format data for frontend charts
      const formattedData = trendsData.map(item => ({
        day: item.day_name.substring(0, 3), // Short day name (Mon, Tue, etc.)
        bookings: parseInt(item.bookings_count) || 0,
        revenue: parseFloat(item.revenue) || 0
      }));
      
      res.status(200).json({
        success: true,
        data: formattedData
      });
    } catch (error) {
      console.error('Error in getBookingTrends:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking trends',
        error: error.message
      });
    }
  }

  // Get top performing boats
  static async getTopBoats(req, res) {
    try {
      const { startDate, endDate, limit = 10 } = req.query;
      
      const topBoats = await AdminReportsModel.getTopBoats(parseInt(limit), startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: topBoats.map(boat => ({
          boatId: boat.boat_id,
          boatName: boat.boat_name,
          boatType: boat.boat_type,
          rentalPrice: parseFloat(boat.rental_price) || 0,
          ownerName: boat.owner_name,
          totalBookings: parseInt(boat.total_bookings) || 0,
          completedBookings: parseInt(boat.completed_bookings) || 0,
          totalRevenue: parseFloat(boat.total_revenue) || 0,
          averageRating: parseFloat(boat.average_rating) || 0,
          totalReviews: parseInt(boat.total_reviews) || 0
        }))
      });
    } catch (error) {
      console.error('Error in getTopBoats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top boats',
        error: error.message
      });
    }
  }

  // Get customer analytics
  static async getCustomerAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const analytics = await AdminReportsModel.getCustomerAnalytics(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: {
          totalCustomers: parseInt(analytics.total_customers) || 0,
          customersWithBookings: parseInt(analytics.customers_with_bookings) || 0,
          customersWithCompletedBookings: parseInt(analytics.customers_with_completed_bookings) || 0,
          averageCustomerSpending: parseFloat(analytics.average_customer_spending) || 0,
          highestCustomerSpending: parseFloat(analytics.highest_customer_spending) || 0
        }
      });
    } catch (error) {
      console.error('Error in getCustomerAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer analytics',
        error: error.message
      });
    }
  }

  // Get location statistics
  static async getLocationStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const locationStats = await AdminReportsModel.getLocationStats(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: locationStats.map(location => ({
          location: location.location,
          bookingsCount: parseInt(location.bookings_count) || 0,
          uniqueCustomers: parseInt(location.unique_customers) || 0,
          revenue: parseFloat(location.revenue) || 0
        }))
      });
    } catch (error) {
      console.error('Error in getLocationStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch location statistics',
        error: error.message
      });
    }
  }

  // Get payment method statistics
  static async getPaymentMethodStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const paymentStats = await AdminReportsModel.getPaymentMethodStats(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: paymentStats.map(payment => ({
          paymentMethod: payment.payment_method,
          bookingsCount: parseInt(payment.bookings_count) || 0,
          revenue: parseFloat(payment.revenue) || 0,
          paidBookings: parseInt(payment.paid_bookings) || 0,
          unpaidBookings: parseInt(payment.unpaid_bookings) || 0
        }))
      });
    } catch (error) {
      console.error('Error in getPaymentMethodStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment method statistics',
        error: error.message
      });
    }
  }

  // Get growth metrics
  static async getGrowthMetrics(req, res) {
    try {
      const growthMetrics = await AdminReportsModel.getGrowthMetrics();
      
      res.status(200).json({
        success: true,
        data: growthMetrics.map(metric => ({
          month: metric.month,
          bookings: parseInt(metric.bookings) || 0,
          revenue: parseFloat(metric.revenue) || 0,
          newCustomers: parseInt(metric.new_customers) || 0
        }))
      });
    } catch (error) {
      console.error('Error in getGrowthMetrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch growth metrics',
        error: error.message
      });
    }
  }

  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const recentActivity = await AdminReportsModel.getRecentActivity(parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: recentActivity.map(activity => ({
          activityType: activity.activity_type,
          id: activity.id,
          status: activity.status,
          amount: parseFloat(activity.amount) || 0,
          createdAt: activity.created_at,
          customerName: activity.customer_name,
          boatName: activity.boat_name,
          ownerName: activity.owner_name
        }))
      });
    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent activity',
        error: error.message
      });
    }
  }

  // Get comprehensive dashboard data
  static async getDashboardData(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      // Fetch all dashboard data in parallel
      const [
        overallStats,
        revenueData,
        bookingTrends,
        topBoats,
        customerAnalytics,
        locationStats,
        paymentMethodStats,
        recentActivity
      ] = await Promise.all([
        AdminReportsModel.getOverallStats(startDate, endDate),
        AdminReportsModel.getRevenueData(startDate, endDate),
        AdminReportsModel.getBookingTrends(startDate, endDate),
        AdminReportsModel.getTopBoats(5, startDate, endDate),
        AdminReportsModel.getCustomerAnalytics(startDate, endDate),
        AdminReportsModel.getLocationStats(startDate, endDate),
        AdminReportsModel.getPaymentMethodStats(startDate, endDate),
        AdminReportsModel.getRecentActivity(10)
      ]);

      res.status(200).json({
        success: true,
        data: {
          overallStats: {
            totalRevenue: parseFloat(overallStats.total_revenue) || 0,
            totalBookings: parseInt(overallStats.total_bookings) || 0,
            activeBoats: parseInt(overallStats.active_boats) || 0,
            customerSatisfaction: parseFloat(overallStats.average_rating) || 0,
            totalCustomers: parseInt(overallStats.total_customers) || 0,
            completedBookings: parseInt(overallStats.completed_bookings) || 0,
            pendingBookings: parseInt(overallStats.pending_bookings) || 0,
            cancelledBookings: parseInt(overallStats.cancelled_bookings) || 0,
            totalReviews: parseInt(overallStats.total_reviews) || 0
          },
          revenueData: revenueData.map(item => ({
            month: item.month_name,
            revenue: parseFloat(item.revenue) || 0,
            bookings: parseInt(item.bookings_count) || 0
          })),
          bookingTrends: bookingTrends.map(item => ({
            day: item.day_name.substring(0, 3),
            bookings: parseInt(item.bookings_count) || 0,
            revenue: parseFloat(item.revenue) || 0
          })),
          topBoats: topBoats.map(boat => ({
            boatId: boat.boat_id,
            boatName: boat.boat_name,
            boatType: boat.boat_type,
            rentalPrice: parseFloat(boat.rental_price) || 0,
            ownerName: boat.owner_name,
            totalBookings: parseInt(boat.total_bookings) || 0,
            completedBookings: parseInt(boat.completed_bookings) || 0,
            totalRevenue: parseFloat(boat.total_revenue) || 0,
            averageRating: parseFloat(boat.average_rating) || 0,
            totalReviews: parseInt(boat.total_reviews) || 0
          })),
          customerAnalytics: {
            totalCustomers: parseInt(customerAnalytics.total_customers) || 0,
            customersWithBookings: parseInt(customerAnalytics.customers_with_bookings) || 0,
            customersWithCompletedBookings: parseInt(customerAnalytics.customers_with_completed_bookings) || 0,
            averageCustomerSpending: parseFloat(customerAnalytics.average_customer_spending) || 0,
            highestCustomerSpending: parseFloat(customerAnalytics.highest_customer_spending) || 0
          },
          locationStats: locationStats.map(location => ({
            location: location.location,
            bookingsCount: parseInt(location.bookings_count) || 0,
            uniqueCustomers: parseInt(location.unique_customers) || 0,
            revenue: parseFloat(location.revenue) || 0
          })),
          paymentMethodStats: paymentMethodStats.map(payment => ({
            paymentMethod: payment.payment_method,
            bookingsCount: parseInt(payment.bookings_count) || 0,
            revenue: parseFloat(payment.revenue) || 0,
            paidBookings: parseInt(payment.paid_bookings) || 0,
            unpaidBookings: parseInt(payment.unpaid_bookings) || 0
          })),
          recentActivity: recentActivity.map(activity => ({
            activityType: activity.activity_type,
            id: activity.id,
            status: activity.status,
            amount: parseFloat(activity.amount) || 0,
            createdAt: activity.created_at,
            customerName: activity.customer_name,
            boatName: activity.boat_name,
            ownerName: activity.owner_name
          }))
        }
      });
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message
      });
    }
  }
}

module.exports = AdminReportsController;
