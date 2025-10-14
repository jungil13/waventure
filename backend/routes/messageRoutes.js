const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');

// Get boat owners that the user has bookings with
router.get('/boat-owners/:userId', MessageController.getBoatOwners);

// Get messages between two users
router.get('/:userId/:ownerId', MessageController.getMessages);

// Send a new message
router.post('/send', MessageController.sendMessage);

// Get unread message count
router.get('/unread/:userId', MessageController.getUnreadCount);

// Get recent conversations
router.get('/conversations/:userId', MessageController.getRecentConversations);

module.exports = router;
