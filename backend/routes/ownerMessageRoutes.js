const express = require('express');
const router = express.Router();
const OwnerMessageController = require('../controllers/ownerMessageController');

// Get customers that have bookings with the boat owner
router.get('/customers/:ownerId', OwnerMessageController.getCustomers);

// Get messages between boat owner and customer
router.get('/:ownerId/:customerId', OwnerMessageController.getMessages);

// Send a new message from boat owner to customer
router.post('/send', OwnerMessageController.sendMessage);

// Get unread message count for boat owner
router.get('/unread/:ownerId', OwnerMessageController.getUnreadCount);

// Get recent conversations for boat owner
router.get('/conversations/:ownerId', OwnerMessageController.getRecentConversations);

module.exports = router;
