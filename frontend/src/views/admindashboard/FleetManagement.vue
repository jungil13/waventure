<script setup>
import { ref, computed, onMounted } from "vue";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  WrenchScrewdriverIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import FleetManagementService from "@/services/fleetManagementService";
import Swal from 'sweetalert2';

// Reactive data
const boats = ref([]);
const searchQuery = ref("");
const loading = ref(true);
const showMaintenanceModal = ref(false);
const selectedBoat = ref(null);
const maintenanceForm = ref({
  scheduled_date: '',
  scheduled_time: '',
  maintenance_type: 'Routine',
  description: '',
  assigned_technician: '',
  estimated_duration: '',
  cost: '',
  notes: ''
});

// Computed for search filter
const filteredBoats = computed(() =>
  boats.value.filter((boat) =>
    boat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    boat.owner_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Load fleet data
const loadFleetData = async () => {
  try {
    loading.value = true;
    const response = await FleetManagementService.getFleetOverview();
    
    if (response.success) {
      boats.value = response.data.map(boat => {
        const imageUrl = boat.images && boat.images.length > 0 ? 
          `http://localhost:5000${boat.images[0]}` : 
          'https://placehold.co/600x400/cccccc/333333?text=No+Image';
        
        console.log('Boat:', boat.name, 'Images:', boat.images, 'Image URL:', imageUrl);
        
        return {
          ...boat,
          id: boat.boat_id,
          owner: boat.owner_name,
          lastMaintenance: boat.last_maintenance ? 
            new Date(boat.last_maintenance.scheduled_date).toLocaleDateString() : 
            'No maintenance records',
          imageUrl: imageUrl,
          status: boat.status,
          has_scheduled_maintenance: boat.has_scheduled_maintenance
        };
      });
    }
  } catch (error) {
    console.error('Error loading fleet data:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load fleet data. Please refresh the page.',
    });
  } finally {
    loading.value = false;
  }
};

// Schedule maintenance
const scheduleMaintenance = (boat) => {
  selectedBoat.value = boat;
  showMaintenanceModal.value = true;
  
  // Reset form
  maintenanceForm.value = {
    scheduled_date: '',
    scheduled_time: '',
    maintenance_type: 'Routine',
    description: '',
    assigned_technician: '',
    estimated_duration: '',
    cost: '',
    notes: ''
  };
};

// Submit maintenance schedule
const submitMaintenanceSchedule = async () => {
  try {
    if (!maintenanceForm.value.scheduled_date || !maintenanceForm.value.scheduled_time) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in the scheduled date and time.',
      });
      return;
    }

    const maintenanceData = {
      boat_id: selectedBoat.value.boat_id,
      scheduled_date: maintenanceForm.value.scheduled_date,
      scheduled_time: maintenanceForm.value.scheduled_time,
      maintenance_type: maintenanceForm.value.maintenance_type,
      description: maintenanceForm.value.description,
      assigned_technician: maintenanceForm.value.assigned_technician,
      estimated_duration: maintenanceForm.value.estimated_duration ? 
        parseInt(maintenanceForm.value.estimated_duration) : null,
      cost: maintenanceForm.value.cost ? 
        parseFloat(maintenanceForm.value.cost) : null,
      notes: maintenanceForm.value.notes
    };

    const response = await FleetManagementService.scheduleMaintenance(maintenanceData);
    
    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Maintenance scheduled successfully!',
      });
      
      showMaintenanceModal.value = false;
      await loadFleetData(); // Reload data to show updated status
    }
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to schedule maintenance. Please try again.',
    });
  }
};

// Remove boat (placeholder - would need additional backend endpoint)
const removeBoat = (boat) => {
  Swal.fire({
    title: 'Remove Boat',
    text: `Are you sure you want to remove ${boat.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // This would need a backend endpoint to actually remove the boat
      Swal.fire({
        icon: 'info',
        title: 'Feature Coming Soon',
        text: 'Boat removal functionality will be available in a future update.',
      });
    }
  });
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Available': return 'bg-green-100 text-green-800';
    case 'Rented': return 'bg-blue-100 text-blue-800';
    case 'UnderMaintenance': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Format date for input
const formatDateForInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// Format time for input
const formatTimeForInput = (time) => {
  if (!time) return '';
  return time.substring(0, 5); // HH:MM format
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400x250/cccccc/333333?text=Image+Not+Found';
  event.target.onerror = null; // Prevent infinite loop
};

onMounted(() => {
  loadFleetData();
});
</script>

<template>
  <div class="min-h-screen p-6 md:p-10 font-sans">
    <!-- Header -->
    <div class="md:items-center md:justify-between mb-10">
      <h1 class="text-3xl font-extrabold text-orange-600 mb-4 md:mb-0">
        Fleet Management 
      </h1>
      <p class="text-gray-500">Manage your boats, schedules, and maintenance</p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-3xl mx-auto mb-12 bg-white rounded-full shadow-md flex items-center p-2 border border-gray-200">
      <MagnifyingGlassIcon class="w-6 h-6 text-orange-500 ml-3" />
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search boat or owner..."
        class="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 px-4 py-2 outline-none"
      />
      <button class="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors duration-200 shadow-sm">
        <PaperAirplaneIcon class="w-5 h-5 transform rotate-90" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>

    <!-- Boat Listings Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        v-for="boat in filteredBoats"
        :key="boat.id"
        class="bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-300 overflow-hidden"
      >
        <!-- Boat Image -->
        <div class="relative">
          <img
            :src="boat.imageUrl"
            :alt="boat.name"
            class="w-full h-52 object-cover"
            @error="handleImageError"
          />
          <span class="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
            {{ boat.capacity }} pax
          </span>
          <span :class="['absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full shadow', getStatusColor(boat.status)]">
            {{ boat.status }}
          </span>
        </div>

        <!-- Boat Info -->
        <div class="p-6">
          <h2 class="text-lg font-bold mb-2 text-orange-600">
            {{ boat.name }}
          </h2>
          <p class="text-sm text-gray-500 mb-1">
            Owner: <span class="font-medium text-gray-700">{{ boat.owner }}</span>
          </p>
          <p class="text-sm text-gray-500 mb-1">
            Type: <span class="font-medium text-gray-700">{{ boat.boat_type || 'N/A' }}</span>
          </p>
          <p class="text-sm text-gray-500 mb-4">
            Last Maintenance:
            <span class="font-medium text-gray-700">{{ boat.lastMaintenance }}</span>
          </p>

          <!-- Maintenance Warning -->
          <div v-if="boat.has_scheduled_maintenance" class="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-xs text-yellow-800 font-medium">
              ⚠️ Maintenance Scheduled
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="scheduleMaintenance(boat)"
              :disabled="boat.status === 'UnderMaintenance'"
              class="flex items-center justify-center gap-2 flex-1 bg-orange-50 text-orange-600 border border-orange-500 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <WrenchScrewdriverIcon class="w-4 h-4" />
              Schedule
            </button>
            <button
              @click="removeBoat(boat)"
              class="flex items-center justify-center gap-2 flex-1 bg-red-50 text-red-600 border border-red-500 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-200"
            >
              <TrashIcon class="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredBoats.length === 0" class="text-center py-20">
      <div class="text-gray-400 mb-4">
        <WrenchScrewdriverIcon class="w-16 h-16 mx-auto" />
      </div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No boats found</h3>
      <p class="text-gray-500">Try adjusting your search criteria</p>
    </div>

    <!-- Maintenance Schedule Modal -->
    <div v-if="showMaintenanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Schedule Maintenance</h2>
            <button @click="showMaintenanceModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mb-6 p-4 bg-orange-50 rounded-lg">
            <h3 class="font-semibold text-orange-800 mb-2">{{ selectedBoat?.name }}</h3>
            <p class="text-sm text-orange-700">Owner: {{ selectedBoat?.owner }}</p>
            <p class="text-sm text-orange-700">Capacity: {{ selectedBoat?.capacity }} passengers</p>
          </div>

          <form @submit.prevent="submitMaintenanceSchedule" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
                <input
                  v-model="maintenanceForm.scheduled_date"
                  type="date"
                  :min="formatDateForInput(new Date())"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Scheduled Time *</label>
                <input
                  v-model="maintenanceForm.scheduled_time"
                  type="time"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Maintenance Type</label>
              <select
                v-model="maintenanceForm.maintenance_type"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Routine">Routine</option>
                <option value="Repair">Repair</option>
                <option value="Inspection">Inspection</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="maintenanceForm.description"
                rows="3"
                placeholder="Describe the maintenance work needed..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Technician</label>
                <input
                  v-model="maintenanceForm.assigned_technician"
                  type="text"
                  placeholder="Technician name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (hours)</label>
                <input
                  v-model="maintenanceForm.estimated_duration"
                  type="number"
                  min="1"
                  placeholder="e.g., 2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Cost (₱)</label>
              <input
                v-model="maintenanceForm.cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                v-model="maintenanceForm.notes"
                rows="2"
                placeholder="Additional notes..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showMaintenanceModal = false"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Schedule Maintenance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
/* Custom styles for fleet management */
</style>
