<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { io } from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

// ✅ User state
const user = ref({
  userId: null,
  fullName: "",
  profilePhoto: "",
});

// ✅ Mobile sidebar state
const isMobileMenuOpen = ref(false);

// ✅ Notification state
const notifications = ref([]);
const unreadCount = ref(0);
const socket = ref(null);

// Load user data from localStorage and setup Socket.IO
onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    user.value = {
      userId: storedUser.userId || storedUser.user_id || storedUser.id,
      fullName: storedUser.fullName || storedUser.full_name,
      profilePhoto: storedUser.profilePhoto || storedUser.profile_pic || "https://i.pravatar.cc/40",
    };

    // Load fresh user data from API to get updated profile picture
    await loadUserProfile();
    
    // Initialize Socket.IO connection
    initializeSocket();
    
    // Load notifications
    await loadNotifications();
    await loadUnreadCount();
  }
});

// Load user profile from API
const loadUserProfile = async () => {
  try {
    if (!user.value.userId) return;
    
    console.log('👤 Loading user profile for ID:', user.value.userId);
    const response = await axios.get(`http://localhost:5000/api/users/${user.value.userId}/profile`);
    
    if (response.data.success && response.data.profile) {
      const userData = response.data.profile;
      user.value = {
        userId: userData.user_id,
        fullName: userData.full_name,
        profilePhoto: userData.profile_pic || "https://i.pravatar.cc/40",
      };
      
      // Update localStorage with fresh data
      localStorage.setItem("user", JSON.stringify({
        userId: userData.user_id,
        fullName: userData.full_name,
        profilePhoto: userData.profile_pic,
        email: userData.email,
        user_type: userData.user_type
      }));
      
      console.log('✅ User profile loaded:', user.value);
    }
  } catch (error) {
    console.error('❌ Error loading user profile:', error);
  }
};

// Initialize Socket.IO connection
const initializeSocket = () => {
  console.log('🔌 Initializing Socket.IO connection...');
  socket.value = io('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });
  
  socket.value.on('connect', () => {
    console.log('🔌 Connected to server with ID:', socket.value.id);
    // Join user's personal room
    if (user.value.userId) {
      socket.value.emit('join-user-room', user.value.userId);
      console.log(`👤 Joined user room: user-${user.value.userId}`);
    } else {
      console.log('❌ No user ID available for joining room');
    }
  });
  
  socket.value.on('connect_error', (error) => {
    console.error('❌ Socket.IO connection error:', error);
  });

  socket.value.on('new-notification', (notification) => {
    console.log('📢 New notification received:', notification);
    
    // Add to notifications list
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
    
    // Update unread count
    unreadCount.value++;
    
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
    if (!user.value.userId) {
      console.log('❌ No user ID available for loading notifications');
      return;
    }
    
    console.log('📡 Loading notifications for user:', user.value.userId);
    const response = await axios.get(`http://localhost:5000/api/notifications/user/${user.value.userId}`);
    console.log('📡 Notifications response:', response.data);
    
    if (response.data.success && response.data.data) {
      notifications.value = response.data.data;
      console.log('✅ Loaded notifications:', notifications.value.length);
    } else {
      console.log('📝 No notifications found');
      notifications.value = [];
    }
  } catch (error) {
    console.error('❌ Error loading notifications:', error);
    notifications.value = [];
  }
};

// Load unread count
const loadUnreadCount = async () => {
  try {
    if (!user.value.userId) {
      console.log('❌ No user ID available for loading unread count');
      return;
    }
    
    console.log('📊 Loading unread count for user:', user.value.userId);
    const response = await axios.get(`http://localhost:5000/api/notifications/unread/${user.value.userId}`);
    console.log('📊 Unread count response:', response.data);
    
    if (response.data.success && response.data.count > 0) {
      unreadCount.value = response.data.count;
      console.log('✅ Unread count from API:', unreadCount.value);
    } else {
      // Calculate unread count from local notifications
      unreadCount.value = notifications.value.filter(n => !n.is_read).length;
      console.log('📊 Calculated unread count from local notifications:', unreadCount.value);
    }
  } catch (error) {
    console.error('❌ Error loading unread count:', error);
    // Calculate unread count from local notifications on error
    unreadCount.value = notifications.value.filter(n => !n.is_read).length;
    console.log('📊 Calculated unread count from local notifications (error fallback):', unreadCount.value);
  }
};

// Navigate to notifications page
const goToNotifications = () => {
  console.log('🔔 Navigating to notifications page');
  router.push('/user/notifications');
};

// Mark all notifications as read
const markAllAsRead = async () => {
  try {
    if (!user.value.userId || unreadCount.value === 0) return;
    
    await axios.put(`http://localhost:5000/api/notifications/read-all/${user.value.userId}`);
    unreadCount.value = 0;
    
    // Update local notifications
    notifications.value.forEach(notification => {
      notification.is_read = 1;
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
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

// Cleanup on unmount
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

// ✅ Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// ✅ Close mobile menu when route changes
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// ✅ Logout with SweetAlert2
const handleLogout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    await Swal.fire({
      title: "Logged out!",
      text: "You have been successfully logged out.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    router.push("/login");
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div class="flex items-center justify-between px-3 py-3">
        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <XMarkIcon v-else class="w-5 h-5" />
        </button>

        <!-- Mobile Brand -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <span class="text-white text-sm font-bold">W</span>
          </div>
          <div>
            <h1 class="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              WAVENTURE
            </h1>
            <p class="text-xs text-gray-500 -mt-1">Customer Portal</p>
          </div>
        </div>

        <!-- Mobile Notifications -->
        <div class="relative">
          <button 
            @click="goToNotifications"
            data-notification-button
            class="relative p-2 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <BellIcon class="w-5 h-5 text-orange-600" />
            <span 
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300"
      @click="closeMobileMenu"
    ></div>

    <!-- Mobile Sidebar -->
    <aside
      :class="[
        'lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 shadow-2xl z-50 transform transition-all duration-300 ease-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6 space-y-6 h-full flex flex-col overflow-y-auto">
        <!-- Mobile Brand Section -->
        <div class="text-center mb-8 pt-4">
          <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span class="text-3xl">🌊</span>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">WAVENTURE</h2>
          <p class="text-orange-100 text-sm font-medium">Customer Portal</p>
        </div>

        <!-- Mobile Navigation -->
        <nav class="space-y-2 flex-1">
          <RouterLink
            to="/user/dashboard"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/dashboard' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <ChartBarIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Dashboard</span>
          </RouterLink>

          <RouterLink
            to="/user/bookings"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/bookings' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <CalendarDaysIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">My Bookings</span>
          </RouterLink>

          <RouterLink
            to="/user/favorites"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/favorites' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <HeartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Favorites</span>
          </RouterLink>

          <RouterLink
            to="/user/messages"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/messages' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <ChatBubbleOvalLeftEllipsisIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Contact</span>
          </RouterLink>

          <RouterLink
            to="/user/notifications"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/notifications' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <BellIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Notifications</span>
            <span 
              v-if="unreadCount > 0"
              class="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </RouterLink>

          <RouterLink
            to="/user/boats"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/boats' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <UserGroupIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Boats</span>
          </RouterLink>

          <RouterLink
            to="/user/settings"
            @click="closeMobileMenu"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/settings' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <Cog6ToothIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Settings</span>
          </RouterLink>
        </nav>

        <!-- Mobile User Profile -->
        <div class="bg-white/15 backdrop-blur-sm rounded-3xl p-5 mb-4 shadow-lg">
          <div class="flex items-center space-x-4">
            <img
              :src="user.profilePhoto && user.profilePhoto.startsWith('http') ? user.profilePhoto : (user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : 'https://images.unsplash.com/photo-1517841905240-472988babdf9')"
              alt="User Avatar"
              class="w-14 h-14 rounded-2xl border-3 border-white shadow-lg object-cover"
            />
            <div class="text-left flex-1">
              <p class="text-lg font-bold text-white">{{ user.fullName || 'User' }}</p>
              <p class="text-sm text-orange-100 font-medium">Customer</p>
            </div>
          </div>
        </div>

        <!-- Mobile Logout Button -->
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-3 px-5 py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ArrowRightOnRectangleIcon class="w-6 h-6" />
          <span class="text-lg">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Desktop Layout -->
    <div class="hidden lg:flex min-h-screen">
      <!-- Desktop Sidebar -->
      <aside class="w-64 bg-orange-600 shadow-2xl p-6 space-y-6 fixed h-full z-30">
        <!-- Brand Section -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
           <img src="@/assets/logo.png" alt="" srcset="" class="shadow-md shadow-black/20 w-full h-full rounded-full object-cover object-center ">
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">WAVENTURE</h2>
          <p class="text-orange-100 text-sm font-medium">Customer Portal</p>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1">
          <RouterLink
            to="/user/dashboard"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/dashboard' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <ChartBarIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">Dashboard</span>
          </RouterLink>

          <RouterLink
            to="/user/bookings"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/bookings' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <CalendarDaysIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">My Bookings</span>
          </RouterLink>

          <RouterLink
            to="/user/favorites"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/favorites' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <HeartIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">Favorites</span>
          </RouterLink>

          <RouterLink
            to="/user/messages"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/messages' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">Contact</span>
          </RouterLink>

          <RouterLink
            to="/user/notifications"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/notifications' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <BellIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">Notifications</span>
            <span 
              v-if="unreadCount > 0"
              class="ml-auto w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </RouterLink>

          <RouterLink
            to="/user/boats"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/boats' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <UserGroupIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">Boats</span>
          </RouterLink>

          <RouterLink
            to="/user/settings"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/settings' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <Cog6ToothIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="text-base">Settings</span>
          </RouterLink>
        </nav>

        <!-- Desktop User Profile -->
        <div class="mt-auto pt-6">
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-lg">
            <div class="flex items-center space-x-3">
              <img
                :src="user.profilePhoto && user.profilePhoto.startsWith('http') ? user.profilePhoto : (user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : 'https://images.unsplash.com/photo-1517841905240-472988babdf9')"
                alt="User Avatar"
                class="w-12 h-12 rounded-xl border-2 border-white shadow-md object-cover"
              />
              <div class="text-left flex-1">
                <p class="text-sm font-bold text-white">{{ user.fullName || 'User' }}</p>
                <p class="text-xs text-orange-100 font-medium">Customer</p>
              </div>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            <span class="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Desktop Main Content -->
      <div class="flex-1 ml-64 flex flex-col">
        <!-- Desktop Header -->
        <header class="h-20 bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
              Welcome Back! 
            </h1>
            <p class="text-gray-600 text-sm font-medium">Ready for your next adventure?</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button 
                @click="goToNotifications"
                data-notification-button
                class="relative p-3 rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105"
              >
                <BellIcon class="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                <span 
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
                >
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>
            </div>
            
            <!-- User Profile -->
            <div class="flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-2xl cursor-pointer hover:from-orange-200 hover:to-pink-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
              <img
                :src="user.profilePhoto && user.profilePhoto.startsWith('http') ? user.profilePhoto : (user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : 'https://images.unsplash.com/photo-1517841905240-472988babdf9')"
                alt="User Avatar"
                class="w-10 h-10 rounded-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform object-cover"
              />
              <div class="text-left">
                <p class="text-sm font-bold text-gray-800">{{ user.fullName || 'User' }}</p>
                <p class="text-xs text-gray-600 font-medium">Customer</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Desktop Page Content -->
        <main class="flex-1 p-6">
          <RouterView />
        </main>
      </div>
    </div>

    <!-- Mobile Page Content -->
    <main class="lg:hidden p-4 sm:p-6 pt-24 sm:pt-28">
      <RouterView />
    </main>

    <!-- Tablet Layout (md: 768px - lg: 1024px) -->
    <div class="hidden md:flex lg:hidden min-h-screen">
      <!-- Tablet Sidebar -->
      <aside class="w-64 bg-white shadow-2xl p-6 space-y-6 fixed h-full z-30">
        <!-- Brand Section -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
           <img src="@/assets/logo.png" alt="" srcset="" class="shadow-lg shadow-black/20 w-full h-full rounded-full object-cover object-center ">
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">WAVENTURE</h2>
          <p class="text-orange-100 text-sm font-medium">Customer Portal</p>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <RouterLink
            to="/user/dashboard"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/dashboard' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <ChartBarIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Dashboard</span>
          </RouterLink>

          <RouterLink
            to="/user/bookings"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/bookings' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <CalendarDaysIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">My Bookings</span>
          </RouterLink>

          <RouterLink
            to="/user/favorites"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/favorites' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <HeartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Favorites</span>
          </RouterLink>

          <RouterLink
            to="/user/messages"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/messages' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <ChatBubbleOvalLeftEllipsisIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Contact</span>
          </RouterLink>

          <RouterLink
            to="/user/notifications"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/notifications' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <BellIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Notifications</span>
            <span 
              v-if="unreadCount > 0"
              class="ml-auto w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </RouterLink>

          <RouterLink
            to="/user/boats"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/boats' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <UserGroupIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Boats</span>
          </RouterLink>

          <RouterLink
            to="/user/settings"
            class="flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 group"
            :class="$route.path === '/user/settings' ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white'"
          >
            <Cog6ToothIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="text-lg">Settings</span>
          </RouterLink>
        </nav>

        <!-- Tablet User Profile -->
        <div class="mt-auto pt-6">
          <div class="bg-white/15 backdrop-blur-sm rounded-3xl p-5 mb-6 shadow-lg">
            <div class="flex items-center space-x-4">
              <img
                :src="user.profilePhoto && user.profilePhoto.startsWith('http') ? user.profilePhoto : (user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : 'https://images.unsplash.com/photo-1517841905240-472988babdf9')"
                alt="User Avatar"
                class="w-14 h-14 rounded-2xl border-3 border-white shadow-lg object-cover"
              />
              <div class="text-left flex-1">
                <p class="text-base font-bold text-white">{{ user.fullName || 'User' }}</p>
                <p class="text-sm text-orange-100 font-medium">Customer</p>
              </div>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-3 px-5 py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowRightOnRectangleIcon class="w-6 h-6" />
            <span class="text-lg">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Tablet Main Content -->
      <div class="flex-1 ml-64 flex flex-col">
        <!-- Tablet Header -->
        <header class="h-24 bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
              Welcome Back! 
            </h1>
            <p class="text-gray-600 text-sm font-medium">Ready for your next adventure?</p>
          </div>
          
          <div class="flex items-center space-x-6">
            <!-- Notifications -->
            <div class="relative">
              <button 
                @click="goToNotifications"
                data-notification-button
                class="relative p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105"
              >
                <BellIcon class="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                <span 
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
                >
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>
            </div>
            
            <!-- User Profile -->
            <div class="flex items-center space-x-4 bg-gradient-to-r from-orange-100 to-pink-100 px-6 py-3 rounded-2xl cursor-pointer hover:from-orange-200 hover:to-pink-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
              <img
                :src="user.profilePhoto && user.profilePhoto.startsWith('http') ? user.profilePhoto : (user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : 'https://images.unsplash.com/photo-1517841905240-472988babdf9')"
                alt="User Avatar"
                class="w-12 h-12 rounded-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform object-cover"
              />
              <div class="text-left">
                <p class="text-sm font-semibold text-gray-800">{{ user.fullName || 'User' }}</p>
                <p class="text-xs text-gray-600">Customer</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Tablet Page Content -->
        <main class="flex-1 p-8">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
