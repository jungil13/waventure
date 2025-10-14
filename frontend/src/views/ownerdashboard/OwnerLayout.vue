<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { notificationService } from "@/services/notificationService";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  BellIcon,
  MapIcon,
  GiftIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  StarIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);
const userFullName = ref("");
const userProfilePic = ref("");
const notifications = ref([]);
const unreadCount = ref(0);
const notificationsOpen = ref(false);
const loading = ref(false);
const socket = ref(null);

// Get current owner ID
const getCurrentOwnerId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.user_id || 2; // Default to owner ID 2 for testing
};

// Fetch notifications
const fetchNotifications = async () => {
  try {
    loading.value = true;
    const ownerId = getCurrentOwnerId();
    console.log('🔔 Fetching notifications for owner ID:', ownerId);
    const response = await notificationService.getOwnerNotifications(ownerId, 10);
    console.log('🔔 Notifications response:', response);
    notifications.value = response.data || [];
    console.log('🔔 Notifications set:', notifications.value);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Fallback to mock data
    notifications.value = [
      {
        id: 1,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'Honey Kate Padilla has requested to book BARKO BARKO for 2025-08-16. Total: ₱9500',
        isRead: false,
        timeAgo: '2 hours ago',
        userName: 'Honey Kate Padilla',
        boatName: 'BARKO BARKO'
      },
      {
        id: 2,
        type: 'booking_completed',
        title: 'Booking Completed',
        message: 'Booking for BARKO BARKO on 2025-08-16 has been completed. Payment: ₱9500',
        isRead: false,
        timeAgo: '1 hour ago',
        userName: 'Honey Kate Padilla',
        boatName: 'BARKO BARKO'
      },
      {
        id: 3,
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of ₱4700 received for Inday Baroday Sail booking on 2025-08-30.',
        isRead: true,
        timeAgo: '30 minutes ago',
        userName: 'Mikha Lim',
        boatName: 'Inday Baroday Sail'
      }
    ];
    console.log('🔔 Using fallback notifications:', notifications.value);
  } finally {
    loading.value = false;
  }
};

// Fetch unread count
const fetchUnreadCount = async () => {
  try {
    const ownerId = getCurrentOwnerId();
    console.log('🔔 Fetching unread count for owner ID:', ownerId);
    const response = await notificationService.getOwnerUnreadCount(ownerId);
    console.log('🔔 Unread count response:', response);
    unreadCount.value = response.count || 0;
    console.log('🔔 Unread count set:', unreadCount.value);
  } catch (error) {
    console.error("Error fetching unread count:", error);
    unreadCount.value = 2; // Fallback count
    console.log('🔔 Using fallback unread count:', unreadCount.value);
  }
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    const ownerId = getCurrentOwnerId();
    await notificationService.markOwnerNotificationAsRead(notificationId, ownerId);
    
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId || n.notification_id === notificationId);
    if (notification) {
      notification.isRead = true;
      notification.is_read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

// Mark all as read
const markAllAsRead = async () => {
  try {
    const ownerId = getCurrentOwnerId();
    await notificationService.markAllOwnerNotificationsAsRead(ownerId);
    
    // Update local state
    notifications.value.forEach(notification => {
      notification.isRead = true;
      notification.is_read = true;
    });
    unreadCount.value = 0;
    notificationsOpen.value = false;
    
    Swal.fire({
      title: 'Success!',
      text: 'All notifications marked as read',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

// Get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'booking_request':
      return DocumentTextIcon;
    case 'booking_completed':
      return CheckCircleIcon;
    case 'payment':
      return CurrencyDollarIcon;
    case 'booking_update':
      return ArrowPathIcon;
    case 'review':
      return StarIcon;
    default:
      return BellIcon;
  }
};

// Get notification color based on type
const getNotificationColor = (type) => {
  switch (type) {
    case 'booking_request':
      return 'text-blue-500';
    case 'booking_completed':
      return 'text-green-500';
    case 'payment':
      return 'text-yellow-500';
    case 'booking_update':
      return 'text-purple-500';
    case 'review':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

// Computed properties
const unreadNotifications = computed(() => notifications.value.filter(n => !n.isRead && !n.is_read));
const hasUnreadNotifications = computed(() => unreadCount.value > 0);

// Handle notification click
const handleNotificationClick = async (notification) => {
  if (!notification.isRead && !notification.is_read) {
    await markAsRead(notification.id || notification.notification_id);
  }
  notificationsOpen.value = false;
  
  // Navigate based on notification type
  if (notification.booking_id) {
    router.push(`/owner/bookings`);
  } else if (notification.boat_id) {
    router.push(`/owner/myboats`);
  }
};

// Toggle notifications dropdown
const toggleNotifications = () => {
  console.log('🔔 Toggle clicked, current state:', notificationsOpen.value);
  notificationsOpen.value = !notificationsOpen.value;
  console.log('🔔 New state:', notificationsOpen.value);
  
  // Load notifications when opening dropdown
  if (notificationsOpen.value) {
    fetchNotifications();
  }
  
  console.log('🔔 Notifications data:', notifications.value);
  console.log('🔔 Unread count:', unreadCount.value);
};

// Close notifications when clicking outside
const handleClickOutside = (event) => {
  if (notificationsOpen.value && !event.target.closest('.notifications-dropdown') && !event.target.closest('button')) {
    console.log('🔔 Clicking outside, closing dropdown');
    notificationsOpen.value = false;
  }
};

// Close dropdowns when clicking outside (similar to AdminLayout)
const closeDropdowns = (event) => {
  if (!event.target.closest('.notifications-dropdown') && !event.target.closest('button')) {
    notificationsOpen.value = false;
  }
};

// Initialize Socket.IO connection
const initializeSocket = () => {
  console.log('🔌 Initializing owner Socket.IO connection...');
  socket.value = io('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });

  socket.value.on('connect', () => {
    console.log('🔌 Owner connected to server with ID:', socket.value.id);
    // Join owner's personal room
    const ownerId = getCurrentOwnerId();
    if (ownerId) {
      socket.value.emit('join-owner-room', ownerId);
      console.log(`👨‍💼 Owner joined room: owner-${ownerId}`);
    } else {
      console.log('❌ No owner ID available for joining room');
    }
  });
  
  socket.value.on('connect_error', (error) => {
    console.error('❌ Owner Socket.IO connection error:', error);
  });

  socket.value.on('new-notification', (notification) => {
    console.log('📢 New notification received for owner:', notification);

    // Add to notifications list at the beginning
    notifications.value.unshift({
      id: notification.notification_id || Date.now(),
      notification_id: notification.notification_id || Date.now(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      booking_id: notification.booking_id,
      boat_id: notification.boat_id,
      is_read: false,
      isRead: false,
      created_at: notification.created_at || new Date().toISOString(),
      timeAgo: 'Just now'
    });

    // Update unread count
    unreadCount.value++;

    // Don't show toast alert for booking_request notifications to avoid conflict with booking success alert
    if (notification.type !== 'booking_request') {
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
    }
  });

  socket.value.on('disconnect', () => {
    console.log('🔌 Owner disconnected from server');
  });
};

// Fetch user profile data
const fetchUserProfile = async () => {
  try {
    const userId = getCurrentOwnerId();
    console.log('👤 Loading owner profile for ID:', userId);
    const response = await fetch(`http://localhost:5000/api/users/${userId}/profile`);
    const data = await response.json();
    
    if (data.success && data.profile) {
      userFullName.value = data.profile.full_name || "Boat Owner";
      userProfilePic.value = data.profile.profile_pic || "";
      console.log('✅ Owner profile loaded:', { name: userFullName.value, pic: userProfilePic.value });
    } else {
      throw new Error('No profile data received');
    }
  } catch (error) {
    console.error("Error fetching owner profile:", error);
    // Fallback to localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    userFullName.value = user.fullName || user.full_name || "Boat Owner";
    userProfilePic.value = user.profilePhoto || user.profile_pic || "";
    console.log('📝 Using localStorage fallback:', { name: userFullName.value, pic: userProfilePic.value });
  }
};

// Get profile image URL
const getProfileImageUrl = (profilePic) => {
  if (!profilePic) {
    return 'https://i.pravatar.cc/40';
  }
  
  // If it's already a full URL, return as is
  if (profilePic.startsWith('http')) {
    return profilePic;
  }
  
  // If it's a relative path, construct the full URL
  return `http://localhost:5000${profilePic}`;
};

// Handle image error
const handleImageError = (event) => {
  console.log('Profile image failed to load, showing initials instead');
  // Hide the image and show initials
  event.target.style.display = 'none';
  const parent = event.target.parentElement;
  if (parent) {
    parent.innerHTML = `<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-white shadow-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">${getInitials(userFullName.value || 'Owner')}</div>`;
  }
};

// Get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '?';
  const names = fullName.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// Fetch full name from localStorage
onMounted(async () => {
  // Fetch user profile data first
  await fetchUserProfile();
  
  console.log('🔔 Component mounted, initial state:');
  console.log('🔔 notificationsOpen:', notificationsOpen.value);
  console.log('🔔 notifications:', notifications.value);
  console.log('🔔 unreadCount:', unreadCount.value);
  console.log('🔔 hasUnreadNotifications:', hasUnreadNotifications.value);
  console.log('🔔 userFullName:', userFullName.value);
  console.log('🔔 userProfilePic:', userProfilePic.value);
  
  // Initialize Socket.IO connection
  initializeSocket();
  
  // Fetch notifications
  fetchNotifications();
  fetchUnreadCount();
  
  // Add click outside listener
  document.addEventListener('click', closeDropdowns);
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
  if (socket.value) {
    socket.value.disconnect();
    console.log('🔌 Owner socket disconnected on unmount');
  }
});

const menuItems = [
  { name: "Dashboard", to: "/owner/ownerdashboard", icon: ChartBarIcon },
  { name: "My Boats", to: "/owner/myboats", icon: CalendarDaysIcon },
  { name: "Bookings", to: "/owner/bookings", icon: HeartIcon },
  { name: "Maintenance", to: "/owner/maintenance", icon: WrenchScrewdriverIcon },
  { name: "Reviews", to: "/owner/reviews", icon: StarIcon },
  { name: "Earnings", to: "/owner/earnings", icon: UserGroupIcon },
  { name: "Islands", to: "/owner/islands", icon: MapIcon },
  { name: "Food Packages", to: "/owner/foodpackages", icon: GiftIcon },
  { name: "Settings", to: "/owner/settings", icon: Cog6ToothIcon },
];

// Logout function
const logout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You will be logged out!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout!',
  });

  if (result.isConfirmed) {
    localStorage.removeItem("user"); // remove user info
    localStorage.removeItem("token"); // remove token
    router.push("/"); // redirect to login or home
    Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
  }
};
</script>


<template>
  <div class="flex min-h-screen font-sans bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
    <!-- Mobile Sidebar -->
    <div :class="['fixed inset-0 z-40 transition-opacity duration-300 md:hidden', sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none']">
      <div class="absolute inset-0 bg-black bg-opacity-70" @click="sidebarOpen = false"></div>

      <aside :class="[
        'relative w-64 h-full shadow-2xl transform transition-transform duration-300 rounded-tr-3xl rounded-br-3xl',
        sidebarOpen
          ? 'translate-x-0 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500'
          : '-translate-x-full'
      ]">
        <div class="flex items-center justify-between p-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span class="text-xl">⚓</span>
            </div>
            <h2 class="text-xl font-bold text-white">WAVENTURE</h2>
          </div>
          <button class="p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition" @click="sidebarOpen = false">
            <XMarkIcon class="w-6 h-6 text-white" />
          </button>
        </div>

        <nav class="space-y-2 p-6 pt-0">
          <RouterLink v-for="item in menuItems" :key="item.name" :to="item.to"
            class="flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 hover:bg-white/20 hover:scale-105"
            :class="[route.path === item.to ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white']"
            @click="sidebarOpen = false">
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </nav>

        <div class="p-6">
          <button @click="logout"
            class="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-lg">
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 shadow-2xl p-6 space-y-6 bg-gradient-to-b from-purple-600 via-pink-500 z-20">
      <!-- Brand Section -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">⚓</span>
        </div>
        <h2 class="text-2xl font-bold text-white">WAVENTURE</h2>
        <p class="text-purple-100 text-sm">Captain's Portal</p>
      </div>

      <!-- Navigation -->
      <nav class="space-y-3 flex-1">
        <RouterLink v-for="item in menuItems" :key="item.name" :to="item.to"
          class="flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 hover:bg-white/20 hover:scale-105"
          :class="[route.path === item.to ? 'bg-white/30 text-white shadow-lg' : 'text-white/90 hover:text-white']">
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Logout Button -->
      <div class="mt-auto">
        <button @click="logout"
          class="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-lg">
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Modern Header -->
      <header class="h-16 sm:h-20 bg-white/10 backdrop-blur-lg shadow-lg border-b border-white/20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
        <div class="flex items-center space-x-2 sm:space-x-4">
          <button class="md:hidden p-2 sm:p-3 rounded-2xl hover:bg-white hover:bg-opacity-20 transition" @click="sidebarOpen = true">
            <Bars3Icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <div class="hidden sm:block">
            <h1 class="text-lg sm:text-2xl font-bold text-white">⚓ Captain's Command Center</h1>
            <p class="text-purple-200 text-xs sm:text-sm">Manage your fleet and bookings</p>
          </div>
          <div class="sm:hidden">
            <h1 class="text-lg font-bold text-white">⚓ WAVENTURE</h1>
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-6">
          <!-- Notifications -->
          <div class="relative notification-dropdown">
            <button 
              @click="toggleNotifications"
              @mousedown="console.log('🔔 Button mousedown')"
              @mouseup="console.log('🔔 Button mouseup')"
              class="relative p-2 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BellIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span 
                v-if="hasUnreadNotifications"
                class="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <div 
              v-if="notificationsOpen"
              class="notifications-dropdown absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-hidden"
              @click.stop
            >
              <!-- Header -->
              <div class="p-4 border-b border-gray-200/50">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-bold text-gray-800">Notifications</h3>
                  <div class="flex items-center space-x-2">
                    <button 
                      v-if="hasUnreadNotifications"
                      @click="markAllAsRead"
                      class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      Mark all read
                    </button>
                    <button 
                      @click="notificationsOpen = false"
                      class="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XMarkIcon class="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Notifications List -->
              <div class="max-h-80 overflow-y-auto">
                <div v-if="loading" class="p-4 text-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p class="text-sm text-gray-500 mt-2">Loading notifications...</p>
                </div>
                
                <div v-else-if="notifications.length === 0" class="p-4 text-center">
                  <BellIcon class="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p class="text-sm text-gray-500">No notifications yet</p>
                </div>
                
                <div v-else>
                  <div 
                    v-for="notification in notifications" 
                    :key="notification.id || notification.notification_id"
                    @click="handleNotificationClick(notification)"
                    class="p-4 border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    :class="{ 'bg-blue-50/50': !notification.isRead && !notification.is_read }"
                  >
                    <div class="flex items-start space-x-3">
                      <div class="flex-shrink-0">
                        <component 
                          :is="getNotificationIcon(notification.type)" 
                          class="w-6 h-6"
                          :class="getNotificationColor(notification.type)"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <p class="text-sm font-semibold text-gray-900">{{ notification.title }}</p>
                          <div class="flex items-center space-x-2">
                            <span class="text-xs text-gray-500">{{ notification.timeAgo }}</span>
                            <div v-if="!notification.isRead && !notification.is_read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                        <div class="flex items-center space-x-2 mt-2">
                          <span class="text-xs text-gray-500">{{ notification.userName }}</span>
                          <span class="text-xs text-gray-400">•</span>
                          <span class="text-xs text-gray-500">{{ notification.boatName }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="p-3 border-t border-gray-200/50 bg-gray-50/50">
                <button 
                  @click="router.push('/owner/bookings')"
                  class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  View all bookings
                </button>
              </div>
            </div>
          </div>
          
          <!-- User Profile -->
          <div class="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm px-2 sm:px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/20 transition-all duration-200 shadow-md hover:shadow-lg">
            <img 
              :src="getProfileImageUrl(userProfilePic)" 
              alt="User Avatar" 
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-white shadow-md object-cover"
              @error="handleImageError"
            />
            <div class="text-left hidden sm:block">
              <p class="text-sm font-semibold text-white">{{ userFullName || 'Boat Owner' }}</p>
              <p class="text-xs text-purple-200">Boat Owner</p>
            </div>
            <div class="text-left sm:hidden">
              <p class="text-xs font-semibold text-white">{{ (userFullName || 'Owner').split(' ')[0] }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

