const express = require('express');
const router = express.Router();
const AdminSimpleNotificationController = require('../controllers/adminSimpleNotificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all admin notifications
router.get('/', AdminSimpleNotificationController.getNotifications);

// Get unread count
router.get('/unread-count', AdminSimpleNotificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', AdminSimpleNotificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', AdminSimpleNotificationController.markAllAsRead);

module.exports = router;
