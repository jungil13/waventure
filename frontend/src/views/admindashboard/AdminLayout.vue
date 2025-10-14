<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
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
  MapIcon,
  GiftIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  PhotoIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/vue/24/outline";
import AdminService from "@/services/adminService";
import AdminSimpleNotificationService from "@/services/adminSimpleNotificationService";

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);
const showNotifications = ref(false);
const showUserMenu = ref(false);
const socket = ref(null);

// State management
const user = ref({
  user_id: null,
  full_name: "",
  email: "",
  profile_pic: "",
  user_type: "",
  phone_number: "",
  location: "",
  bio: ""
});

const notifications = ref([]);
const unreadCount = ref(0);
const loading = ref(false);

const menuItems = [
  { name: "Dashboard", to: "/admin/admindashboard", icon: ChartBarIcon },
  { name: "Fleet Management", to: "/admin/fleetmanagement", icon: CalendarDaysIcon },
  { name: "Bookings", to: "/admin/bookings", icon: HeartIcon },
  { name: "Boat Owners", to: "/admin/boatowners", icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: "Customers", to: "/admin/customers", icon: UserGroupIcon },
  { name: "Reviews", to: "/admin/reviews", icon: StarIcon },
  { name: "Reports", to: "/admin/reports", icon: MapIcon },
  { name: "Routes/Islands", to: "/admin/routes", icon: GiftIcon },
  { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
];

// Computed properties
const userDisplayName = computed(() => {
  return user.value.full_name || user.value.email || "Admin";
});

const userProfileImage = computed(() => {
  return AdminService.formatImageUrl(user.value.profile_pic);
});

const hasUnreadNotifications = computed(() => {
  return unreadCount.value > 0;
});

// Initialize Socket.IO connection
const initializeSocket = () => {
  socket.value = io('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });

  socket.value.on('connect', () => {
    console.log('🔌 Connected to server');
    // Join admin room for notifications
    if (user.value.user_id) {
      socket.value.emit('join-user-room', user.value.user_id);
    }
  });

  socket.value.on('admin-notification', (notification) => {
    console.log('📢 New admin notification received:', notification);
    // Add to notifications list
    notifications.value.unshift({
      ...notification,
      id: Date.now(), // Temporary ID
      created_at: new Date().toISOString(),
      is_read: false
    });
    unreadCount.value++;
    
    // Show toast notification
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

// Load user profile from API
const loadUserProfile = async () => {
  try {
    loading.value = true;
    const response = await AdminService.getAdminProfile();
    if (response.success) {
      user.value = response.data;
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
    // Fallback to localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || '{}');
    if (storedUser) {
      user.value = storedUser;
    }
  } finally {
    loading.value = false;
  }
};

// Load notifications
const loadNotifications = async () => {
  try {
    const response = await AdminSimpleNotificationService.getNotifications(20);
    if (response.success) {
      notifications.value = response.data || [];
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
};

// Load unread count
const loadUnreadCount = async () => {
  try {
    const response = await AdminSimpleNotificationService.getUnreadCount();
    if (response.success) {
      unreadCount.value = response.data.count || 0;
    }
  } catch (error) {
    console.error('Error loading unread count:', error);
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    await AdminSimpleNotificationService.markAsRead(notificationId);
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification) {
      notification.is_read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

// Mark all notifications as read
const markAllAsRead = async () => {
  try {
    await AdminSimpleNotificationService.markAllAsRead();
    notifications.value.forEach(notification => {
      notification.is_read = true;
    });
    unreadCount.value = 0;
    showNotifications.value = false;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

// Handle notification click
const handleNotificationClick = async (notification) => {
  if (!notification.is_read) {
    await markNotificationAsRead(notification.id);
  }
  showNotifications.value = false;
  
  // Navigate based on notification type
  if (notification.booking_id) {
    router.push(`/admin/bookings`);
  } else if (notification.boat_id) {
    router.push(`/admin/fleetmanagement`);
  }
};

// Toggle notifications dropdown
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    loadNotifications();
  }
};

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// Close dropdowns when clicking outside
const closeDropdowns = (event) => {
  if (!event.target.closest('.notification-dropdown') && !event.target.closest('.user-menu-dropdown')) {
    showNotifications.value = false;
    showUserMenu.value = false;
  }
};

// Handle profile picture upload
const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const response = await AdminService.uploadProfilePicture(file);
    if (response.success) {
      user.value.profile_pic = response.data.profile_pic;
      localStorage.setItem('user', JSON.stringify(user.value));
      Swal.fire({
        title: 'Success',
        text: 'Profile picture updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to update profile picture',
      icon: 'error'
    });
  }
};

// Logout function with SweetAlert
const handleLogout = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f97316",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Logout"
  }).then((result) => {
    if (result.isConfirmed) {
      // Disconnect socket
      if (socket.value) {
        socket.value.disconnect();
      }
      
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Redirect to login
      router.push("/login");
      Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
    }
  });
};

// Lifecycle hooks
onMounted(async () => {
  await loadUserProfile();
  await loadUnreadCount();
  initializeSocket();
  
  // Add event listener for clicking outside
  document.addEventListener('click', closeDropdowns);
  
  // Load notifications every 30 seconds
  const notificationInterval = setInterval(loadUnreadCount, 30000);
  
  // Store interval for cleanup
  window.adminNotificationInterval = notificationInterval;
});

// Cleanup on unmount
onUnmounted(() => {
  if (window.adminNotificationInterval) {
    clearInterval(window.adminNotificationInterval);
  }
  document.removeEventListener('click', closeDropdowns);
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 font-sans">
    <!-- Mobile Sidebar -->
    <div
      :class="[
        'fixed inset-0 z-50 transition-opacity duration-300 lg:hidden',
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      ]"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-70"
        @click="sidebarOpen = false"
      ></div>

      <aside
        :class="[
          'relative w-72 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 shadow-2xl transform transition-transform duration-300 rounded-tr-3xl rounded-br-3xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- Mobile Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/20">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span class="text-2xl">🛡️</span>
            </div>
            <div>
            <h2 class="text-xl font-bold text-white">Admin Panel</h2>
              <p class="text-indigo-100 text-sm">System Management</p>
            </div>
          </div>
          <button
            class="p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition"
            @click="sidebarOpen = false"
          >
            <XMarkIcon class="w-6 h-6 text-white" />
          </button>
        </div>

        <!-- Mobile Navigation -->
        <nav class="space-y-2 p-6 flex-1">
          <RouterLink
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 hover:bg-white/20 hover:scale-105"
            :class="[
              route.path === item.to
                ? 'bg-white/30 text-white shadow-lg'
                : 'text-white/90 hover:text-white'
            ]"
            @click="sidebarOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </nav>

        <!-- Mobile User Info -->
        <div class="p-6 border-t border-white/20">
          <div class="flex items-center space-x-3 mb-4">
            <img
              :src="userProfileImage"
              :alt="userDisplayName"
              class="w-10 h-10 rounded-xl border-2 border-white shadow-md"
            />
            <div class="text-left">
              <p class="text-sm font-semibold text-white">{{ userDisplayName }}</p>
              <p class="text-xs text-indigo-100">Administrator</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>

    <!-- Desktop Sidebar -->
    <aside
      class="hidden lg:flex fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 shadow-2xl p-6 flex-col justify-between z-20"
    >
      <!-- Brand Section -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">🛡️</span>
        </div>
        <h2 class="text-2xl font-bold text-white">Admin Control</h2>
        <p class="text-indigo-100 text-sm">System Management</p>
      </div>

      <!-- Navigation -->
      <nav class="space-y-3 flex-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 hover:bg-white/20 hover:scale-105"
          :class="[
            route.path === item.to
              ? 'bg-white/30 text-white shadow-lg'
              : 'text-white/90 hover:text-white'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- User Info & Logout -->
      <div class="mt-auto space-y-4">
        <!-- User Profile -->
        <div class="flex items-center space-x-3 p-3 bg-white/10 rounded-2xl">
          <img
            :src="userProfileImage"
            :alt="userDisplayName"
            class="w-10 h-10 rounded-xl border-2 border-white shadow-md"
          />
          <div class="text-left flex-1">
            <p class="text-sm font-semibold text-white">{{ userDisplayName }}</p>
            <p class="text-xs text-indigo-100">Administrator</p>
          </div>
        </div>

      <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:ml-72">
      <!-- Modern Header -->
      <header
        class="h-20 bg-white/80 backdrop-blur-lg shadow-lg border-b border-indigo-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10"
      >
        <div class="flex items-center space-x-4">
          <button
            class="lg:hidden p-3 rounded-2xl hover:bg-gray-200 transition"
            @click="sidebarOpen = true"
          >
            <Bars3Icon class="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🛡️ Admin Control Center
            </h1>
            <p class="text-gray-600 text-sm hidden sm:block">System monitoring and management</p>
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Notifications Dropdown -->
          <div class="relative notification-dropdown">
            <button 
              @click="toggleNotifications"
              class="relative p-3 rounded-2xl bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BellIcon class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <span
                v-if="hasUnreadNotifications"
                class="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
          </button>
          
            <!-- Notifications Dropdown Menu -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
            >
              <!-- Notifications Header -->
              <div class="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-800">Notifications</h3>
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="hasUnreadNotifications"
                      @click="markAllAsRead"
                      class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mark all read
                    </button>
                    <span
                      v-if="hasUnreadNotifications"
                      class="w-2 h-2 bg-orange-500 rounded-full"
                    ></span>
                  </div>
                </div>
              </div>

              <!-- Notifications List -->
              <div class="max-h-80 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-6 text-center text-gray-500">
                  <BellIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  @click="handleNotificationClick(notification)"
                  class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  :class="{ 'bg-blue-50': !notification.is_read }"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                           :class="AdminSimpleNotificationService.getNotificationColor(notification.type)">
                        {{ AdminSimpleNotificationService.getNotificationIcon(notification.type) }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-gray-900 truncate">
                          {{ notification.title }}
                        </p>
                        <div class="flex items-center space-x-2">
                          <span v-if="!notification.is_read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span class="text-xs text-gray-500">
                            {{ AdminSimpleNotificationService.formatTimeAgo(notification.created_at) }}
                          </span>
                        </div>
                      </div>
                      <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                        {{ notification.message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- User Profile Dropdown -->
          <div class="relative user-menu-dropdown">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 sm:px-4 py-2 rounded-2xl cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <img
                :src="userProfileImage"
                :alt="userDisplayName"
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-white shadow-md"
              />
              <div class="text-left hidden sm:block">
              <p class="text-sm font-semibold text-gray-800">
                  {{ userDisplayName }}
              </p>
              <p class="text-xs text-gray-600">Administrator</p>
              </div>
              <ChevronDownIcon class="w-4 h-4 text-gray-600" />
            </button>

            <!-- User Menu Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50"
            >
              <!-- User Info -->
              <div class="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div class="flex items-center space-x-3">
                  <img
                    :src="userProfileImage"
                    :alt="userDisplayName"
                    class="w-12 h-12 rounded-xl border-2 border-white shadow-md"
                  />
                  <div class="flex-1">
                    <p class="font-semibold text-gray-800">{{ userDisplayName }}</p>
                    <p class="text-sm text-gray-600">{{ user.email }}</p>
                    <p class="text-xs text-indigo-600">Administrator</p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="py-2">    
                <RouterLink
                  to="/admin/settings"
                  @click="showUserMenu = false"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <Cog6ToothIcon class="w-5 h-5 text-gray-500" />
                  <span class="text-gray-700">Settings</span>
                </RouterLink>
              </div>

              <!-- Logout -->
              <div class="border-t border-gray-200 p-2">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200 rounded-xl"
                >
                  <ArrowRightOnRectangleIcon class="w-5 h-5 text-red-500" />
                  <span class="text-red-600 font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden">
        <RouterView />
      </main>
    </div>
  </div>
</template>
