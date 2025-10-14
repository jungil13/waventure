const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const bookingController = require("../controllers/bookingController");

// Customer booking routes
router.post("/", upload.single("payment_proof"), bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/user/:userId", bookingController.getUserBookings);

// Availability (must be BEFORE parameterized routes)
router.get("/boat/:boatId/unavailable-dates", bookingController.getBoatUnavailableDates);
router.get("/availability", bookingController.checkBoatAvailability);

// Parameterized routes
router.get("/:bookingId", bookingController.getBookingDetails);

// Owner booking routes
router.get("/owner/:ownerId", bookingController.getOwnerBookings);
router.get("/owner/:ownerId/stats", bookingController.getOwnerBookingStats);
router.get("/owner/details/:bookingId", bookingController.getOwnerBookingDetails);
router.put("/:bookingId/status", authMiddleware, bookingController.updateBookingStatus);
router.put("/:bookingId/payment-status", authMiddleware, bookingController.updatePaymentStatus);

// Owner earnings routes
router.get("/owner/:ownerId/earnings", bookingController.getOwnerEarnings);
router.get("/owner/:ownerId/earnings/stats", bookingController.getOwnerEarningsStats);
router.get("/owner/:ownerId/earnings/monthly", bookingController.getOwnerMonthlyEarnings);
router.get("/owner/:ownerId/earnings/export", bookingController.exportOwnerEarnings);

// Owner dashboard routes
router.get("/owner/:ownerId/dashboard", bookingController.getOwnerDashboardData);
router.get("/owner/:ownerId/performance", bookingController.getOwnerPerformanceMetrics);
router.get("/owner/:ownerId/activity", bookingController.getOwnerActivitySummary);

module.exports = router;
