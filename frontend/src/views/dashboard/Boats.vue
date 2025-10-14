<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="mb-8" >
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            🚤 Browse Boats & Book Your Adventure
          </h1>
          <p class="text-lg text-gray-600 mb-2">Discover amazing boats for your perfect island hopping experience</p>
          <div class="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              {{ filteredBoats.length }} boats available
            </span>
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              {{ availableBoatsCount }} available now
            </span>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 mb-8" >
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔍</span>
          Search & Filter Boats
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="relative">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Search boats..."
              class="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <!-- Type -->
          <div class="relative">
            <SwatchIcon class="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select 
              v-model="filters.type"
              class="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="">All Types</option>
              <option value="Bangka">Bangka</option>
              <option value="Yacht">Yacht</option>
              <option value="Speedboat">Speedboat</option>
            </select>
          </div>

          <!-- Status -->
          <div class="relative">
            <CheckCircleIcon class="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select 
              v-model="filters.status"
              class="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <!-- Date -->
          <div class="relative">
            <CalendarDaysIcon class="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input 
              v-model="filters.date" 
              type="date"
              :min="new Date().toISOString().split('T')[0]"
              class="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <!-- Search Button -->
          <button 
            @click="searchBoats"
            class="flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md transform hover:-translate-y-1"
          >
            <MagnifyingGlassCircleIcon class="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-orange-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Loading Boats</h3>
          <p class="text-gray-600">Discovering amazing boats for your adventure...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBoats.length === 0" class="text-center py-16" >
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20">
          <div class="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-4xl">🚤</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">No Boats Found</h3>
          <p class="text-gray-600 mb-6">No boats match your current search criteria. Try adjusting your filters.</p>
          <button
            @click="clearFilters"
            class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Boats Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(boat, index) in filteredBoats" 
          :key="boat.boat_id"
          class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        
        >
          <!-- Boat Image -->
          <div class="relative">
            <div class="aspect-video w-full overflow-hidden">
              <img 
                :src="`http://localhost:5000${boat.images[0]}`" 
                :alt="boat.name"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-4 right-4">
              <span :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-lg',
                getStatusBadgeClass(boat.status)
              ]">
                <div :class="[
                  'w-2 h-2 rounded-full mr-2',
                  getStatusDotClass(boat.status)
                ]"></div>
                {{ boat.status }}
              </span>
            </div>

            <!-- Favorite Button -->
            <button 
              @click="toggleFavorite(boat.boat_id)"
              class="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
            >
              <HeartIcon 
                class="h-5 w-5" 
                :class="isFavorite(boat.boat_id) ? 'text-red-500 fill-current' : 'text-gray-400'" 
              />
            </button>

            <!-- Price Badge -->
            <div class="absolute bottom-4 left-4">
              <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span class="text-orange-600 font-bold text-sm">₱{{ parseFloat(boat.rental_price).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Boat Info -->
          <div class="p-6">
            <div class="mb-4">
              <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <PaperAirplaneIcon class="h-5 w-5 text-orange-500" />
                {{ boat.name }}
              </h3>
              
              <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <UsersIcon class="h-4 w-4 text-blue-500" />
                  <span>{{ boat.capacity }} pax</span>
                </div>
                <div class="flex items-center gap-2">
                  <SwatchIcon class="h-4 w-4 text-green-500" />
                  <span>{{ boat.boat_type || "Unknown" }}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <button
              @click="handleBookNow(boat)"
              :disabled="!isBoatAvailable(boat)"
              class="w-full py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              :class="isBoatAvailable(boat) 
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-xl transform hover:-translate-y-1 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
            >
              <CalendarDaysIcon class="h-5 w-5" />
              <span v-if="isBoatAvailable(boat)">Book Now</span>
              <span v-else-if="boat.status === 'Rented'">Currently Rented</span>
              <span v-else-if="boat.status === 'Under Maintenance'">Under Maintenance</span>
              <span v-else>Not Available</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  MagnifyingGlassIcon,
  MagnifyingGlassCircleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  UsersIcon,
  SwatchIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  HeartIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();

const filters = ref({
  search: "",
  type: "",
  status: "",
  date: "",
});

const boats = ref([]);
const loading = ref(true);

// ✅ Get user from localStorage
const user = JSON.parse(localStorage.getItem("user")) || { userId: null };

// ✅ Favorites state (per user)
const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
const favorites = ref(storedFavorites[user.userId] || []);

onMounted(async () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true
  });

  try {
    const res = await axios.get("http://localhost:5000/api/boats");
    boats.value = res.data;
  } catch (err) {
    console.error("Error fetching boats:", err);
  } finally {
    loading.value = false;
  }
});

// Filtering logic
const filteredBoats = computed(() => {
  return boats.value.filter((boat) => {
    return (
      (filters.value.search === "" ||
        boat.name.toLowerCase().includes(filters.value.search.toLowerCase())) &&
      (filters.value.type === "" ||
        (boat.boat_type && boat.boat_type === filters.value.type)) &&
      (filters.value.status === "" || boat.status === filters.value.status)
    );
  });
});

// Available boats count
const availableBoatsCount = computed(() => {
  return boats.value.filter(boat => boat.status === 'Available').length;
});

const searchBoats = () => {
  console.log("Searching boats with filters:", filters.value);
};

// Clear filters function
const clearFilters = () => {
  filters.value = {
    search: "",
    type: "",
    status: "",
    date: "",
  };
};

// Check if boat is available for booking
const isBoatAvailable = (boat) => {
  return boat.status === 'Available';
};

// Handle book now click
const handleBookNow = (boat) => {
  if (!isBoatAvailable(boat)) {
    let message = '';
    if (boat.status === 'Rented') {
      message = 'This boat is currently rented and not available for booking.';
    } else if (boat.status === 'Under Maintenance') {
      message = 'This boat is under maintenance and not available for booking.';
    } else {
      message = 'This boat is not available for booking at the moment.';
    }
    
    Swal.fire({
      icon: 'warning',
      title: 'Boat Not Available',
      text: message,
      confirmButtonText: 'OK'
    });
    return;
  }
  
  // Navigate to boat details if available
  router.push({ name: 'BoatDetails', params: { id: boat.boat_id } });
};

// Get status badge class
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'Rented':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'Under Maintenance':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'Unavailable':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

// Get status dot class
const getStatusDotClass = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-green-500';
    case 'Rented':
      return 'bg-blue-500';
    case 'Under Maintenance':
      return 'bg-yellow-500';
    case 'Unavailable':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// ✅ Toggle Favorite with SweetAlert2
const toggleFavorite = (boatId) => {
  if (!user.userId) {
    Swal.fire({
      icon: "warning",
      title: "Please Login",
      text: "You need to login to save favorites!",
    });
    return;
  }

  let favs = JSON.parse(localStorage.getItem("favorites")) || {};
  if (!favs[user.userId]) favs[user.userId] = [];

  if (favs[user.userId].includes(boatId)) {
    favs[user.userId] = favs[user.userId].filter((id) => id !== boatId);
    Swal.fire({
      icon: "error",
      title: "Removed from Favorites",
      text: "This boat has been removed from your favorites.",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    favs[user.userId].push(boatId);
    Swal.fire({
      icon: "success",
      title: "Added to Favorites",
      text: "This boat has been added to your favorites!",
      timer: 1500,
      showConfirmButton: false,
    });
  }

  favorites.value = favs[user.userId];
  localStorage.setItem("favorites", JSON.stringify(favs));
};

// ✅ Check if boat is favorite
const isFavorite = (boatId) => {
  return favorites.value.includes(boatId);
};
</script>
