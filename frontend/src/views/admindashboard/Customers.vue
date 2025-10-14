<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { 
  MagnifyingGlassIcon, 
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  EyeIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/vue/24/outline";
import AdminCustomerService from "@/services/adminCustomerService";
import Swal from 'sweetalert2';

// Reactive state for the component
const searchQuery = ref("");
const selectedLocation = ref("");
const customers = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(true);
const totalPages = ref(1);
const totalCount = ref(0);

// Modal states
const showCustomerModal = ref(false);
const selectedCustomer = ref(null);
const loadingCustomerDetails = ref(false);

// Fetch customers from backend
const fetchCustomers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value,
      location: selectedLocation.value
    };

    const response = await AdminCustomerService.getAllCustomers(params);
    
    if (response.success) {
      customers.value = response.data.customers;
      totalPages.value = response.data.pagination.totalPages;
      totalCount.value = response.data.pagination.totalCount;
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load customers. Please refresh the page.',
    });
  } finally {
    loading.value = false;
  }
};

// Watch for changes in filters and reset pagination
watch([searchQuery, selectedLocation], () => {
  currentPage.value = 1;
  fetchCustomers();
});

// Watch for page changes
watch(currentPage, () => {
  fetchCustomers();
});

// View customer details
const viewCustomerDetails = async (customer) => {
  try {
    console.log('Fetching details for customer:', customer);
    const response = await AdminCustomerService.getCustomerById(customer.user_id);
    console.log('Customer details response:', response);
    
    if (response.success) {
      selectedCustomer.value = response.data;
      showCustomerModal.value = true;
      console.log('Modal opened with customer:', selectedCustomer.value);
      console.log('showCustomerModal state:', showCustomerModal.value);
    } else {
      console.error('API returned error:', response.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message || 'Failed to fetch customer details.',
      });
    }
  } catch (error) {
    console.error('Error fetching customer details:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load customer details.',
    });
  }
};

// Close modal function
const closeModal = () => {
  showCustomerModal.value = false;
  selectedCustomer.value = null;
};

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  goToPage(currentPage.value + 1);
};

const prevPage = () => {
  goToPage(currentPage.value - 1);
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Get status color based on activity
const getStatusColor = (lastActivity) => {
  if (!lastActivity) return 'bg-gray-100 text-gray-800';
  
  const lastActivityDate = new Date(lastActivity);
  const now = new Date();
  const daysDiff = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) return 'bg-green-100 text-green-800';
  if (daysDiff <= 90) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// Get status text based on activity
const getStatusText = (lastActivity) => {
  if (!lastActivity) return 'Inactive';
  
  const lastActivityDate = new Date(lastActivity);
  const now = new Date();
  const daysDiff = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) return 'Active';
  if (daysDiff <= 90) return 'Moderate';
  return 'Inactive';
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/100x100/cccccc/333333?text=N/A';
  event.target.onerror = null; // Prevent infinite loop
};

// Print functionality
const printCustomerDetails = () => {
  if (!selectedCustomer.value) return;
  
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Customer Details - ${selectedCustomer.value.full_name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-weight: 600; color: #6b7280; }
        .info-value { color: #111827; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-active { background-color: #dcfce7; color: #166534; }
        .status-inactive { background-color: #fee2e2; color: #991b1b; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-card { background-color: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
        .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background-color: #f9fafb; font-weight: 600; color: #374151; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Customer Details</h1>
        <p>Customer: ${selectedCustomer.value.full_name}</p>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="info-grid">
        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-item">
            <span class="info-label">Name:</span><br>
            <span class="info-value">${selectedCustomer.value.full_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span><br>
            <span class="info-value">${selectedCustomer.value.email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span><br>
            <span class="info-value">${selectedCustomer.value.phone_number || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Location:</span><br>
            <span class="info-value">${selectedCustomer.value.location || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span><br>
            <span class="status-badge status-${getStatusText(selectedCustomer.value.last_activity).toLowerCase()}">${getStatusText(selectedCustomer.value.last_activity)}</span>
          </div>
        </div>

        <div class="section">
          <h3>Statistics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${selectedCustomer.value.total_bookings || 0}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${selectedCustomer.value.completed_bookings || 0}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₱${selectedCustomer.value.total_spent || 0}</div>
              <div class="stat-label">Total Spent</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${formatDate(selectedCustomer.value.last_booking_date)}</div>
              <div class="stat-label">Last Booking</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Booking History</h3>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Date</th>
              <th>Boat</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${selectedCustomer.value.booking_history.map(booking => `
              <tr>
                <td>${booking.booking_id}</td>
                <td>${formatDate(booking.booking_date)}</td>
                <td>${booking.boat_name}</td>
                <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                <td>₱${booking.total_price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>This document was generated from the Island Boat Rental Management System</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

onMounted(() => {
  fetchCustomers();
});
</script>
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Customers Management</h1>
          <p class="mt-2 text-sm text-gray-600">Manage and monitor all customers</p>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center space-x-4">
          <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span class="text-sm text-gray-600">Total: </span>
            <span class="font-semibold text-gray-900">{{ totalCount }}</span>
          </div>
          <button
            @click="fetchCustomers"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Search Bar -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search customers..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <!-- Location Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div class="relative">
            <input
              type="text"
              v-model="selectedLocation"
              placeholder="Filter by location..."
              class="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Customer Cards Grid -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="customers.length === 0" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400">
          <UserIcon class="w-full h-full" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No customers found</h3>
        <p class="mt-2 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
      </div>

      <!-- Customers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="customer in customers" 
          :key="customer.user_id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <!-- Card Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <img
                  :src="customer.profile_pic ? `http://localhost:5000${customer.profile_pic}` : 'https://placehold.co/100x100/cccccc/333333?text=N/A'"
                  :alt="customer.full_name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  @error="handleImageError"
                />
                <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ customer.full_name }}</h3>
                <p class="text-sm text-gray-600">{{ customer.email }}</p>
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2', getStatusColor(customer.last_activity)]">
                  {{ getStatusText(customer.last_activity) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6">
            <div class="space-y-4">
              <!-- Contact Info -->
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PhoneIcon class="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Phone</p>
                  <p class="text-xs text-gray-500">{{ customer.phone_number || 'Not provided' }}</p>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Location</p>
                  <p class="text-xs text-gray-500">{{ customer.location || 'Not specified' }}</p>
                </div>
              </div>

              <!-- Statistics -->
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div class="text-center">
                  <p class="text-lg font-bold text-gray-900">{{ customer.total_bookings || 0 }}</p>
                  <p class="text-xs text-gray-500">Total Bookings</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-gray-900">{{ customer.completed_bookings || 0 }}</p>
                  <p class="text-xs text-gray-500">Completed</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-green-600">₱{{ customer.total_spent || 0 }}</p>
                  <p class="text-xs text-gray-500">Total Spent</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-blue-600">{{ formatDate(customer.last_booking_date) }}</p>
                  <p class="text-xs text-gray-500">Last Booking</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <button
                  @click="viewCustomerDetails(customer)"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <EyeIcon class="w-4 h-4" />
                  View Details
                </button>
              </div>
              <div class="text-xs text-gray-500">
                Customer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="customers.length > 0" class="mt-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center text-sm text-gray-700 mb-4 sm:mb-0">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalCount) }} of {{ totalCount }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Previous
            </button>
            <div class="flex items-center space-x-1">
              <span class="px-3 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg">
                {{ currentPage }}
              </span>
              <span class="text-sm text-gray-500">of {{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="showCustomerModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Customer Details</h3>
              <p class="text-sm text-gray-600">Complete information about {{ selectedCustomer?.full_name }}</p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="printCustomerDetails"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <PrinterIcon class="w-4 h-4" />
                Print Details
              </button>
              <button
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div v-if="selectedCustomer" class="space-y-6">
            <!-- Customer Overview -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <img
                    :src="selectedCustomer.profile_pic ? `http://localhost:5000${selectedCustomer.profile_pic}` : 'https://placehold.co/100x100/cccccc/333333?text=N/A'"
                    :alt="selectedCustomer.full_name"
                    class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    @error="handleImageError"
                  />
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold text-gray-900">{{ selectedCustomer.full_name }}</h3>
                  <p class="text-gray-600">{{ selectedCustomer.email }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span :class="['px-3 py-1 text-sm font-semibold rounded-full', getStatusColor(selectedCustomer.last_activity)]">
                      {{ getStatusText(selectedCustomer.last_activity) }}
                    </span>
                    <span class="text-sm text-gray-500">Customer</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon class="w-6 h-6 text-blue-600" />
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ selectedCustomer.total_bookings || 0 }}</p>
                <p class="text-sm text-gray-500">Total Bookings</p>
              </div>
              <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon class="w-6 h-6 text-green-600" />
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ selectedCustomer.completed_bookings || 0 }}</p>
                <p class="text-sm text-gray-500">Completed</p>
              </div>
              <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CurrencyDollarIcon class="w-6 h-6 text-yellow-600" />
                </div>
                <p class="text-2xl font-bold text-green-600">₱{{ selectedCustomer.total_spent || 0 }}</p>
                <p class="text-sm text-gray-500">Total Spent</p>
              </div>
              <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon class="w-6 h-6 text-purple-600" />
                </div>
                <p class="text-2xl font-bold text-blue-600">{{ formatDate(selectedCustomer.last_booking_date) }}</p>
                <p class="text-sm text-gray-500">Last Booking</p>
              </div>
            </div>

            <!-- Main Information Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Contact Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <EnvelopeIcon class="w-5 h-5 text-gray-400" />
                    <span class="text-sm text-gray-600">{{ selectedCustomer.email }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <PhoneIcon class="w-5 h-5 text-gray-400" />
                    <span class="text-sm text-gray-600">{{ selectedCustomer.phone_number || 'Not provided' }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <MapPinIcon class="w-5 h-5 text-gray-400" />
                    <span class="text-sm text-gray-600">{{ selectedCustomer.location || 'Not specified' }}</span>
                  </div>
                </div>
              </div>

              <!-- Account Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon class="w-5 h-5 text-green-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Account Information</h3>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">User Type</span>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {{ selectedCustomer.user_type }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Last Activity</span>
                    <span class="text-sm text-gray-900">{{ formatDate(selectedCustomer.last_activity) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking History -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon class="w-5 h-5 text-orange-600" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Booking History ({{ selectedCustomer.booking_history?.length || 0 }})</h3>
              </div>
              <div v-if="selectedCustomer.booking_history && selectedCustomer.booking_history.length > 0" class="space-y-3">
                <div v-for="booking in selectedCustomer.booking_history.slice(0, 10)" :key="booking.booking_id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-semibold text-gray-900">Booking #{{ booking.booking_id }}</h4>
                      <p class="text-sm text-gray-600">{{ booking.boat_name }} • {{ booking.owner_name }}</p>
                      <p class="text-xs text-gray-500">{{ formatDate(booking.booking_date) }} at {{ booking.booking_time }}</p>
                    </div>
                    <div class="text-right">
                      <span :class="['px-3 py-1 text-xs font-semibold rounded-full', 
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      ]">
                        {{ booking.status }}
                      </span>
                      <p class="text-sm font-semibold text-gray-900 mt-1">₱{{ booking.total_price }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <p>No booking history available</p>
              </div>
            </div>

            <!-- Reviews -->
            <div v-if="selectedCustomer.reviews && selectedCustomer.reviews.length > 0" class="bg-white border border-gray-200 rounded-xl p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <StarIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Reviews ({{ selectedCustomer.reviews.length }})</h3>
              </div>
              <div class="space-y-3">
                <div v-for="review in selectedCustomer.reviews.slice(0, 5)" :key="review.review_id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-semibold text-gray-900">{{ review.boat_name }}</h4>
                      <p class="text-sm text-gray-600">{{ review.owner_name }}</p>
                      <p class="text-sm text-gray-700 mt-2">{{ review.comment }}</p>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center space-x-1">
                        <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
                        <span class="text-sm font-semibold text-gray-900">{{ review.rating }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ formatDate(review.created_at) }}</p>
                    </div>
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
<style scoped>
/* Scoped styles can be added here if needed, but Tailwind handles most of the design */
</style>
