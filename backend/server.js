const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const boatRoutes = require('./routes/boatRoutes');
const islandRoutes = require('./routes/islandRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const bookingStatusRoutes = require("./routes/bookingStatusRoutes");
const messageRoutes = require("./routes/messageRoutes");
const ownerMessageRoutes = require("./routes/ownerMessageRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const adminBookingRoutes = require("./routes/adminBookingRoutes");
const adminBoatOwnerRoutes = require("./routes/adminBoatOwnerRoutes");
const adminBoatRoutes = require("./routes/adminBoatRoutes");
const adminCustomerRoutes = require("./routes/adminCustomerRoutes");
const adminReportsRoutes = require("./routes/adminReportsRoutes");
const adminIslandsRoutes = require("./routes/adminIslandsRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const adminSimpleNotificationRoutes = require("./routes/adminSimpleNotificationRoutes");
const ownerMaintenanceRoutes = require("./routes/ownerMaintenanceRoutes");
const bookingSoftDeleteRoutes = require("./routes/bookingSoftDeleteRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/boats', boatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/islands', islandRoutes);
app.use('/api/packages', packageRoutes); 
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/booking-status", bookingStatusRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/owner-messages", ownerMessageRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/admin-bookings", adminBookingRoutes);
app.use("/api/admin-boat-owners", adminBoatOwnerRoutes);
app.use("/api/admin/boats", adminBoatRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/reports", adminReportsRoutes);
app.use("/api/admin/islands", adminIslandsRoutes);
app.use("/api/notifications/admin", adminNotificationRoutes);
app.use("/api/admin/notifications", adminSimpleNotificationRoutes);
app.use("/api/owner/maintenance", ownerMaintenanceRoutes);
app.use("/api/bookings/soft-delete", bookingSoftDeleteRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room: user-${userId}`);
  });

  // Join owner to their personal room
  socket.on('join-owner-room', (ownerId) => {
    socket.join(`owner-${ownerId}`);
    console.log(`👤 Owner ${ownerId} joined room: owner-${ownerId}`);
  });

  // Join user to messaging room
  socket.on('join-messaging', (userId) => {
    socket.join(`messaging-${userId}`);
    console.log(`💬 User ${userId} joined messaging room`);
  });

  // Join user to specific booking conversation room
  socket.on('join-booking-conversation', (data) => {
    const { userId, bookingId } = data;
    const roomName = `booking-${bookingId}-${userId}`;
    socket.join(roomName);
    console.log(`💬 User ${userId} joined booking conversation room: ${roomName}`);
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const MessageModel = require('./models/messageModel');
      
      // Save message to database
      const messageId = await MessageModel.sendMessage(
        data.senderId,
        data.receiverId,
        data.message,
        data.bookingId
      );
      
      // Get sender info
      const userModel = require('./models/userModel');
      const sender = await userModel.getUserProfile(data.senderId);
      
      const messageData = {
        messageId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        bookingId: data.bookingId,
        message: data.message,
        senderName: sender.full_name,
        senderAvatar: sender.profile_pic,
        createdAt: new Date()
      };
      
      // Emit ONLY to booking-specific room for proper isolation
      if (data.bookingId) {
        const bookingRoom = `booking-${data.bookingId}-${data.receiverId}`;
        io.to(bookingRoom).emit('new-message', messageData);
        console.log(`💬 Message sent to booking room: ${bookingRoom}`);
      } else {
        // Fallback to general messaging room only if no bookingId
        io.to(`messaging-${data.receiverId}`).emit('new-message', messageData);
        console.log(`💬 Message sent to general messaging room: messaging-${data.receiverId}`);
      }
      
      // Emit to sender for confirmation
      socket.emit('message-sent', messageData);
      
      console.log(`💬 Message sent from ${data.senderId} to ${data.receiverId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  // Handle booking status updates
  socket.on('booking-status-update', async (data) => {
    try {
      const notificationModel = require('./models/notificationModel');
      
      // Create notification in database
      const notificationData = {
        owner_id: data.ownerId,
        user_id: data.userId,
        boat_id: data.boatId,
        booking_id: data.bookingId,
        type: data.type,
        title: data.title,
        message: data.message
      };
      
      await notificationModel.createNotification(notificationData);
      
      // Emit to both owner and user
      io.to(`user-${data.ownerId}`).emit('new-notification', {
        type: data.type,
        title: data.title,
        message: data.message,
        bookingId: data.bookingId
      });
      
      if (data.userId !== data.ownerId) {
        io.to(`user-${data.userId}`).emit('new-notification', {
          type: data.type,
          title: data.title,
          message: data.message,
          bookingId: data.bookingId
        });
      }
      
      console.log('📢 Notification sent:', data.title);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });

  // Handle user joining their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room: user-${userId}`);
  });

  // Handle owner joining their personal room
  socket.on('join-owner-room', (ownerId) => {
    socket.join(`owner-${ownerId}`);
    console.log(`👨‍💼 Owner ${ownerId} joined room: owner-${ownerId}`);
  });

  // Handle admin joining admin room
  socket.on('join-admin-room', (adminId) => {
    socket.join('admin-room');
    console.log(`👨‍💻 Admin ${adminId} joined admin room`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io available to other modules
app.set('io', io);

// Helper function to send notifications via Socket.IO
const sendNotification = async (notificationData) => {
  try {
    const NotificationModel = require('./models/notificationModel');
    
    // Create notification in database
    const result = await NotificationModel.createNotification(notificationData);
    
    // Send to specific user if user_id is provided
    if (notificationData.user_id) {
      const notificationPayload = {
        notification_id: result.insertId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        booking_id: notificationData.booking_id,
        boat_id: notificationData.boat_id,
        created_at: new Date().toISOString()
      };
      
      io.to(`user-${notificationData.user_id}`).emit('new-notification', notificationPayload);
    }
    
    // Send to owner if owner_id is provided
    if (notificationData.owner_id) {
      const ownerNotificationPayload = {
        notification_id: result.insertId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        booking_id: notificationData.booking_id,
        boat_id: notificationData.boat_id,
        created_at: new Date().toISOString()
      };
      
      io.to(`owner-${notificationData.owner_id}`).emit('new-notification', ownerNotificationPayload);
    }
    
    // Send to all users for general notifications (like new boats)
    if (!notificationData.user_id && !notificationData.owner_id) {
      io.emit('new-notification', {
        notification_id: result.insertId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        booking_id: notificationData.booking_id,
        boat_id: notificationData.boat_id,
        created_at: new Date().toISOString()
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Make sendNotification available to other modules
app.set('sendNotification', sendNotification);

// Helper function to send admin notifications
const sendAdminNotification = async (notificationData) => {
  try {
    const AdminNotificationService = require('./services/adminNotificationService');
    
    // Send notification based on type
    switch (notificationData.type) {
      case 'new_booking':
        await AdminNotificationService.sendNewBookingNotification(notificationData);
        break;
      case 'booking_status':
        await AdminNotificationService.sendBookingStatusNotification(notificationData);
        break;
      case 'boat_maintenance':
        await AdminNotificationService.sendBoatMaintenanceNotification(notificationData);
        break;
      default:
        console.log('Unknown notification type:', notificationData.type);
    }
    
    // Send to all admin users via Socket.IO
    io.emit('admin-notification', {
      type: notificationData.type,
      title: notificationData.title || 'Admin Notification',
      message: notificationData.message,
      created_at: new Date().toISOString()
    });
    
    console.log(`📢 Admin notification sent: ${notificationData.type}`);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

// Make sendAdminNotification available to other modules
app.set('sendAdminNotification', sendAdminNotification);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
});
