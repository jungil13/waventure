<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TruckIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ArrowPathIcon,
  EyeIcon
} from "@heroicons/vue/24/outline";
import AdminReportsService from "@/services/adminReportsService";
import Swal from 'sweetalert2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  ArcElement,
  DoughnutController,
  PieController
} from 'chart.js';

// Reactive state for the component
const startDate = ref("");
const endDate = ref("");
const loading = ref(false);
const error = ref(null);

// Statistics data
const totalRevenue = ref(0);
const totalBookings = ref(0);
const activeBoats = ref(0);
const customerSatisfaction = ref(0);
const totalCustomers = ref(0);
const completedBookings = ref(0);
const pendingBookings = ref(0);
const cancelledBookings = ref(0);
const averageBookingValue = ref(0);
const topBoats = ref([]);
const paymentMethodStats = ref([]);
const locationStats = ref([]);
const recentActivity = ref([]);

// Chart data
const revenueData = ref([]);
const bookingData = ref([]);
const dashboardData = ref(null);

// Chart instances
const revenueChart = ref(null);
const bookingChart = ref(null);
const paymentMethodChart = ref(null);
const bookingStatusChart = ref(null);

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  ArcElement,
  DoughnutController,
  PieController
);

// Computed properties for growth indicators
const revenueGrowth = computed(() => {
  if (revenueData.value.length < 2) return 0;
  const current = revenueData.value[revenueData.value.length - 1]?.revenue || 0;
  const previous = revenueData.value[revenueData.value.length - 2]?.revenue || 0;
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
});

const bookingGrowth = computed(() => {
  if (revenueData.value.length < 2) return 0;
  const current = revenueData.value[revenueData.value.length - 1]?.bookings || 0;
  const previous = revenueData.value[revenueData.value.length - 2]?.bookings || 0;
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
});

// Functions to handle actions
const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await AdminReportsService.getDashboardData(
      startDate.value || null,
      endDate.value || null
    );
    
    if (response.success) {
      dashboardData.value = response.data;
      
      // Update statistics
      const stats = response.data.overallStats;
      totalRevenue.value = stats.totalRevenue;
      totalBookings.value = stats.totalBookings;
      activeBoats.value = stats.activeBoats;
      customerSatisfaction.value = stats.customerSatisfaction;
      totalCustomers.value = stats.totalCustomers;
      completedBookings.value = stats.completedBookings;
      pendingBookings.value = stats.pendingBookings;
      cancelledBookings.value = stats.cancelledBookings;
      
      // Calculate average booking value
      averageBookingValue.value = stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0;
      
      // Update additional data
      topBoats.value = response.data.topBoats || [];
      paymentMethodStats.value = response.data.paymentMethodStats || [];
      locationStats.value = response.data.locationStats || [];
      recentActivity.value = response.data.recentActivity || [];
      
      // Update chart data
      revenueData.value = response.data.revenueData;
      bookingData.value = response.data.bookingTrends;
      
      // Redraw charts after data is loaded
      await nextTick();
      createCharts();
    } else {
      throw new Error(response.message || 'Failed to fetch dashboard data');
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    error.value = err.message;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load reports data. Please try again.',
    });
  } finally {
    loading.value = false;
  }
};

const applyFilters = async () => {
  await fetchDashboardData();
};

// Create Chart.js charts
const createCharts = () => {
  createRevenueChart();
  createBookingChart();
  createPaymentMethodChart();
  createBookingStatusChart();
};

const createRevenueChart = () => {
  const ctx = document.getElementById('revenue-chart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (revenueChart.value) {
    revenueChart.value.destroy();
  }

  const data = revenueData.value;
  const labels = data.map(d => d.month);
  const revenueValues = data.map(d => d.revenue);
  const bookingValues = data.map(d => d.bookings);

  revenueChart.value = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Revenue (₱)',
          data: revenueValues,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Bookings',
          data: bookingValues,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 0) {
                return `Revenue: ₱${context.parsed.y.toLocaleString()}`;
              } else {
                return `Bookings: ${context.parsed.y}`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Month',
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            }
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Revenue (₱)',
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            callback: function(value) {
              return '₱' + (value / 1000).toFixed(0) + 'k';
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Bookings',
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            }
          }
        }
      }
    }
  });
};

const createBookingChart = () => {
  const ctx = document.getElementById('booking-chart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (bookingChart.value) {
    bookingChart.value.destroy();
  }

  const data = bookingData.value;
  const labels = data.map(d => d.day);
  const bookingValues = data.map(d => d.bookings);
  const revenueValues = data.map(d => d.revenue);

  bookingChart.value = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Bookings',
          data: bookingValues,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: '#22c55e',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Revenue (₱)',
          data: revenueValues,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 0) {
                return `Bookings: ${context.parsed.y}`;
              } else {
                return `Revenue: ₱${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Day of Week',
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            }
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Bookings',
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            stepSize: 1
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Revenue (₱)',
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            callback: function(value) {
              return '₱' + (value / 1000).toFixed(0) + 'k';
            }
          }
        }
      }
    }
  });
};

const createPaymentMethodChart = () => {
  const ctx = document.getElementById('payment-method-chart');
  if (!ctx) return;

  if (paymentMethodChart.value) {
    paymentMethodChart.value.destroy();
  }

  const data = paymentMethodStats.value;
  const labels = data.map(d => d.paymentMethod);
  const values = data.map(d => d.revenue);

  paymentMethodChart.value = new ChartJS(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ₱${context.parsed.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

const createBookingStatusChart = () => {
  const ctx = document.getElementById('booking-status-chart');
  if (!ctx) return;

  if (bookingStatusChart.value) {
    bookingStatusChart.value.destroy();
  }

  const data = [
    { status: 'Completed', count: completedBookings.value, color: '#10b981' },
    { status: 'Pending', count: pendingBookings.value, color: '#f59e0b' },
    { status: 'Cancelled', count: cancelledBookings.value, color: '#ef4444' }
  ];

  bookingStatusChart.value = new ChartJS(ctx, {
    type: 'pie',
    data: {
      labels: data.map(d => d.status),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: data.map(d => d.color),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

// Export functionality
const exportToPDF = () => {
  Swal.fire({
    title: 'Export to PDF',
    text: 'This feature will be available soon!',
    icon: 'info',
    confirmButtonText: 'OK'
  });
};

const printReport = () => {
  window.print();
};

onMounted(async () => {
  // Fetch initial data
  await fetchDashboardData();
});

onUnmounted(() => {
  // Clean up charts when component is unmounted
  if (revenueChart.value) {
    revenueChart.value.destroy();
  }
  if (bookingChart.value) {
    bookingChart.value.destroy();
  }
  if (paymentMethodChart.value) {
    paymentMethodChart.value.destroy();
  }
  if (bookingStatusChart.value) {
    bookingStatusChart.value.destroy();
  }
});
</script>
<template>
  <div class="p-4 md:p-8 min-h-screen font-sans text-gray-900 bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-sky-600 mb-2">Analytics Dashboard</h1>
          <p class="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div class="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            @click="exportToPDF"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <DocumentArrowDownIcon class="w-4 h-4" />
            Export PDF
          </button>
          <button
            @click="printReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <PrinterIcon class="w-4 h-4" />
            Print
          </button>
          <button
            @click="fetchDashboardData"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          type="date"
          v-model="startDate"
          class="p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <span class="text-gray-600 font-medium">to</span>
        <input
          type="date"
          v-model="endDate"
          class="p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          @click="applyFilters"
          :disabled="loading"
          class="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ loading ? 'Loading...' : 'Apply' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dashboardData" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
      <div class="flex items-center">
        <div class="text-red-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading data</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Revenue Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <h2 class="text-3xl font-bold text-gray-900 mt-2">₱{{ totalRevenue.toLocaleString() }}</h2>
            <div class="flex items-center text-sm mt-2" :class="revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
              <ArrowUpIcon v-if="revenueGrowth >= 0" class="w-4 h-4 mr-1" />
              <ArrowDownIcon v-else class="w-4 h-4 mr-1" />
              <span class="font-medium">{{ Math.abs(revenueGrowth) }}% from last month</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Bookings Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Bookings</p>
        <h2 class="text-3xl font-bold text-gray-900 mt-2">{{ totalBookings }}</h2>
            <div class="flex items-center text-sm mt-2" :class="bookingGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
              <ArrowUpIcon v-if="bookingGrowth >= 0" class="w-4 h-4 mr-1" />
              <ArrowDownIcon v-else class="w-4 h-4 mr-1" />
              <span class="font-medium">{{ Math.abs(bookingGrowth) }}% from last month</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CalendarIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Boats Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Boats</p>
        <h2 class="text-3xl font-bold text-gray-900 mt-2">{{ activeBoats }}</h2>
            <div class="flex items-center text-sm text-gray-500 mt-2">
              <span class="font-medium">Total registered boats</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TruckIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Customer Satisfaction Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Customer Satisfaction</p>
            <h2 class="text-3xl font-bold text-gray-900 mt-2">{{ customerSatisfaction.toFixed(1) }}/5</h2>
            <div class="flex items-center text-sm text-gray-500 mt-2">
              <span class="font-medium">Average rating</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <StarIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Metrics Row -->
    <div v-if="!loading || dashboardData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Customers Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-indigo-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Customers</p>
            <h2 class="text-2xl font-bold text-gray-900 mt-2">{{ totalCustomers }}</h2>
            <p class="text-xs text-gray-500 mt-1">Registered users</p>
          </div>
          <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon class="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      <!-- Average Booking Value Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg Booking Value</p>
            <h2 class="text-2xl font-bold text-gray-900 mt-2">₱{{ averageBookingValue.toLocaleString() }}</h2>
            <p class="text-xs text-gray-500 mt-1">Per booking</p>
          </div>
          <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      <!-- Completed Bookings Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-teal-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <h2 class="text-2xl font-bold text-gray-900 mt-2">{{ completedBookings }}</h2>
            <p class="text-xs text-gray-500 mt-1">Successful bookings</p>
          </div>
          <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-5 h-5 text-teal-600" />
          </div>
        </div>
      </div>

      <!-- Pending Bookings Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <h2 class="text-2xl font-bold text-gray-900 mt-2">{{ pendingBookings }}</h2>
            <p class="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
          </div>
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="!loading || dashboardData" class="space-y-8">
      <!-- Main Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Revenue Overview</h3>
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div class="relative h-80">
            <canvas id="revenue-chart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Booking Trends</h3>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarIcon class="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div class="relative h-80">
            <canvas id="booking-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Secondary Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Payment Methods</h3>
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon class="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div class="relative h-80">
            <canvas id="payment-method-chart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Booking Status</h3>
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div class="relative h-80">
            <canvas id="booking-status-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Data Sections -->
    <div v-if="!loading || dashboardData" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <!-- Top Performing Boats -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Top Performing Boats</h3>
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <TruckIcon class="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="(boat, index) in topBoats.slice(0, 5)" :key="boat.boatId" 
               class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {{ index + 1 }}
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ boat.boatName }}</h4>
                <p class="text-sm text-gray-600">{{ boat.ownerName }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">₱{{ boat.totalRevenue.toLocaleString() }}</p>
              <p class="text-sm text-gray-600">{{ boat.totalBookings }} bookings</p>
            </div>
          </div>
          <div v-if="topBoats.length === 0" class="text-center py-8 text-gray-500">
            <TruckIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No boat data available</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="activity in recentActivity.slice(0, 5)" :key="activity.id" 
               class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="activity.activityType === 'booking' ? 'bg-blue-100' : 'bg-yellow-100'">
              <CalendarIcon v-if="activity.activityType === 'booking'" class="w-4 h-4 text-blue-600" />
              <StarIcon v-else class="w-4 h-4 text-yellow-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ activity.customerName }} - {{ activity.boatName }}
              </p>
              <p class="text-xs text-gray-600">{{ activity.status }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ new Date(activity.createdAt).toLocaleDateString() }}</p>
              <p v-if="activity.amount > 0" class="text-sm font-semibold text-gray-900">₱{{ activity.amount.toLocaleString() }}</p>
            </div>
          </div>
          <div v-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
            <ClockIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
