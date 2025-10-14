const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new review
router.post('/', ReviewController.createReview);

// Get reviews for a specific boat
router.get('/boat/:boatId', ReviewController.getBoatReviews);

// Get booking details for review
router.get('/booking/:bookingId', ReviewController.getBookingForReview);

// Get user's reviews
router.get('/user/:userId', ReviewController.getUserReviews);

// Get boat rating statistics
router.get('/boat/:boatId/stats', ReviewController.getBoatRatingStats);

// Get reviews for all boats owned by a specific owner
router.get('/owner/:ownerId', ReviewController.getOwnerReviews);

// Get owner's review statistics
router.get('/owner/:ownerId/stats', ReviewController.getOwnerReviewStats);

// Update a review
router.put('/:reviewId', ReviewController.updateReview);

// Delete a review
router.delete('/:reviewId', ReviewController.deleteReview);

// ADMIN ROUTES (require authentication and admin role)
// Get all reviews across all boats (admin only)
router.get('/admin', authMiddleware, ReviewController.getAllReviews);

// Get overall review statistics (admin only)
router.get('/admin/stats', authMiddleware, ReviewController.getOverallReviewStats);

// Admin delete review
router.delete('/admin/:reviewId', authMiddleware, ReviewController.adminDeleteReview);

module.exports = router;
