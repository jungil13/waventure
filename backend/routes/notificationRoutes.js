const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications for a user
router.get('/user/:userId', notificationController.getUserNotifications);

// Get notifications for an owner
router.get('/owner/:ownerId', notificationController.getOwnerNotifications);

// Get unread count for a user
router.get('/unread/:userId', notificationController.getUnreadCount);

// Get unread count for an owner
router.get('/owner-unread/:ownerId', notificationController.getOwnerUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read for a user
router.put('/read-all/:userId', notificationController.markAllAsRead);

// Mark all notifications as read for an owner
router.put('/owner-read-all/:ownerId', notificationController.markAllAsReadOwner);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Create a new notification
router.post('/', notificationController.createNotification);

module.exports = router;