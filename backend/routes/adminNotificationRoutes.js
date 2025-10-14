const express = require('express');
const router = express.Router();
const AdminNotificationController = require('../controllers/adminNotificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all notifications for admin
router.get('/', AdminNotificationController.getAdminNotifications);

// Get unread notification count for admin
router.get('/unread-count', AdminNotificationController.getAdminUnreadCount);

// Mark notification as read
router.put('/:id/read', AdminNotificationController.markAdminNotificationAsRead);

// Mark all notifications as read
router.put('/mark-all-read', AdminNotificationController.markAllAdminNotificationsAsRead);

// Create system notification
router.post('/system', AdminNotificationController.createSystemNotification);

// Get notifications by type (for easier filtering)
router.get('/type/:type', AdminNotificationController.getNotificationsByType);

// Get booking status update notifications specifically
router.get('/booking-status', AdminNotificationController.getBookingStatusNotifications);

module.exports = router;
