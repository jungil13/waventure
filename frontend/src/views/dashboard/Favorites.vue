<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span class="w-12 h-12 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
              <BookmarkSquareIcon class="h-8 w-8 text-orange-600" />
            </span>
            My Favorite Boats
          </h1>
          <p class="text-lg text-gray-600 mb-2">Your saved boats for future adventures around Cordova, Central Visayas</p>
          <div class="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              {{ favorites.length }} favorite boats
            </span>
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              {{ availableFavoritesCount }} available now
            </span>
          </div>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div v-if="favorites.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(boat, index) in favorites" 
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

            <!-- Favorite Badge -->
            <div class="absolute top-4 left-4">
              <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <BookmarkSquareIcon class="h-5 w-5 text-white" />
              </div>
            </div>

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
              
              <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                <div class="flex items-center gap-2">
                  <UsersIcon class="h-4 w-4 text-blue-500" />
                  <span>{{ boat.capacity }} pax</span>
                </div>
                <div class="flex items-center gap-2">
                  <SwatchIcon class="h-4 w-4 text-green-500" />
                  <span>{{ boat.boat_type || "Unknown" }}</span>
                </div>
              </div>

              <!-- Rating -->
              <div class="flex items-center space-x-1 text-yellow-400 mb-4">
                <StarIcon
                  v-for="n in 5"
                  :key="n"
                  class="h-4 w-4"
                  :class="{ 'opacity-30': n > (boat.rating || 4) }"
                  fill="currentColor"
                />
                <span class="text-sm text-gray-600 ml-2">({{ boat.rating || 4 }}/5)</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Book Now Button -->
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

              <!-- Remove Favorite Button -->
              <button
                @click="removeFavorite(boat.boat_id)"
                class="w-full py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-2xl font-semibold hover:from-red-200 hover:to-pink-200 transition-all duration-200 flex items-center justify-center gap-2 border border-red-200"
              >
                <TrashIcon class="h-4 w-4" />
                Remove from Favorites
              </button>
            </div>
          </div>
        </div>
      </div>


      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20">
          <div class="w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookmarkIcon class="h-10 w-10 text-orange-500" />
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">No Favorite Boats Yet</h3>
          <p class="text-gray-600 mb-6">Start exploring boats and add them to your favorites to save them here for future adventures!</p>
          <button
            @click="$router.push({ name: 'Boats' })"
            class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Browse Boats
          </button>
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
import AOS from "aos";
import "aos/dist/aos.css";

// ✅ Heroicons
import {
  CalendarDaysIcon,
  UsersIcon,
  StarIcon,
  TrashIcon,
  BookmarkSquareIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
  SwatchIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();

const favorites = ref([]);
const boats = ref([]);
const user = JSON.parse(localStorage.getItem("user")) || { userId: null };

// Available favorites count
const availableFavoritesCount = computed(() => {
  return favorites.value.filter(boat => boat.status === 'Available').length;
});

// ✅ Load all boats from API + filter user's favorites
const loadFavorites = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/boats");
    boats.value = data;

    const favs = JSON.parse(localStorage.getItem("favorites")) || {};
    const userFavIds = favs[user.userId] || [];

    favorites.value = boats.value.filter((boat) =>
      userFavIds.includes(boat.boat_id)
    );
  } catch (err) {
    console.error("Error fetching boats:", err);
  }
};

// ✅ Remove favorite
const removeFavorite = (boatId) => {
  const favs = JSON.parse(localStorage.getItem("favorites")) || {};
  if (!favs[user.userId]) return;

  favs[user.userId] = favs[user.userId].filter((id) => id !== boatId);
  localStorage.setItem("favorites", JSON.stringify(favs));

  favorites.value = favorites.value.filter((boat) => boat.boat_id !== boatId);
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

onMounted(() => {
  AOS.init({ duration: 800, once: true });
  loadFavorites();
});
</script>
