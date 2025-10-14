const Booking = require("../models/bookingModel");

exports.createBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
      payment_proof: req.file ? `/uploads/payments/${req.file.filename}` : null,
    };

    // Prevent double booking on same date for the same boat
    const isAvailable = await Booking.isBoatAvailableOnDate(data.boat_id, data.booking_date);
    if (!isAvailable) {
      return res.status(409).json({ message: 'Boat is not available on the selected date' });
    }

    const bookingId = await Booking.create(data);
    
    // Send admin and realtime notifications for new booking
    const sendAdminNotification = req.app.get('sendAdminNotification');
    const sendNotification = req.app.get('sendNotification');
    if (sendAdminNotification) {
      try {
        // Get booking details for notification
        const bookingDetails = await Booking.getDetails(bookingId);
        if (bookingDetails) {
          await sendAdminNotification({
            type: 'new_booking',
            booking_id: bookingId,
            user_id: bookingDetails.user_id,
            boat_id: bookingDetails.boat_id,
            user_name: bookingDetails.full_name, // Map full_name to user_name
            boat_name: bookingDetails.boat_name,
            total_price: bookingDetails.total_price
          });

          // Realtime notifications to customer and owner
          if (sendNotification) {
            await sendNotification({
              owner_id: bookingDetails.owner_id,
              user_id: bookingDetails.user_id,
              boat_id: bookingDetails.boat_id,
              booking_id: bookingId,
              type: 'booking_request',
              title: 'Booking Request Received',
              message: `Your booking request for ${bookingDetails.boat_name} on ${new Date(bookingDetails.booking_date).toLocaleDateString()} has been created.`
            });
            await sendNotification({
              owner_id: bookingDetails.owner_id,
              user_id: bookingDetails.user_id,
              boat_id: bookingDetails.boat_id,
              booking_id: bookingId,
              type: 'booking_request',
              title: 'New Booking Request',
              message: `${bookingDetails.full_name} requested ${bookingDetails.boat_name} on ${new Date(bookingDetails.booking_date).toLocaleDateString()}.`
            });
          }
        }
      } catch (notificationError) {
        console.error('Error sending admin notification:', notificationError);
      }
    }
    
    res.status(201).json({ message: "Booking created successfully", booking_id: bookingId });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};
// Availability endpoints
exports.getBoatUnavailableDates = async (req, res) => {
  try {
    const boatId = req.params.boatId;
    const dates = await Booking.getUnavailableDatesForBoat(boatId);
    res.json({ boatId, dates });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unavailable dates', error: err.message });
  }
};

exports.checkBoatAvailability = async (req, res) => {
  try {
    const { boatId, date } = req.query;
    if (!boatId || !date) return res.status(400).json({ message: 'boatId and date are required' });
    const available = await Booking.isBoatAvailableOnDate(boatId, date);
    res.json({ boatId: Number(boatId), date, available });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check availability', error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByUserId(req.params.userId);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user bookings", error: err.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.getDetails(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking details", error: err.message });
  }
};

// Owner-specific booking operations
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const bookings = await Booking.getByOwnerId(ownerId);
    
    // Transform data to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      id: booking.booking_id,
      boat: booking.boat_name,
      customer: booking.full_name,
      date: booking.booking_date,
      time: booking.booking_time,
      island: booking.islands.length > 0 ? booking.islands.map(i => i.name).join(', ') : 'No islands selected',
      foodPackage: booking.foodpackages.length > 0 ? booking.foodpackages.map(f => f.name).join(', ') : 'No food package',
      addons: booking.addons.length > 0 ? booking.addons.map(a => a.name).join(', ') : 'No addons',
      amount: booking.total_price,
      status: booking.status,
      paymentMethod: booking.payment_method,
      paymentStatus: booking.payment_status,
      paymentProof: booking.payment_proof,
      meetUpLocation: booking.meet_up_location,
      durationOption: booking.duration_option,
      image: booking.boat_images.length > 0 ? booking.boat_images[0] : null,
      customerEmail: booking.email,
      customerPhone: booking.phone_number,
      customerLocation: booking.location,
      history: [
        `Booking created on ${new Date(booking.created_at).toISOString().split('T')[0]}`,
        `Status: ${booking.status}`,
        `Payment: ${booking.payment_status}`
      ],
      // Include full details for modal
      fullDetails: {
        booking_id: booking.booking_id,
        boat_name: booking.boat_name,
        boat_features: booking.boat_features,
        boat_capacity: booking.capacity,
        boat_type: booking.boat_type,
        rental_price: booking.rental_price,
        duration_options: booking.duration_options,
        boat_images: booking.boat_images,
        addons: booking.addons,
        foodpackages: booking.foodpackages,
        islands: booking.islands,
        customer_details: {
          full_name: booking.full_name,
          email: booking.email,
          phone_number: booking.phone_number,
          location: booking.location
        }
      }
    }));

    res.json(transformedBookings);
  } catch (err) {
    console.error("Owner bookings error:", err);
    res.status(500).json({ message: "Failed to fetch owner bookings", error: err.message });
  }
};

exports.getOwnerBookingStats = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const stats = await Booking.getOwnerStats(ownerId);
    
    // Transform stats to match frontend expectations
    const transformedStats = {
      totalBookings: parseInt(stats.total_bookings) || 0,
      pendingCount: parseInt(stats.pending_count) || 0,
      confirmedCount: parseInt(stats.confirmed_count) || 0,
      completedCount: parseInt(stats.completed_count) || 0,
      cancelledCount: parseInt(stats.cancelled_count) || 0,
      totalRevenue: parseFloat(stats.total_revenue) || 0
    };

    res.json(transformedStats);
  } catch (err) {
    console.error("Owner stats error:", err);
    res.status(500).json({ message: "Failed to fetch owner stats", error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus, cancelReason } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be one of: " + validStatuses.join(', ') });
    }

    // Get booking details to verify ownership
    const bookingDetails = await Booking.getDetails(bookingId);
    if (!bookingDetails) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // For cancellation, ensure only the booking owner can cancel
    if (status === 'Cancelled' && bookingDetails.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    // Validate payment status if provided
    const validPaymentStatuses = ['Paid', 'Unpaid'];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status. Must be one of: " + validPaymentStatuses.join(', ') });
    }

    let updated;
    
    // Auto-payment logic: If status is "Confirmed", automatically set payment to "Paid"
    if (status === 'Confirmed' && !paymentStatus) {
      updated = await Booking.updateStatusAndPayment(bookingId, status, 'Paid');
    } else if (paymentStatus) {
      // Update both status and payment status
      updated = await Booking.updateStatusAndPayment(bookingId, status, paymentStatus);
    } else {
      // Update only status
      updated = await Booking.updateStatus(bookingId, status);
    }

    // If booking is being cancelled, handle additional logic
    if (status === 'Cancelled') {
      try {
        // Update boat status to Available when booking is cancelled
        await Booking.updateBoatStatus(bookingDetails.boat_id, 'Available');
        
        // Add cancellation reason to booking history if provided
        if (cancelReason) {
          await Booking.addToHistory(bookingId, 'cancelled', {
            old_status: bookingDetails.status,
            new_status: 'Cancelled',
            cancellation_reason: cancelReason
          }, req.user?.userId || 'system', `Booking cancelled: ${cancelReason}`);
        }
      } catch (historyError) {
        console.error('Error handling cancellation:', historyError);
        // Don't fail the main operation if history logging fails
      }
    }

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const response = { message: "Booking status updated successfully", status };
    if (paymentStatus || status === 'Confirmed') {
      response.paymentStatus = status === 'Confirmed' ? 'Paid' : paymentStatus;
    }

    // Emit realtime notification about status change
    try {
      const sendNotification = req.app.get('sendNotification');
      
      if (bookingDetails && sendNotification) {
        let title = 'Booking Status Updated';
        let message = `Your booking for ${bookingDetails.boat_name} is now ${status}.`;
        if (status === 'Confirmed') {
          title = 'Booking Confirmed! 🎉';
          message = `Great news! Your booking for ${bookingDetails.boat_name} on ${new Date(bookingDetails.booking_date).toLocaleDateString()} has been confirmed.`;
        } else if (status === 'Completed') {
          title = 'Trip Completed! ✅';
          message = `Your trip on ${bookingDetails.boat_name} has been completed. Hope you had a great time!`;
        } else if (status === 'Cancelled') {
          title = 'Booking Cancelled ❌';
          message = `Your booking for ${bookingDetails.boat_name} on ${new Date(bookingDetails.booking_date).toLocaleDateString()} was cancelled.`;
        }

        await sendNotification({
          owner_id: bookingDetails.owner_id,
          user_id: bookingDetails.user_id,
          boat_id: bookingDetails.boat_id,
          booking_id: parseInt(bookingId, 10),
          type: 'booking_update',
          title,
          message
        });
      }
    } catch (e) {
      console.error('Error sending realtime notification:', e);
    }

    res.json(response);
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Failed to update booking status", error: err.message });
  }
};

// New endpoint for updating payment status only
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus } = req.body;
    
    // Validate payment status
    const validPaymentStatuses = ['Paid', 'Unpaid'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status. Must be one of: " + validPaymentStatuses.join(', ') });
    }

    const updated = await Booking.updatePaymentStatus(bookingId, paymentStatus);
    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Payment status updated successfully", paymentStatus });
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(500).json({ message: "Failed to update payment status", error: err.message });
  }
};

exports.getOwnerBookingDetails = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.getDetails(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Transform to match frontend expectations
    const transformedBooking = {
      id: booking.booking_id,
      boat: booking.boat_name,
      customer: booking.full_name,
      date: booking.booking_date,
      time: booking.booking_time,
      island: booking.islands.length > 0 ? booking.islands.map(i => i.name).join(', ') : 'No islands selected',
      foodPackage: booking.foodpackages.length > 0 ? booking.foodpackages.map(f => f.name).join(', ') : 'No food package',
      addons: booking.addons.length > 0 ? booking.addons.map(a => a.name).join(', ') : 'No addons',
      amount: booking.total_price,
      status: booking.status,
      paymentMethod: booking.payment_method,
      paymentStatus: booking.payment_status,
      paymentProof: booking.payment_proof,
      meetUpLocation: booking.meet_up_location,
      durationOption: booking.duration_option,
      image: booking.boat_images.length > 0 ? booking.boat_images[0] : null,
      customerEmail: booking.email,
      customerPhone: booking.phone_number,
      customerLocation: booking.location,
      history: [
        `Booking created on ${new Date(booking.created_at).toISOString().split('T')[0]}`,
        `Status: ${booking.status}`,
        `Payment: ${booking.payment_status}`
      ],
      // Include full details for modal
      fullDetails: {
        booking_id: booking.booking_id,
        boat_name: booking.boat_name,
        boat_features: booking.boat_features,
        boat_capacity: booking.capacity,
        boat_type: booking.boat_type,
        rental_price: booking.rental_price,
        duration_options: booking.duration_options,
        boat_images: booking.boat_images,
        addons: booking.addons,
        foodpackages: booking.foodpackages,
        islands: booking.islands,
        customer_details: {
          full_name: booking.full_name,
          email: booking.email,
          phone_number: booking.phone_number,
          location: booking.location
        }
      }
    };

    res.json(transformedBooking);
  } catch (err) {
    console.error("Owner booking details error:", err);
    res.status(500).json({ message: "Failed to fetch booking details", error: err.message });
  }
};

// Owner earnings operations
exports.getOwnerEarnings = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Get earnings data with date filtering
    const earnings = await Booking.getOwnerEarnings(ownerId, startDate, endDate);
    
    // Transform data to match frontend expectations
    const transformedEarnings = earnings.map(booking => ({
      id: booking.booking_id,
      boat: booking.boat_name,
      customer: booking.full_name,
      date: booking.booking_date,
      time: booking.booking_time,
      amount: booking.total_price,
      status: booking.status,
      paymentMethod: booking.payment_method,
      paymentStatus: booking.payment_status,
      meetUpLocation: booking.meet_up_location,
      durationOption: booking.duration_option,
      image: booking.boat_images.length > 0 ? booking.boat_images[0] : null,
      customerEmail: booking.email,
      customerPhone: booking.phone_number,
      // Include additional details for earnings view
      addons: booking.addons.length > 0 ? booking.addons.map(a => a.name).join(', ') : 'No addons',
      foodPackage: booking.foodpackages.length > 0 ? booking.foodpackages.map(f => f.name).join(', ') : 'No food package',
      islands: booking.islands.length > 0 ? booking.islands.map(i => i.name).join(', ') : 'No islands selected',
      created_at: booking.created_at
    }));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedEarnings = transformedEarnings.slice(startIndex, endIndex);

    res.json({
      earnings: paginatedEarnings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(transformedEarnings.length / limit),
        totalItems: transformedEarnings.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Owner earnings error:", err);
    res.status(500).json({ message: "Failed to fetch owner earnings", error: err.message });
  }
};

exports.getOwnerEarningsStats = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const { startDate, endDate } = req.query;
    
    const stats = await Booking.getOwnerEarningsStats(ownerId, startDate, endDate);
    
    // Transform stats to match frontend expectations
    const transformedStats = {
      totalRevenue: stats.total_revenue,
      totalBookings: stats.total_bookings,
      completedBookings: stats.completed_bookings,
      avgBookingValue: stats.avg_booking_value,
      currentMonthRevenue: stats.current_month_revenue,
      currentMonthBookings: stats.current_month_bookings,
      previousMonthRevenue: stats.previous_month_revenue,
      previousMonthBookings: stats.previous_month_bookings,
      revenueGrowth: stats.revenue_growth,
      bookingGrowth: stats.booking_growth,
      firstBookingDate: stats.first_booking_date,
      lastBookingDate: stats.last_booking_date
    };

    res.json(transformedStats);
  } catch (err) {
    console.error("Owner earnings stats error:", err);
    res.status(500).json({ message: "Failed to fetch owner earnings stats", error: err.message });
  }
};

exports.getOwnerMonthlyEarnings = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const { year } = req.query;
    
    const monthlyEarnings = await Booking.getOwnerMonthlyEarnings(ownerId, year);
    
    res.json(monthlyEarnings);
  } catch (err) {
    console.error("Owner monthly earnings error:", err);
    res.status(500).json({ message: "Failed to fetch monthly earnings", error: err.message });
  }
};

exports.exportOwnerEarnings = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const { startDate, endDate, format = 'csv' } = req.query;
    
    // Get all earnings data (no pagination for export)
    const earnings = await Booking.getOwnerEarnings(ownerId, startDate, endDate);
    
    // Transform data for export
    const exportData = earnings.map(booking => ({
      'Booking ID': booking.booking_id,
      'Boat Name': booking.boat_name,
      'Customer': booking.full_name,
      'Customer Email': booking.email,
      'Customer Phone': booking.phone_number || 'N/A',
      'Booking Date': booking.booking_date,
      'Booking Time': booking.booking_time,
      'Amount': booking.total_price,
      'Status': booking.status,
      'Payment Method': booking.payment_method,
      'Payment Status': booking.payment_status,
      'Meet Up Location': booking.meet_up_location,
      'Duration Option': booking.duration_option,
      'Add-ons': booking.addons.length > 0 ? booking.addons.map(a => a.name).join('; ') : 'None',
      'Food Package': booking.foodpackages.length > 0 ? booking.foodpackages.map(f => f.name).join('; ') : 'None',
      'Islands': booking.islands.length > 0 ? booking.islands.map(i => i.name).join('; ') : 'None',
      'Created At': booking.created_at
    }));

    if (format === 'csv') {
      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="owner_earnings_${ownerId}_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else {
      // Return JSON format
      res.json({
        ownerId: parseInt(ownerId),
        exportDate: new Date().toISOString(),
        totalRecords: exportData.length,
        data: exportData
      });
    }
  } catch (err) {
    console.error("Export owner earnings error:", err);
    res.status(500).json({ message: "Failed to export owner earnings", error: err.message });
  }
};

// Owner dashboard operations
exports.getOwnerDashboardData = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const dashboardData = await Booking.getOwnerDashboardData(ownerId);
    
    // Transform data to match frontend expectations
    const transformedData = {
      totalBoats: dashboardData.totalBoats,
      totalBookings: dashboardData.totalBookings,
      avgRating: dashboardData.avgRating,
      totalReviews: dashboardData.totalReviews,
      monthlyEarnings: dashboardData.monthlyEarnings,
      revenueGrowth: dashboardData.revenueGrowth,
      recentBookings: dashboardData.recentBookings.map(booking => ({
        id: booking.id,
        boat: booking.boat,
        customer: booking.customer,
        date: booking.date,
        status: booking.status,
        payment: booking.payment,
        amount: booking.amount,
        boatType: booking.boatType,
        image: booking.image ? `http://localhost:5000${booking.image}` : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
      }))
    };

    res.json(transformedData);
  } catch (err) {
    console.error("Owner dashboard data error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data", error: err.message });
  }
};

exports.getOwnerPerformanceMetrics = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const { period = 'month' } = req.query;
    
    const metrics = await Booking.getOwnerPerformanceMetrics(ownerId, period);
    
    res.json(metrics);
  } catch (err) {
    console.error("Owner performance metrics error:", err);
    res.status(500).json({ message: "Failed to fetch performance metrics", error: err.message });
  }
};

exports.getOwnerActivitySummary = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const activitySummary = await Booking.getOwnerActivitySummary(ownerId);
    
    res.json(activitySummary);
  } catch (err) {
    console.error("Owner activity summary error:", err);
    res.status(500).json({ message: "Failed to fetch activity summary", error: err.message });
  }
};