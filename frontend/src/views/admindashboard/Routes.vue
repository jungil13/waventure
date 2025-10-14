<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  PencilSquareIcon, 
  EyeIcon,
  StarIcon,
  ChartBarIcon,
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from "@heroicons/vue/24/outline";
import AdminIslandsService from "@/services/adminIslandsService";
import Swal from 'sweetalert2';

// Reactive state for the component
const searchQuery = ref("");
const selectedStatus = ref("All Status");
const selectedPriceRange = ref("All Prices");
const islands = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 12;
const totalPages = ref(1);
const totalCount = ref(0);
const showFilters = ref(false);

// Computed properties
const filteredIslands = computed(() => {
  return islands.value;
});

const priceRangeOptions = [
  { label: 'All Prices', value: 'All Prices' },
  { label: 'Under ₱500', value: '0-500' },
  { label: '₱500 - ₱1,000', value: '500-1000' },
  { label: '₱1,000 - ₱2,000', value: '1000-2000' },
  { label: 'Above ₱2,000', value: '2000+' }
];

const statusOptions = [
  { label: 'All Status', value: 'All Status' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Rejected', value: 'Rejected' }
];

// Fetch islands from backend
const fetchIslands = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value || undefined,
      status: selectedStatus.value !== 'All Status' ? selectedStatus.value : undefined
    };

    // Add price range filter
    if (selectedPriceRange.value !== 'All Prices') {
      const [min, max] = selectedPriceRange.value.split('-');
      if (min) params.minPrice = parseFloat(min);
      if (max && max !== '+') params.maxPrice = parseFloat(max);
    }

    const response = await AdminIslandsService.getAllIslands(params);
    
    if (response.success) {
      islands.value = response.data.islands;
      totalPages.value = response.data.pagination.totalPages;
      totalCount.value = response.data.pagination.totalCount;
    } else {
      throw new Error(response.message || 'Failed to fetch islands');
    }
  } catch (err) {
    console.error('Error fetching islands:', err);
    error.value = err.message;
    Swal.fire({
      title: 'Error',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } finally {
    loading.value = false;
  }
};

// Apply filters and refresh data
const applyFilters = () => {
  currentPage.value = 1;
  fetchIslands();
};

// Clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = 'All Status';
  selectedPriceRange.value = 'All Prices';
  currentPage.value = 1;
  fetchIslands();
};

// View island details
const viewDetails = async (islandId) => {
  try {
    const response = await AdminIslandsService.getIslandById(islandId);
    if (response.success) {
      const island = response.data;
      
      // Show detailed modal with island information
      Swal.fire({
        title: island.name,
        html: `
          <div class="text-left">
            <div class="mb-4">
              <img src="${AdminIslandsService.formatImageUrl(island.images[0])}" 
                   alt="${island.name}" 
                   class="w-full h-48 object-cover rounded-lg mb-3">
            </div>
            <p class="text-gray-700 mb-3">${island.description}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Status:</strong> <span class="px-2 py-1 rounded text-xs ${AdminIslandsService.getStatusColor(island.status)}">${island.status}</span></div>
              <div><strong>Price:</strong> ${AdminIslandsService.formatPrice(island.price)}</div>
              <div><strong>Total Bookings:</strong> ${island.total_bookings}</div>
              <div><strong>Revenue:</strong> ${AdminIslandsService.formatPrice(island.total_revenue)}</div>
              <div><strong>Rating:</strong> ${island.average_rating.toFixed(1)}/5 (${island.total_reviews} reviews)</div>
              <div><strong>Created:</strong> ${AdminIslandsService.formatDate(island.created_at)}</div>
            </div>
            ${island.features.length > 0 ? `
              <div class="mt-3">
                <strong>Features:</strong>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${island.features.map(feature => `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${feature}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `,
        width: '600px',
        showConfirmButton: false,
        showCloseButton: true
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to load island details',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Edit island
const editIsland = async (islandId) => {
  try {
    const response = await AdminIslandsService.getIslandById(islandId);
    if (response.success) {
      const island = response.data;
      
      // Show edit modal with form
      const { value: formData } = await Swal.fire({
        title: 'Edit Island',
        html: `
          <div class="text-left space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Island Name</label>
              <input id="edit-name" type="text" value="${island.name}" 
                     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="edit-description" rows="3" 
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${island.description}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
              <input id="edit-price" type="number" step="0.01" value="${island.price}" 
                     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select id="edit-status" 
                      class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="Pending" ${island.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Approved" ${island.status === 'Approved' ? 'selected' : ''}>Approved</option>
                <option value="Rejected" ${island.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <input id="edit-features" type="text" value="${island.features ? island.features.join(', ') : ''}" 
                     placeholder="e.g., White Sands, Snorkeling, Beach"
                     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'Update Island',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: () => {
          const name = document.getElementById('edit-name').value.trim();
          const description = document.getElementById('edit-description').value.trim();
          const price = document.getElementById('edit-price').value;
          const status = document.getElementById('edit-status').value;
          const features = document.getElementById('edit-features').value.trim();
          
          if (!name) {
            Swal.showValidationMessage('Island name is required');
            return false;
          }
          if (!description) {
            Swal.showValidationMessage('Description is required');
            return false;
          }
          if (!price || isNaN(price) || parseFloat(price) < 0) {
            Swal.showValidationMessage('Please enter a valid price');
            return false;
          }
          
          return {
            name,
            description,
            price: parseFloat(price),
            status,
            features: features ? features.split(',').map(f => f.trim()).filter(f => f) : []
          };
        }
      });

      if (formData) {
        // Update the island
        const updateResponse = await AdminIslandsService.updateIsland(islandId, formData);
        if (updateResponse.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Island updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          await fetchIslands(); // Refresh the list
        }
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to update island',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Update island status
const updateStatus = async (islandId, newStatus) => {
  try {
    const result = await Swal.fire({
      title: 'Update Status',
      text: `Are you sure you want to change the status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const response = await AdminIslandsService.updateIslandStatus(islandId, newStatus);
      if (response.success) {
        Swal.fire({
          title: 'Success',
          text: 'Island status updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        await fetchIslands(); // Refresh the list
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to update island status',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Delete island
const deleteIsland = async (islandId, islandName) => {
  try {
    const result = await Swal.fire({
      title: 'Delete Island',
      html: `Are you sure you want to delete <strong>"${islandName}"</strong>?<br><br>This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      const response = await AdminIslandsService.deleteIsland(islandId);
      if (response.success) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Island has been deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        await fetchIslands(); // Refresh the list
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to delete island',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Add new island
const addIsland = async () => {
  try {
    const { value: formData } = await Swal.fire({
      title: 'Add New Island',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Island Name *</label>
            <input id="add-name" type="text" 
                   class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Enter island name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea id="add-description" rows="3" 
                      class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter island description"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
            <input id="add-price" type="number" step="0.01" min="0"
                   class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Enter price">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="add-status" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
            <input id="add-features" type="text" 
                   placeholder="e.g., White Sands, Snorkeling, Beach"
                   class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
      `,
      width: '600px',
      showCancelButton: true,
      confirmButtonText: 'Add Island',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('add-name').value.trim();
        const description = document.getElementById('add-description').value.trim();
        const price = document.getElementById('add-price').value;
        const status = document.getElementById('add-status').value;
        const features = document.getElementById('add-features').value.trim();
        
        if (!name) {
          Swal.showValidationMessage('Island name is required');
          return false;
        }
        if (!description) {
          Swal.showValidationMessage('Description is required');
          return false;
        }
        if (!price || isNaN(price) || parseFloat(price) < 0) {
          Swal.showValidationMessage('Please enter a valid price');
          return false;
        }
        
        return {
          name,
          description,
          price: parseFloat(price),
          status,
          features: features ? features.split(',').map(f => f.trim()).filter(f => f) : [],
          images: [] // For now, no image upload functionality
        };
      }
    });

    if (formData) {
      // Create the island
      const response = await AdminIslandsService.createIsland(formData);
      if (response.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Island created successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        await fetchIslands(); // Refresh the list
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to create island',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchIslands();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchIslands();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchIslands();
  }
};

onMounted(() => {
  fetchIslands();
});
</script>
<template>
  <div class="p-4 md:p-8 min-h-screen font-sans bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-sky-600 mb-2">Islands & Routes</h1>
          <p class="text-gray-600">Manage and explore beautiful island destinations</p>
        </div>
        <div class="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            @click="showFilters = !showFilters"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <FunnelIcon class="w-4 h-4" />
            {{ showFilters ? 'Hide' : 'Show' }} Filters
          </button>
          <button
            @click="fetchIslands"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
            Refresh
          </button>
          <button
            @click="addIsland"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <PlusIcon class="w-4 h-4" />
            Add Island
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Controls -->
    <div class="mb-8">
      <!-- Search Bar -->
      <div class="relative w-full md:w-1/2 bg-white rounded-xl shadow-lg flex items-center p-3 mb-4">
        <MagnifyingGlassIcon class="w-6 h-6 text-gray-400 ml-2" />
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="applyFilters"
          placeholder="Search islands by name or description..."
          class="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 px-4 py-2 outline-none"
        />
        <button 
          @click="applyFilters"
          class="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-colors duration-200"
        >
          <PaperAirplaneIcon class="w-5 h-5 transform rotate-90" />
        </button>
      </div>

      <!-- Advanced Filters -->
      <div v-if="showFilters" class="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
              v-model="selectedStatus"
              class="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
        </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <select
              v-model="selectedPriceRange"
              class="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
            >
              <option v-for="option in priceRangeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
        </select>
          </div>
          <div class="flex items-end gap-2">
            <button
              @click="applyFilters"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Apply Filters
            </button>
            <button
              @click="clearFilters"
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
        <div>
          <h3 class="text-lg font-medium text-red-800">Error Loading Islands</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Islands Grid -->
    <div v-else-if="!loading && islands.length > 0" class="space-y-8">
      <!-- Results Summary -->
      <div class="bg-white rounded-xl shadow-lg p-4">
        <div class="flex items-center justify-between">
          <p class="text-gray-600">
            Showing {{ islands.length }} of {{ totalCount }} islands
            <span v-if="searchQuery || selectedStatus !== 'All Status' || selectedPriceRange !== 'All Prices'">
              (filtered)
            </span>
          </p>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
      </div>
    </div>

      <!-- Islands Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="island in filteredIslands"
          :key="island.island_id"
          class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <!-- Image Section -->
          <div class="relative">
            <img
              :src="AdminIslandsService.formatImageUrl(island.images[0])"
              :alt="island.name"
          class="w-full h-48 object-cover"
              @error="$event.target.src='https://placehold.co/600x400/3b82f6/fff?text=No+Image'"
            />
            <div class="absolute top-3 right-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  AdminIslandsService.getStatusColor(island.status)
                ]"
              >
                {{ island.status }}
              </span>
            </div>
            <div v-if="island.average_rating > 0" class="absolute top-3 left-3">
              <div class="bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center">
                <StarIcon class="w-4 h-4 text-yellow-500 mr-1" />
                <span class="text-sm font-medium">{{ island.average_rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <!-- Content Section -->
        <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">{{ island.name }}</h2>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ AdminIslandsService.truncateText(island.description, 100) }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div class="flex items-center text-gray-600">
                <CurrencyDollarIcon class="w-4 h-4 text-gray-500 mr-2" />
                <span class="font-semibold">{{ AdminIslandsService.formatPrice(island.price) }}</span>
            </div>
              <div class="flex items-center text-gray-600">
                <ChartBarIcon class="w-4 h-4 text-gray-500 mr-2" />
                <span>{{ island.total_bookings }} bookings</span>
            </div>
              <div class="flex items-center text-gray-600">
              <UsersIcon class="w-4 h-4 text-gray-500 mr-2" />
                <span>₱{{ island.total_revenue.toLocaleString() }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <StarIcon class="w-4 h-4 text-gray-500 mr-2" />
                <span>{{ island.total_reviews }} reviews</span>
              </div>
            </div>

            <!-- Features -->
            <div v-if="island.features && island.features.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="feature in island.features.slice(0, 3)"
                  :key="feature"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {{ feature }}
                </span>
                <span
                  v-if="island.features.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  +{{ island.features.length - 3 }} more
                </span>
            </div>
          </div>
        </div>

          <!-- Action Buttons -->
          <div class="p-6 border-t border-gray-200 bg-gray-50">
            <div class="flex space-x-2">
          <button
                @click="viewDetails(island.island_id)"
                class="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
          >
            <EyeIcon class="w-4 h-4 mr-2" /> View Details
          </button>
          <button
                @click="editIsland(island.island_id)"
                class="flex-1 flex items-center justify-center bg-yellow-100 text-yellow-700 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors duration-200"
          >
            <PencilSquareIcon class="w-4 h-4 mr-2" /> Edit
          </button>
        </div>
            
            <!-- Delete Button -->
            <div class="mt-2">
              <button
                @click="deleteIsland(island.island_id, island.name)"
                class="w-full bg-red-100 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
              >
                Delete Island
              </button>
            </div>
            
            <!-- Status Update Buttons -->
            <div class="mt-2 space-y-1">
              <div v-if="island.status !== 'Approved'" class="flex space-x-1">
                <button
                  @click="updateStatus(island.island_id, 'Approved')"
                  class="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200"
                >
                  Approve
                </button>
                <button
                  @click="updateStatus(island.island_id, 'Rejected')"
                  class="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                >
                  Reject
                </button>
              </div>
              <div v-else class="flex space-x-1">
                <button
                  @click="updateStatus(island.island_id, 'Pending')"
                  class="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors duration-200"
                >
                  Set Pending
                </button>
                <button
                  @click="updateStatus(island.island_id, 'Rejected')"
                  class="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                >
                  Reject
                </button>
              </div>
              <div v-if="island.status === 'Rejected'" class="flex space-x-1">
                <button
                  @click="updateStatus(island.island_id, 'Approved')"
                  class="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200"
                >
                  Approve
                </button>
                <button
                  @click="updateStatus(island.island_id, 'Pending')"
                  class="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors duration-200"
                >
                  Set Pending
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
          <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
          Previous
          </button>
        
        <div class="flex space-x-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && islands.length === 0" class="text-center py-12">
      <div class="bg-white rounded-xl shadow-lg p-12">
        <MapPinIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No Islands Found</h3>
        <p class="text-gray-600 mb-6">
          {{ searchQuery || selectedStatus !== 'All Status' || selectedPriceRange !== 'All Prices' 
             ? 'Try adjusting your search criteria or filters.' 
             : 'No islands have been added yet.' }}
        </p>
        <button
          v-if="searchQuery || selectedStatus !== 'All Status' || selectedPriceRange !== 'All Prices'"
          @click="clearFilters"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>
