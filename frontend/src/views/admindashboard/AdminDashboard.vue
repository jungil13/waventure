<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Chart, registerables } from 'chart.js';
import AdminDashboardService from "@/services/adminDashboardService";

// Register Chart.js components
Chart.register(...registerables);

// Define reactive data for dashboard metrics
const totalBookings = ref(0);
const bookingChange = ref('0% From Last Month');
const activeBoats = ref(0);
const activeBoatsChange = ref('0% From Last Week');
const revenue = ref(0);
const revenueChange = ref('0% From Last Month');
const customerSatisfaction = ref(0);
const customerSatisfactionChange = ref('0.0 Improvement');

const systemActivities = ref([]);
const loading = ref(true);

// Chart data
const bookingStats = ref([]);
const userStats = ref([]);
const boatStatusStats = ref([]);
const paymentStats = ref([]);

// Chart references
const bookingChart = ref(null);
const userChart = ref(null);
const boatStatusChart = ref(null);
const paymentChart = ref(null);

// Function to fetch real data from backend
const fetchData = async () => {
  try {
    loading.value = true;
    console.log("Fetching dashboard data...");
    
    const response = await AdminDashboardService.getAllDashboardData();
    
    if (response?.success) {
      const { overview, activities, charts } = response.data;
      
      // Update overview metrics
      totalBookings.value = overview.totalBookings;
      bookingChange.value = overview.bookingChange;
      activeBoats.value = overview.activeBoats;
      activeBoatsChange.value = overview.activeBoatsChange;
      revenue.value = overview.revenue;
      revenueChange.value = overview.revenueChange;
      customerSatisfaction.value = overview.customerSatisfaction;
      customerSatisfactionChange.value = overview.customerSatisfactionChange;
      
      // Update system activities
      systemActivities.value = activities.map(activity => ({
        date: new Date(activity.date).toLocaleDateString(),
        description: activity.description,
        type: activity.activity_type
      }));
      
      // Update chart data
      bookingStats.value = charts.bookingStats || [];
      userStats.value = charts.userStats || [];
      boatStatusStats.value = charts.boatStatusStats || [];
      paymentStats.value = charts.paymentStats || [];
      
      // Charts will be initialized in onMounted after DOM is ready
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
    } else {
      alert('Failed to load dashboard data. Please refresh the page.');
    }
  } finally {
    loading.value = false;
  }
};

// Initialize charts
const initializeCharts = (chartsData) => {
  console.log('Initializing charts with data:', chartsData);
  
  // Booking Stats Chart (Line Chart)
  const ctx1 = document.getElementById('bookingChart');
  console.log('Booking chart canvas element:', ctx1);
  if (ctx1 && !bookingChart.value) {
    const bookingData = chartsData.bookingStats && chartsData.bookingStats.length > 0 
      ? chartsData.bookingStats 
      : [{ date: new Date().toISOString(), bookings_count: 0 }];
    
    bookingChart.value = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: bookingData.map(stat => new Date(stat.date).toLocaleDateString()),
        datasets: [{
          label: 'Bookings',
          data: bookingData.map(stat => stat.bookings_count),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Daily Bookings (Last 30 Days)'
          }
        }
      }
    });
    console.log('Booking chart created');
  }

  // User Stats Chart (Doughnut Chart)
  const ctx2 = document.getElementById('userChart');
  console.log('User chart canvas element:', ctx2);
  if (ctx2 && !userChart.value) {
    const userData = chartsData.userStats && chartsData.userStats.length > 0 
      ? chartsData.userStats 
      : [{ user_type: 'No Data', count: 1 }];
    
    userChart.value = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: userData.map(stat => stat.user_type),
        datasets: [{
          data: userData.map(stat => stat.count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'User Distribution'
          }
        }
      }
    });
    console.log('User chart created');
  }

  // Boat Status Chart (Bar Chart)
  const ctx3 = document.getElementById('boatStatusChart');
  console.log('Boat status chart canvas element:', ctx3);
  if (ctx3 && !boatStatusChart.value) {
    const boatData = chartsData.boatStatusStats && chartsData.boatStatusStats.length > 0 
      ? chartsData.boatStatusStats 
      : [{ status: 'No Data', count: 1 }];
    
    boatStatusChart.value = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: boatData.map(stat => stat.status),
        datasets: [{
          label: 'Boats',
          data: boatData.map(stat => stat.count),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Boat Status Distribution'
          }
        }
      }
    });
    console.log('Boat status chart created');
  }

  // Payment Stats Chart (Pie Chart)
  const ctx4 = document.getElementById('paymentChart');
  console.log('Payment chart canvas element:', ctx4);
  if (ctx4 && !paymentChart.value) {
    const paymentData = chartsData.paymentStats && chartsData.paymentStats.length > 0 
      ? chartsData.paymentStats 
      : [{ payment_status: 'No Data', count: 1 }];
    
    paymentChart.value = new Chart(ctx4, {
      type: 'pie',
      data: {
        labels: paymentData.map(stat => stat.payment_status),
        datasets: [{
          data: paymentData.map(stat => stat.count),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Payment Status Distribution'
          }
        }
      }
    });
    console.log('Payment chart created');
  }
};

onMounted(async () => {
  await fetchData();
  // Wait for DOM to be fully rendered before initializing charts
  await nextTick();
  setTimeout(() => {
    if (bookingChart.value || userChart.value || boatStatusChart.value || paymentChart.value) {
      console.log('Charts already initialized');
      return;
    }
    initializeCharts({
      bookingStats: bookingStats.value,
      userStats: userStats.value,
      boatStatusStats: boatStatusStats.value,
      paymentStats: paymentStats.value
    });
  }, 100);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
    <!-- Welcome Header -->
    <div class="mb-8" data-aos="fade-down">
      <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">🛡️ Admin Control Center</h1>
        <p class="text-xl opacity-90">Monitor and manage your entire island hopping platform from here.</p>
      </div>
    </div>

    <!-- Enhanced Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Bookings Card -->
      <div class="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" data-aos="zoom-in">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">📊 Total Bookings</p>
            <h2 class="text-3xl font-bold text-indigo-600 mb-1">{{ totalBookings }}</h2>
            <p class="text-sm text-green-600 font-semibold">{{ bookingChange }}</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Boats Card -->
      <div class="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" data-aos="zoom-in" data-aos-delay="100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">🚤 Active Boats</p>
            <h2 class="text-3xl font-bold text-blue-600 mb-1">{{ activeBoats }}</h2>
            <p class="text-sm text-green-600 font-semibold">{{ activeBoatsChange }}</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" data-aos="zoom-in" data-aos-delay="200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">💰 Revenue</p>
            <h2 class="text-3xl font-bold text-green-600 mb-1">₱{{ revenue.toLocaleString() }}</h2>
            <p class="text-sm text-green-600 font-semibold">{{ revenueChange }}</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Customer Satisfaction Card -->
      <div class="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" data-aos="zoom-in" data-aos-delay="300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">⭐ Satisfaction</p>
            <h2 class="text-3xl font-bold text-yellow-600 mb-1">{{ customerSatisfaction }}/5</h2>
            <p class="text-sm text-green-600 font-semibold">{{ customerSatisfactionChange }}</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p class="text-gray-600 text-lg">Loading dashboard data...</p>
    </div>

    <!-- Charts Section -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Booking Trends Chart -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-aos="fade-up">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
          <h2 class="text-2xl font-bold">📈 Booking Trends</h2>
          <p class="text-indigo-100">Daily booking statistics for the last 30 days</p>
        </div>
        <div class="p-6 h-64">
          <canvas id="bookingChart"></canvas>
        </div>
      </div>

      <!-- User Distribution Chart -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
        <div class="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
          <h2 class="text-2xl font-bold">👥 User Distribution</h2>
          <p class="text-blue-100">Breakdown of user types in the system</p>
        </div>
        <div class="p-6 h-64">
          <canvas id="userChart"></canvas>
        </div>
      </div>

      <!-- Boat Status Chart -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="200">
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
          <h2 class="text-2xl font-bold">🚤 Boat Status</h2>
          <p class="text-green-100">Current status of all boats in the system</p>
        </div>
        <div class="p-6 h-64">
          <canvas id="boatStatusChart"></canvas>
        </div>
      </div>

      <!-- Payment Status Chart -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="300">
        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <h2 class="text-2xl font-bold">💳 Payment Status</h2>
          <p class="text-yellow-100">Payment status distribution across bookings</p>
        </div>
        <div class="p-6 h-64">
          <canvas id="paymentChart"></canvas>
        </div>
      </div>
    </div>

    <!-- System Activity -->
    <div v-if="!loading" class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-aos="fade-up">
      <div class="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">📊 System Activity</h2>
            <p class="text-green-100">Recent platform activities and events</p>
          </div>
          <button class="bg-white/20 text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200">
            View All
          </button>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div v-if="systemActivities.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <p class="text-gray-500">No recent activities to display</p>
        </div>
        <div
          v-for="(activity, index) in systemActivities"
          :key="index"
          class="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" :class="{
              'bg-green-100': activity.type === 'success',
              'bg-yellow-100': activity.type === 'warning',
              'bg-blue-100': activity.type === 'info',
              'bg-red-100': activity.type === 'error',
            }">
              <span class="text-sm" :class="{
                'text-green-600': activity.type === 'success',
                'text-yellow-600': activity.type === 'warning',
                'text-blue-600': activity.type === 'info',
                'text-red-600': activity.type === 'error',
              }">
                {{ activity.type === 'success' ? '✅' : activity.type === 'warning' ? '⚠️' : activity.type === 'info' ? 'ℹ️' : '❌' }}
              </span>
            </div>
            <div class="flex-1">
              <p class="text-xs text-gray-500 mb-1">{{ activity.date }}</p>
              <p class="font-medium text-gray-800">{{ activity.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* No custom styles needed, Tailwind handles everything */
</style>
