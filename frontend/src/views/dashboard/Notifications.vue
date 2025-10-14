<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import {
  BellIcon,
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/vue/24/outline";

const router = useRouter();

// State
const notifications = ref([]);
const loading = ref(true);
const socket = ref(null);
const user = ref({
  userId: null,
  fullName: "",
  profilePhoto: "",
});
const pollTimer = ref(null);

// Load user data
onMounted(async () => {
  console.log('🚀 Notifications page mounted');
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log('👤 Stored user:', storedUser);
  
  if (storedUser) {
    user.value = {
      userId: storedUser.userId || storedUser.user_id || storedUser.id,
      fullName: storedUser.fullName || storedUser.full_name,
      profilePhoto: storedUser.profilePhoto || storedUser.profile_pic || "https://i.pravatar.cc/40",
    };
    
    console.log('👤 User object:', user.value);
    console.log('🔍 DEBUG: User ID being used:', user.value.userId);
    console.log('🔍 DEBUG: Will call API:', `http://localhost:5000/api/notifications/user/${user.value.userId}`);
    
    // Initialize Socket.IO connection
    initializeSocket();
    
    await loadNotifications();
    // Start fallback polling (every 5s)
    pollTimer.value = setInterval(loadNotifications, 5000);
  } else {
    console.log('❌ No user found in localStorage');
    loading.value = false;
  }
});

// Initialize Socket.IO connection
const initializeSocket = () => {
  socket.value = io('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });

  socket.value.on('connect', () => {
    console.log('🔌 Connected to server from Notifications page');
    // Join user's personal room
    if (user.value.userId) {
      socket.value.emit('join-user-room', user.value.userId);
      console.log(`👤 Joined user room: user-${user.value.userId}`);
    }
  });

  socket.value.on('new-notification', (notification) => {
    console.log('📢 New notification received in Notifications page:', notification);
    
    // Add to notifications list at the beginning
    notifications.value.unshift({
      notification_id: notification.notification_id || Date.now(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      booking_id: notification.booking_id,
      boat_id: notification.boat_id,
      is_read: 0,
      created_at: notification.created_at || new Date().toISOString()
    });
    
    // Show notification popup
    Swal.fire({
      title: notification.title,
      text: notification.message,
      icon: 'info',
      timer: 5000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  });

  socket.value.on('disconnect', () => {
    console.log('🔌 Disconnected from server');
  });
};

// Load notifications from API
const loadNotifications = async () => {
  try {
    loading.value = true;
    if (!user.value.userId) {
      console.log('❌ No user ID available for loading notifications');
      loading.value = false;
      return;
    }
    
    console.log('📡 Loading notifications for user:', user.value.userId);
    
    const response = await axios.get(`http://localhost:5000/api/notifications/user/${user.value.userId}`, {
      timeout: 10000 // 10 second timeout
    });
    const payload = response.data;
    console.log('📡 Notifications response:', payload);
    
    // Accept multiple shapes: array, {data: [...]}, {success, data}, or nested
    if (Array.isArray(payload)) {
      notifications.value = payload;
    } else if (payload && Array.isArray(payload.data)) {
      notifications.value = payload.data;
    } else if (payload && payload.success && Array.isArray(payload.data)) {
      notifications.value = payload.data;
    } else if (payload && payload.success && payload.data && Array.isArray(payload.data.notifications)) {
      notifications.value = payload.data.notifications;
    } else {
      notifications.value = [];
    }
    // Ensure newest first
    notifications.value.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    console.log('✅ Loaded notifications:', notifications.value.length);
  } catch (error) {
    console.error('❌ Error loading notifications:', error);
    notifications.value = [];
    // Show error message to user
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout - using empty notifications');
    }
  } finally {
    loading.value = false;
    console.log('✅ Loading completed, notifications count:', notifications.value.length);
  }
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, { 
      userId: user.value.userId 
    });
    
    // Update local state
    const notification = notifications.value.find(n => n.notification_id === notificationId);
    if (notification) {
      notification.is_read = 1;
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    // Update local state anyway
    const notification = notifications.value.find(n => n.notification_id === notificationId);
    if (notification) {
      notification.is_read = 1;
    }
  }
};

// Mark all notifications as read
const markAllAsRead = async () => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/read-all/${user.value.userId}`);
    
    // Update local state
    notifications.value.forEach(notification => {
      notification.is_read = 1;
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    // Update local state anyway
    notifications.value.forEach(notification => {
      notification.is_read = 1;
    });
  }
};

// Delete notification
const deleteNotification = async (notificationId) => {
  try {
    await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
      data: { userId: user.value.userId }
    });
    
    // Remove from local state
    notifications.value = notifications.value.filter(n => n.notification_id !== notificationId);
  } catch (error) {
    console.error('Error deleting notification:', error);
    // Remove from local state anyway
    notifications.value = notifications.value.filter(n => n.notification_id !== notificationId);
  }
};

// Format notification time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

// Get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'booking_request': return '📋';
    case 'booking_update': return '🔄';
    case 'booking_completed': return '✅';
    case 'payment': return '💳';
    case 'review': return '⭐';
    default: return '🔔';
  }
};

// Get notification color based on type
const getNotificationColor = (type) => {
  switch (type) {
    case 'booking_request': return 'bg-blue-50 border-blue-200';
    case 'booking_update': return 'bg-yellow-50 border-yellow-200';
    case 'booking_completed': return 'bg-green-50 border-green-200';
    case 'payment': return 'bg-purple-50 border-purple-200';
    case 'review': return 'bg-orange-50 border-orange-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};

// Go back
const goBack = () => {
  router.go(-1);
};

// Test function to manually check notifications
const testNotifications = async () => {
  console.log('🧪 Testing notifications manually...');
  console.log('Current user ID:', user.value.userId);
  
  try {
    const response = await axios.get(`http://localhost:5000/api/notifications/user/${user.value.userId}`);
    console.log('🧪 Manual test response:', response.data);
    
    Swal.fire({
      title: 'Test Results',
      text: `Found ${response.data.data?.length || 0} notifications for user ${user.value.userId}`,
      icon: 'info'
    });
  } catch (error) {
    console.error('🧪 Manual test error:', error);
    Swal.fire({
      title: 'Test Failed',
      text: error.response?.data?.message || error.message,
      icon: 'error'
    });
  }
};

// Cleanup on unmount
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
    console.log('🔌 Socket disconnected on unmount');
  }
  if (pollTimer.value) {
    clearInterval(pollTimer.value);
    pollTimer.value = null;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-20">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="p-2 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 transition-all duration-200"
            >
              <ArrowLeftIcon class="w-5 h-5 text-orange-600" />
            </button>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p class="text-gray-600 text-sm font-medium">Stay updated with your latest activities</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="testNotifications"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2"
            >
              <span>🧪 Test</span>
            </button>
            <button
              @click="markAllAsRead"
              class="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <CheckIcon class="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BellIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">{{ notifications.length }}</p>
                <p class="text-sm text-gray-600">Total Notifications</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <EyeSlashIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">{{ notifications.filter(n => !n.is_read).length }}</p>
                <p class="text-sm text-gray-600">Unread</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <EyeIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">{{ notifications.filter(n => n.is_read).length }}</p>
                <p class="text-sm text-gray-600">Read</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">All Notifications</h2>
          </div>
          
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading notifications...</p>
          </div>
          
          <div v-else-if="notifications.length === 0" class="p-8 text-center">
            <BellIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-600 mb-2">No notifications yet</h3>
            <p class="text-gray-500">You'll see your notifications here when they arrive.</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="notification in notifications"
              :key="notification.notification_id"
              class="p-6 hover:bg-gray-50 transition-colors"
              :class="{ 'bg-orange-50': !notification.is_read }"
            >
              <div class="flex items-start space-x-4">
                <!-- Icon -->
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                       :class="getNotificationColor(notification.type)">
                    {{ getNotificationIcon(notification.type) }}
                  </div>
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-800 mb-1">
                        {{ notification.title }}
                      </h3>
                      <p class="text-gray-600 mb-2">{{ notification.message }}</p>
                      <p class="text-sm text-gray-400">{{ formatTime(notification.created_at) }}</p>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center space-x-2 ml-4">
                      <button
                        v-if="!notification.is_read"
                        @click="markAsRead(notification.notification_id)"
                        class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <EyeIcon class="w-4 h-4" />
                      </button>
                      
                      <button
                        @click="deleteNotification(notification.notification_id)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Unread indicator -->
                  <div v-if="!notification.is_read" class="mt-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Unread
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


