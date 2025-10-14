<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
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
import AdminBoatOwnerService from "@/services/adminBoatOwnerService";
import Swal from 'sweetalert2';

// Reactive state for the component
const searchQuery = ref("");
const selectedLocation = ref("");
const owners = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(true);
const totalPages = ref(1);
const totalCount = ref(0);

// Modal states
const showOwnerModal = ref(false);
const selectedOwner = ref(null);
const loadingOwnerDetails = ref(false);

// Fetch owners from backend
const fetchOwners = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value,
      location: selectedLocation.value
    };

    const response = await AdminBoatOwnerService.getAllBoatOwners(params);
    
    if (response.success) {
      owners.value = response.data.owners;
      totalPages.value = response.data.pagination.totalPages;
      totalCount.value = response.data.pagination.totalCount;
    }
  } catch (error) {
    console.error('Error fetching boat owners:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load boat owners. Please refresh the page.',
    });
  } finally {
    loading.value = false;
  }
};

// Watch for changes in filters and reset pagination
watch([searchQuery, selectedLocation], () => {
  currentPage.value = 1;
  fetchOwners();
});

// Watch for page changes
watch(currentPage, () => {
  fetchOwners();
});

// View owner details
const viewOwnerDetails = async (owner) => {
  try {
    console.log('Fetching details for owner:', owner);
    const response = await AdminBoatOwnerService.getBoatOwnerById(owner.user_id);
    console.log('Owner details response:', response);
    
    if (response.success) {
      selectedOwner.value = response.data;
      showOwnerModal.value = true;
      console.log('Modal opened with owner:', selectedOwner.value);
      console.log('showOwnerModal state:', showOwnerModal.value);
    } else {
      console.error('API returned error:', response.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message || 'Failed to fetch owner details.',
      });
    }
  } catch (error) {
    console.error('Error fetching owner details:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load owner details.',
    });
  }
};

// Close modal function
const closeModal = () => {
  showOwnerModal.value = false;
  selectedOwner.value = null;
};

// Test modal function
const testModal = () => {
  selectedOwner.value = {
    user_id: 1,
    full_name: 'Test Owner',
    email: 'test@example.com',
    phone_number: '123-456-7890',
    location: 'Test Location',
    user_type: 'BoatOwner',
    total_boats: 2,
    total_bookings: 10,
    total_revenue: 50000,
    average_rating: 4.5,
    boats: [
      {
        boat_id: 1,
        name: 'Test Boat 1',
        boat_type: 'Yacht',
        capacity: 10,
        status: 'Available',
        total_bookings: 5,
        boat_revenue: 25000,
        boat_rating: 4.5
      }
    ],
    recent_bookings: [
      {
        booking_id: 1,
        customer_name: 'John Doe',
        boat_name: 'Test Boat 1',
        booking_date: '2024-01-15',
        booking_time: '10:00 AM',
        status: 'Completed',
        total_price: 5000
      }
    ]
  };
  showOwnerModal.value = true;
  console.log('Test modal opened');
  console.log('showOwnerModal state:', showOwnerModal.value);
  console.log('selectedOwner:', selectedOwner.value);
};

// Note: Status update functionality removed as users table doesn't have a status column

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

// Get user type color
const getUserTypeColor = (userType) => {
  switch (userType) {
    case 'BoatOwner': return 'bg-blue-100 text-blue-800';
    case 'Admin': return 'bg-purple-100 text-purple-800';
    case 'Customer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get boat status color
const getBoatStatusColor = (status) => {
  switch (status) {
    case 'Available': return 'bg-green-100 text-green-800';
    case 'Rented': return 'bg-blue-100 text-blue-800';
    case 'UnderMaintenance': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    case 'In Progress': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/100x100/cccccc/333333?text=N/A';
  event.target.onerror = null; // Prevent infinite loop
};

// Print functionality
const printOwnerDetails = () => {
  if (!selectedOwner.value) return;
  
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Boat Owner Details - ${selectedOwner.value.full_name}</title>
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
        <h1>Boat Owner Details</h1>
        <p>Owner: ${selectedOwner.value.full_name}</p>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="info-grid">
        <div class="section">
          <h3>Owner Information</h3>
          <div class="info-item">
            <span class="info-label">Name:</span><br>
            <span class="info-value">${selectedOwner.value.full_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span><br>
            <span class="info-value">${selectedOwner.value.email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span><br>
            <span class="info-value">${selectedOwner.value.phone_number || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Location:</span><br>
            <span class="info-value">${selectedOwner.value.location || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span><br>
            <span class="status-badge status-${selectedOwner.value.user_type.toLowerCase()}">${selectedOwner.value.user_type}</span>
          </div>
        </div>

        <div class="section">
          <h3>Statistics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${selectedOwner.value.total_boats || 0}</div>
              <div class="stat-label">Total Boats</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${selectedOwner.value.total_bookings || 0}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₱${selectedOwner.value.total_revenue || 0}</div>
              <div class="stat-label">Earnings (Paid)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${Number(selectedOwner.value.average_rating || 0).toFixed(1)}</div>
              <div class="stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Boats Owned</h3>
        <table>
          <thead>
            <tr>
              <th>Boat Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Bookings</th>
              <th>Earnings (Paid)</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            ${selectedOwner.value.boats.map(boat => `
              <tr>
                <td>${boat.name}</td>
                <td>${boat.boat_type || 'N/A'}</td>
                <td>${boat.capacity}</td>
                <td><span class="status-badge status-${boat.status.toLowerCase().replace(' ', '')}">${boat.status}</span></td>
                <td>${boat.total_bookings || 0}</td>
                <td>₱${boat.boat_revenue || 0}</td>
                <td>${Number(boat.boat_rating || 0).toFixed(1)}</td>
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
  fetchOwners();
});
</script>
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Boat Owners Management</h1>
          <p class="mt-2 text-sm text-gray-600">Manage and monitor all boat owners</p>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center space-x-4">
          <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span class="text-sm text-gray-600">Total: </span>
            <span class="font-semibold text-gray-900">{{ totalCount }}</span>
          </div>
          <button
            @click="fetchOwners"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
          <button
            @click="testModal"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
          >
            Test Modal
          </button>
          <div class="bg-yellow-100 px-3 py-1 rounded text-xs">
            Modal: {{ showOwnerModal ? 'OPEN' : 'CLOSED' }}
          </div>
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
              placeholder="Search owners..."
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

    <!-- Owner Cards Grid -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="owners.length === 0" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400">
          <UserIcon class="w-full h-full" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No boat owners found</h3>
        <p class="mt-2 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
      </div>

      <!-- Owners Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="owner in owners" 
          :key="owner.user_id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <!-- Card Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <img
                  :src="owner.profile_pic ? `http://localhost:5000${owner.profile_pic}` : 'https://placehold.co/100x100/cccccc/333333?text=N/A'"
                  :alt="owner.full_name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  @error="handleImageError"
                />
                <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-blue-500"></div>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ owner.full_name }}</h3>
                <p class="text-sm text-gray-600">{{ owner.email }}</p>
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2', getUserTypeColor(owner.user_type)]">
                  {{ owner.user_type }}
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
                  <p class="text-xs text-gray-500">{{ owner.phone_number || 'Not provided' }}</p>
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
                  <p class="text-xs text-gray-500">{{ owner.location || 'Not specified' }}</p>
                </div>
              </div>

              <!-- Statistics -->
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div class="text-center">
                  <p class="text-lg font-bold text-gray-900">{{ owner.total_boats || 0 }}</p>
                  <p class="text-xs text-gray-500">Total Boats</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-gray-900">{{ owner.total_bookings || 0 }}</p>
                  <p class="text-xs text-gray-500">Bookings</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-green-600">₱{{ owner.total_revenue || 0 }}</p>
                  <p class="text-xs text-gray-500">Earnings (Paid)</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-yellow-600">{{ Number(owner.average_rating || 0).toFixed(1) }}</p>
                  <p class="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              <!-- Boats Preview -->
              <div v-if="owner.boats && owner.boats.length > 0" class="pt-4 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-900 mb-2">Boats ({{ owner.boats.length }})</p>
                <div class="space-y-1">
                  <div v-for="boat in owner.boats.slice(0, 3)" :key="boat.boat_id" class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">{{ boat.name }}</span>
                    <span :class="['px-2 py-1 rounded-full text-xs font-semibold', getBoatStatusColor(boat.status)]">
                      {{ boat.status }}
                    </span>
                  </div>
                  <div v-if="owner.boats.length > 3" class="text-xs text-gray-500 text-center">
                    +{{ owner.boats.length - 3 }} more boats
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <button
                  @click="viewOwnerDetails(owner)"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <EyeIcon class="w-4 h-4" />
                  View Details
                </button>
              </div>
              <div class="text-xs text-gray-500">
                Boat Owner
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="owners.length > 0" class="mt-8">
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

    <!-- Owner Details Modal -->
    <div v-if="showOwnerModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Boat Owner Details</h3>
                <p class="text-sm text-gray-600">Complete information about {{ selectedOwner?.full_name }}</p>
              </div>
              <div class="flex space-x-3">
                <button
                  @click="printOwnerDetails"
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
            <div v-if="selectedOwner" class="space-y-6">
              <!-- Owner Overview -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div class="flex items-center space-x-6">
                  <div class="relative">
                    <img
                      :src="selectedOwner.profile_pic ? `http://localhost:5000${selectedOwner.profile_pic}` : 'https://placehold.co/100x100/cccccc/333333?text=N/A'"
                      :alt="selectedOwner.full_name"
                      class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      @error="handleImageError"
                    />
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-blue-500"></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-gray-900">{{ selectedOwner.full_name }}</h3>
                    <p class="text-gray-600">{{ selectedOwner.email }}</p>
                    <div class="flex items-center space-x-4 mt-2">
                      <span :class="['px-3 py-1 text-sm font-semibold rounded-full', getUserTypeColor(selectedOwner.user_type)]">
                        {{ selectedOwner.user_type }}
                      </span>
                      <span class="text-sm text-gray-500">Boat Owner</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Statistics Grid -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ selectedOwner.total_boats || 0 }}</p>
                  <p class="text-sm text-gray-500">Total Boats</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon class="w-6 h-6 text-green-600" />
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ selectedOwner.total_bookings || 0 }}</p>
                  <p class="text-sm text-gray-500">Total Bookings</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CurrencyDollarIcon class="w-6 h-6 text-yellow-600" />
                  </div>
                  <p class="text-2xl font-bold text-green-600">₱{{ selectedOwner.total_revenue || 0 }}</p>
                  <p class="text-sm text-gray-500">Earnings (Paid)</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <StarIcon class="w-6 h-6 text-purple-600" />
                  </div>
                  <p class="text-2xl font-bold text-yellow-600">{{ Number(selectedOwner.average_rating || 0).toFixed(1) }}</p>
                  <p class="text-sm text-gray-500">Average Rating</p>
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
                      <span class="text-sm text-gray-600">{{ selectedOwner.email }}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <PhoneIcon class="w-5 h-5 text-gray-400" />
                      <span class="text-sm text-gray-600">{{ selectedOwner.phone_number || 'Not provided' }}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <MapPinIcon class="w-5 h-5 text-gray-400" />
                      <span class="text-sm text-gray-600">{{ selectedOwner.location || 'Not specified' }}</span>
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
                      <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getUserTypeColor(selectedOwner.user_type)]">
                        {{ selectedOwner.user_type }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boats Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Boats Owned ({{ selectedOwner.boats?.length || 0 }})</h3>
                </div>
                <div v-if="selectedOwner.boats && selectedOwner.boats.length > 0" class="space-y-3">
                  <div v-for="boat in selectedOwner.boats" :key="boat.boat_id" class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ boat.name }}</h4>
                        <p class="text-sm text-gray-600">{{ boat.boat_type || 'N/A' }} • Capacity: {{ boat.capacity }}</p>
                      </div>
                      <div class="text-right">
                        <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getBoatStatusColor(boat.status)]">
                          {{ boat.status }}
                        </span>
                        <div class="mt-2 text-xs text-gray-500">
                          <p>{{ boat.total_bookings || 0 }} bookings</p>
                          <p>₱{{ boat.boat_revenue || 0 }} paid</p>
                          <p>{{ Number(boat.boat_rating || 0).toFixed(1) }} rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  <p>No boats registered</p>
                </div>
              </div>

              <!-- Recent Bookings -->
              <div v-if="selectedOwner.recent_bookings && selectedOwner.recent_bookings.length > 0" class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon class="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                </div>
                <div class="space-y-3">
                  <div v-for="booking in selectedOwner.recent_bookings.slice(0, 5)" :key="booking.booking_id" class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-semibold text-gray-900">Booking #{{ booking.booking_id }}</h4>
                        <p class="text-sm text-gray-600">{{ booking.customer_name }} • {{ booking.boat_name }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(booking.booking_date) }} at {{ booking.booking_time }}</p>
                      </div>
                      <div class="text-right">
                        <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusColor(booking.status)]">
                          {{ booking.status }}
                        </span>
                        <p class="text-sm font-semibold text-gray-900 mt-1">₱{{ booking.total_price }}</p>
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
