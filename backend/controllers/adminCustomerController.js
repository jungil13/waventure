const AdminCustomerModel = require('../models/adminCustomerModel');

class AdminCustomerController {
  // Get all customers with pagination and filters
  static async getAllCustomers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        search: req.query.search || '',
        status: req.query.status || '',
        location: req.query.location || ''
      };

      const [customers, totalCount] = await Promise.all([
        AdminCustomerModel.getAllCustomers(page, limit, filters),
        AdminCustomerModel.getCustomersCount(filters)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        message: 'Customers retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customers',
        error: error.message
      });
    }
  }

  // Get customer by ID with full details
  static async getCustomerById(req, res) {
    try {
      const { customerId } = req.params;
      
      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }

      const customer = await AdminCustomerModel.getCustomerById(customerId);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer,
        message: 'Customer details retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getCustomerById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer details',
        error: error.message
      });
    }
  }

  // Get customer statistics
  static async getCustomerStats(req, res) {
    try {
      const stats = await AdminCustomerModel.getCustomerStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Customer statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getCustomerStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer statistics',
        error: error.message
      });
    }
  }

  // Get top spending customers
  static async getTopSpendingCustomers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const customers = await AdminCustomerModel.getTopSpendingCustomers(limit);
      
      res.json({
        success: true,
        data: customers,
        message: 'Top spending customers retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getTopSpendingCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve top spending customers',
        error: error.message
      });
    }
  }

  // Get customers by location
  static async getCustomersByLocation(req, res) {
    try {
      const customers = await AdminCustomerModel.getCustomersByLocation();
      
      res.json({
        success: true,
        data: customers,
        message: 'Customers by location retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getCustomersByLocation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customers by location',
        error: error.message
      });
    }
  }
}

module.exports = AdminCustomerController;

