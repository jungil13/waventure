<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">Earnings Dashboard</h1>
        <p class="text-xl opacity-90">Track your revenue and financial performance</p>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">💰 Total Revenue</p>
            <h2 class="text-3xl font-bold text-white">₱{{ totalRevenue.toLocaleString() }}</h2>
            <p class="text-xs text-green-400 mt-1">+{{ stats.revenueGrowth }}% from last month</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">📊 Total Bookings</p>
            <h2 class="text-3xl font-bold text-white">{{ totalBookings }}</h2>
            <p class="text-xs text-blue-400 mt-1">+{{ stats.bookingGrowth }} this month</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">📈 Avg. Booking Value</p>
            <h2 class="text-3xl font-bold text-white">₱{{ avgBookingValue.toLocaleString() }}</h2>
            <p class="text-xs text-purple-400 mt-1">Average per booking</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Button -->
    <div class="flex justify-end mb-6">
      <button
        @click="exportData"
        class="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Enhanced Filters -->
    <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center space-x-4">
          <label class="text-white font-semibold"> Filter by Date:</label>
          <input 
            type="month" 
            v-model="filterMonth" 
            class="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
          />
        </div>
        <div class="mt-4 sm:mt-0">
          <span class="text-gray-300 text-sm">Showing {{ paginatedBookings.length }} of {{ pagination.totalItems }} bookings</span>
        </div>
      </div>
      </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span class="text-white text-lg">Loading earnings data...</span>
      </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/20 border border-red-500/30 rounded-3xl p-6 mb-8">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <span class="text-white text-lg">⚠️</span>
        </div>
        <div>
          <h3 class="text-red-400 font-semibold">Error Loading Earnings</h3>
          <p class="text-gray-300 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Bookings Table -->
    <div v-else class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div class="p-6 border-b border-white/20">
        <h2 class="text-2xl font-bold text-white"> Booking History</h2>
        <p class="text-gray-300">Detailed view of all your bookings and earnings</p>
      </div>

      <!-- Desktop Table -->
      <div class="overflow-x-auto hidden sm:block">
        <table class="w-full text-sm text-gray-100">
          <thead class="bg-white/5">
            <tr>
              <th class="p-4 text-left font-semibold text-gray-300">Booking ID</th>
              <th class="p-4 text-left font-semibold text-gray-300">Boat</th>
              <th class="p-4 text-left font-semibold text-gray-300">Customer</th>
              <th class="p-4 text-left font-semibold text-gray-300">Date</th>
              <th class="p-4 text-left font-semibold text-gray-300">Amount</th>
              <th class="p-4 text-left font-semibold text-gray-300">Status</th>
              <th class="p-4 text-left font-semibold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="booking in paginatedBookings"
              :key="booking.id"
              class="border-b border-white/10 hover:bg-white/5 transition-all duration-200"
            >
              <td class="p-4 font-medium text-orange-400">#{{ booking.id }}</td>
              <td class="p-4">
                <div class="flex items-center space-x-3">
                  <span class="font-semibold text-white">{{ booking.boat }}</span>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-xs">{{ booking.customer.charAt(0) }}</span>
                  </div>
                  <span class="font-semibold text-white">{{ booking.customer }}</span>
                </div>
              </td>
              <td class="p-4">
                <div>
                  <p class="font-semibold text-white">{{ dashboardService.formatDate(booking.date) }}</p>
                  <p class="text-xs text-gray-400">{{ dashboardService.formatTime(booking.time) || 'Full Day' }}</p>
                </div>
              </td>
              <td class="p-4">
                <div>
                  <p class="font-bold text-green-400">₱{{ booking.amount.toLocaleString() }}</p>
                  <p class="text-xs text-gray-400">Revenue</p>
                </div>
              </td>
              <td class="p-4">
                <span
                  :class="booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ booking.status }}
                </span>
              </td>
              <td class="p-4">
                <button 
                  @click="viewBookingDetails(booking)"
                  class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>View</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card Layout -->
      <div class="space-y-4 p-6 sm:hidden">
        <div
          v-for="booking in paginatedBookings"
          :key="booking.id"
          class="bg-white/5 rounded-2xl p-4 border border-white/10"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-bold text-orange-400">#{{ booking.id }}</span>
            <span
              :class="booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'"
              class="px-3 py-1 rounded-full text-xs font-semibold"
            >
              {{ booking.status }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Boat:</span>
              <span class="text-white font-medium">{{ booking.boat }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Customer:</span>
              <span class="text-white font-medium">{{ booking.customer }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Date:</span>
              <span class="text-white font-medium">{{ dashboardService.formatDate(booking.date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Time:</span>
              <span class="text-white font-medium">{{ dashboardService.formatTime(booking.time) || 'Full Day' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Amount:</span>
              <span class="text-green-400 font-bold">₱{{ booking.amount.toLocaleString() }}</span>
            </div>
          </div>
          <button 
            @click="viewBookingDetails(booking)"
            class="mt-3 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>View Details</span>
          </button>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div class="flex justify-between items-center p-6 border-t border-white/20">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Previous</span>
        </button>
        <div class="flex items-center space-x-2">
          <span class="text-white font-medium">Page</span>
          <span class="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold">{{ currentPage }}</span>
          <span class="text-white font-medium">of {{ totalPages }}</span>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200"
        >
          <span>Next</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 class="text-2xl font-bold text-white flex items-center space-x-2">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Booking Details</span>
            </h2>
            <p class="text-gray-300 text-sm mt-1">Earnings information and booking details</p>
          </div>
          <button 
            @click="closeModal"
            class="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Basic Information</span>
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Booking ID:</span>
                <span class="text-white font-medium">#{{ selectedBooking.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Boat:</span>
                <span class="text-white font-medium">{{ selectedBooking.boat }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Customer:</span>
                <span class="text-white font-medium">{{ selectedBooking.customer }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Date:</span>
                <span class="text-white font-medium">{{ dashboardService.formatDate(selectedBooking.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Time:</span>
                <span class="text-white font-medium">{{ dashboardService.formatTime(selectedBooking.time) || 'Full Day' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Status:</span>
                <span 
                  :class="selectedBooking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'"
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {{ selectedBooking.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Financial Information -->
          <div class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              <span>Financial Information</span>
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Total Amount:</span>
                <span class="text-green-400 font-bold text-lg">₱{{ selectedBooking.amount?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Payment Method:</span>
                <span class="text-white font-medium">{{ selectedBooking.paymentMethod || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Payment Status:</span>
                <span class="text-white font-medium">{{ selectedBooking.paymentStatus || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Duration:</span>
                <span class="text-white font-medium">{{ selectedBooking.durationOption || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Details -->
          <div v-if="selectedBooking.island || selectedBooking.foodPackage || selectedBooking.addons" class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Additional Details</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div v-if="selectedBooking.island" class="flex justify-between">
                <span class="text-gray-400">Island:</span>
                <span class="text-white font-medium">{{ selectedBooking.island }}</span>
              </div>
              <div v-if="selectedBooking.foodPackage" class="flex justify-between">
                <span class="text-gray-400">Food Package:</span>
                <span class="text-white font-medium">{{ selectedBooking.foodPackage }}</span>
              </div>
              <div v-if="selectedBooking.addons" class="flex justify-between">
                <span class="text-gray-400">Add-ons:</span>
                <span class="text-white font-medium">{{ selectedBooking.addons }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-4 p-6 border-t border-white/20">
          <button
            @click="closeModal"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200"
          >
            Close
        </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { earningsService } from "@/services/earningsService";
import { dashboardService } from "@/services/dashboardService";

// Reactive data
const bookings = ref([]);
const stats = ref({
  totalRevenue: 0,
  totalBookings: 0,
  avgBookingValue: 0,
  revenueGrowth: 0,
  bookingGrowth: 0
});
const loading = ref(false);
const error = ref(null);
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10
});

// Filter
const filterMonth = ref("");

// Modal state
const showBookingModal = ref(false);
const selectedBooking = ref({});

// Get current owner ID from localStorage or context
const getCurrentOwnerId = () => {
  // This should be replaced with actual authentication logic
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.user_id || 2; // Default to owner ID 2 for testing
};

// Computed properties
const totalRevenue = computed(() => stats.value.totalRevenue);
const totalBookings = computed(() => stats.value.totalBookings);
const avgBookingValue = computed(() => stats.value.avgBookingValue);

// Pagination computed properties
const currentPage = computed(() => pagination.value.currentPage);
const totalPages = computed(() => pagination.value.totalPages);
const paginatedBookings = computed(() => bookings.value);

// API Functions
const fetchOwnerEarnings = async () => {
  try {
    loading.value = true;
    error.value = null;
    const ownerId = getCurrentOwnerId();
    
    // Prepare date filter
    let dateOptions = {};
    if (filterMonth.value) {
      const [year, month] = filterMonth.value.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateOptions = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }
    
    // Fetch earnings data
    const earningsResponse = await earningsService.getOwnerEarnings(ownerId, {
      ...dateOptions,
      page: pagination.value.currentPage,
      limit: pagination.value.itemsPerPage
    });
    
    bookings.value = earningsResponse.earnings;
    pagination.value = earningsResponse.pagination;
    
    // Fetch stats
    const statsResponse = await earningsService.getOwnerEarningsStats(ownerId, dateOptions);
    stats.value = statsResponse;
    
  } catch (err) {
    console.error("Error fetching earnings:", err);
    error.value = "Failed to fetch earnings data. Please try again.";
    // Fallback to mock data for development
    bookings.value = [
  { id: "B001", boat: "Sea Explorer", customer: "Juan Dela Cruz", date: "2025-07-20", amount: 5000, status: "Confirmed" },
  { id: "B002", boat: "Island Hopper", customer: "Maria Santos", date: "2025-08-05", amount: 3500, status: "Pending" },
  { id: "B003", boat: "Ocean Breeze", customer: "Carlos Reyes", date: "2025-08-15", amount: 4200, status: "Confirmed" },
  { id: "B004", boat: "Sunset Rider", customer: "Ana Cruz", date: "2025-08-20", amount: 6000, status: "Confirmed" },
    ];
    stats.value = {
      totalRevenue: 18700,
      totalBookings: 4,
      avgBookingValue: 4675,
      revenueGrowth: 15,
      bookingGrowth: 8
    };
  } finally {
    loading.value = false;
  }
};

// Export CSV
const exportData = async () => {
  try {
    const ownerId = getCurrentOwnerId();
    
    // Prepare date filter
    let dateOptions = {};
    if (filterMonth.value) {
      const [year, month] = filterMonth.value.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateOptions = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }
    
    await earningsService.exportOwnerEarnings(ownerId, {
      ...dateOptions,
      format: 'csv'
    });
  } catch (err) {
    console.error("Error exporting data:", err);
    error.value = "Failed to export data. Please try again.";
  }
};

// Pagination functions
const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++;
    fetchOwnerEarnings();
  }
};

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--;
    fetchOwnerEarnings();
  }
};

// View booking details
const viewBookingDetails = (booking) => {
  selectedBooking.value = { ...booking };
  showBookingModal.value = true;
};

// Close modal
const closeModal = () => {
  showBookingModal.value = false;
  selectedBooking.value = {};
};

// Watch for filter changes
watch(filterMonth, () => {
  pagination.value.currentPage = 1;
  fetchOwnerEarnings();
});

// Initialize component
onMounted(async () => {
  AOS.init({ duration: 1000, once: true });
  await fetchOwnerEarnings();
});
</script>
