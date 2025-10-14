<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4 sm:p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Captain's Dashboard</h1>
            <p class="text-sm sm:text-base lg:text-xl opacity-90">Welcome back! Here's your fleet performance overview and recent activity.</p>
          </div>
          <button 
            @click="fetchDashboardData"
            :disabled="loading"
            class="bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{{ loading ? 'Refreshing...' : 'Refresh' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span class="text-white text-lg">Loading dashboard data...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/20 border border-red-500/30 rounded-3xl p-6 mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">⚠️</span>
          </div>
          <div>
            <h3 class="text-red-400 font-semibold">Error Loading Dashboard</h3>
            <p class="text-gray-300 text-sm">{{ error }}</p>
            <p class="text-gray-400 text-xs mt-1">Using fallback data from database</p>
          </div>
        </div>
        <button 
          @click="fetchDashboardData"
          class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          🔄 Retry
        </button>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <!-- Total Boats -->
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
        <div>
            <p class="text-xs sm:text-sm font-medium text-gray-300 mb-1">🚤 Total Boats</p>
            <h2 class="text-2xl sm:text-3xl font-bold text-white">{{ dashboardData.totalBoats }}</h2>
            <p class="text-xs text-green-400 mt-1">Active fleet</p>
          </div>
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <ChartBarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
      </div>

      <!-- Total Bookings -->
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
        <div>
            <p class="text-xs sm:text-sm font-medium text-gray-300 mb-1">📅 Total Bookings</p>
            <h2 class="text-2xl sm:text-3xl font-bold text-white">{{ dashboardData.totalBookings }}</h2>
            <p class="text-xs text-green-400 mt-1">Total bookings</p>
          </div>
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <CalendarDaysIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
      </div>

      <!-- Average Ratings -->
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
        <div>
            <p class="text-xs sm:text-sm font-medium text-gray-300 mb-1">⭐ Avg. Ratings</p>
            <h2 class="text-2xl sm:text-3xl font-bold text-white">{{ dashboardData.avgRating.toFixed(1) }}</h2>
            <p class="text-xs text-yellow-400 mt-1">{{ dashboardData.totalReviews }} reviews</p>
          </div>
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <StarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
      </div>

      <!-- Monthly Earnings -->
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
        <div>
            <p class="text-xs sm:text-sm font-medium text-gray-300 mb-1">💰 Monthly Earnings</p>
            <h2 class="text-2xl sm:text-3xl font-bold text-white">₱{{ dashboardData.monthlyEarnings.toLocaleString() }}</h2>
            <p class="text-xs text-green-400 mt-1">+{{ dashboardData.revenueGrowth }}% from last month</p>
          </div>
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
        <router-link to="/owner/myboats" class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-white">Add New Boat</h3>
            <p class="text-xs sm:text-sm text-gray-300">Register a new boat to your fleet</p>
          </div>
        </router-link>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300" >
        <router-link to="/owner/earnings" class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-white">View Reports</h3>
            <p class="text-xs sm:text-sm text-gray-300">Check your earnings and analytics</p>
          </div>
        </router-link>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
        <router-link to="/owner/settings" class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-white">Settings</h3>
            <p class="text-xs sm:text-sm text-gray-300">Manage your account preferences</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Enhanced Recent Bookings Table -->
    <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-white/20">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <h2 class="text-xl sm:text-2xl font-bold text-white">📋 Recent Bookings</h2>
          <RouterLink to="/owner/bookings"  class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base text-center">
            View All Bookings
          </RouterLink>
        </div>
      </div>
      
  <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-gray-100">
          <thead class="bg-white/5">
            <tr>
              <th class="p-2 sm:p-4 text-left font-semibold text-gray-300">Booking ID</th>
              <th class="p-2 sm:p-4 text-left font-semibold text-gray-300">Boat</th>
              <th class="p-2 sm:p-4 text-left font-semibold text-gray-300 hidden sm:table-cell">Customer</th>
              <th class="p-2 sm:p-4 text-left font-semibold text-gray-300">Date</th>
              <th class="p-2 sm:p-4 text-left font-semibold text-gray-300">Status</th>
              <th class="p-2 sm:p-4 text-left font-semibold text-gray-300 hidden sm:table-cell">Payment</th>
        </tr>
      </thead>
      <tbody>
            <tr v-for="(booking, i) in bookings" :key="i" class="border-b border-white/10 hover:bg-white/5 transition-all duration-200">
              <td class="p-2 sm:p-4 font-medium text-orange-400">#{{ booking.id }}</td>
              <td class="p-2 sm:p-4">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <img :src="booking.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'" alt="Boat" class="w-8 h-8 sm:w-12 sm:h-12 rounded-xl object-cover shadow-lg" @error="handleImageError" />
                  <div>
                    <p class="font-semibold text-white text-xs sm:text-sm">{{ booking.boat }}</p>
                    <p class="text-xs text-gray-400 hidden sm:block">{{ booking.boatType || 'Boat' }}</p>
                  </div>
                </div>
              </td>
              <td class="p-2 sm:p-4 hidden sm:table-cell">
                <div>
                  <p class="font-semibold text-white">{{ booking.customer }}</p>
                  <p class="text-xs text-gray-400">Regular Customer</p>
                </div>
              </td>
              <td class="p-2 sm:p-4">
                <div>
                  <p class="font-semibold text-white text-xs sm:text-sm">{{ dashboardService.formatDate(booking.date) }}</p>
                  <p class="text-xs text-gray-400 hidden sm:block">{{ dashboardService.formatTime(booking.time) || 'Full Day' }}</p>
                </div>
          </td>
              <td class="p-2 sm:p-4">
            <span
                  :class="{
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': booking.status === 'Pending',
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30': booking.status === 'Confirmed',
                    'bg-green-500/20 text-green-400 border border-green-500/30': booking.status === 'Completed',
                    'bg-red-500/20 text-red-400 border border-red-500/30': booking.status === 'Cancelled'
                  }" 
                  class="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold"
            >
              {{ booking.status }}
            </span>
          </td>
              <td class="p-2 sm:p-4 hidden sm:table-cell">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <img v-if="booking.payment === 'GCash'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSU3hFvvnNeFYhsNG6n4Yz6BU4_xWbFM1dbA&s" class="w-4 h-4 sm:w-6 sm:h-6" alt="GCash" />
                    <img v-else src="https://img.icons8.com/color/48/cash.png" class="w-4 h-4 sm:w-6 sm:h-6" alt="Cash" />
                  </div>
                  <span class="text-white font-medium text-xs sm:text-sm">{{ booking.payment === 'COD' ? 'Cash' : booking.payment }}</span>
                </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { dashboardService } from "@/services/dashboardService";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  StarIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from "@heroicons/vue/24/outline";

// Reactive data
const dashboardData = ref({
  totalBoats: 0,
  totalBookings: 0,
  avgRating: 0,
  totalReviews: 0,
  monthlyEarnings: 0,
  revenueGrowth: 0,
  recentBookings: []
});
const loading = ref(false);
const error = ref(null);

// Get current owner ID from localStorage or context
const getCurrentOwnerId = () => {
  // This should be replaced with actual authentication logic
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.user_id || 2; // Default to owner ID 2 for testing
};

// API Functions
const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const ownerId = getCurrentOwnerId();
    console.log('Fetching dashboard data for owner ID:', ownerId);
    
    const data = await dashboardService.getOwnerDashboardData(ownerId);
    console.log('Dashboard data received:', data);
    dashboardData.value = data;
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    error.value = "Failed to fetch dashboard data. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Computed properties
const bookings = computed(() => dashboardData.value.recentBookings);

// Helper functions
const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
};

// Initialize component
onMounted(async () => {
  AOS.init({ duration: 1000, once: true });
  await fetchDashboardData();
});
</script>
