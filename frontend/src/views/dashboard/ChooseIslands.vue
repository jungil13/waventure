<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            🏝️ Choose Your Island Destinations
          </h1>
          <p class="text-lg text-gray-600 mb-2">Select 1-3 islands for your perfect island hopping adventure</p>
          <div class="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              {{ selectedIslands.length }}/3 selected
            </span>
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              {{ islands.length }} islands available
            </span>
          </div>
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
          <h3 class="text-xl font-bold text-gray-800 mb-2">Loading Islands</h3>
          <p class="text-gray-600">Discovering amazing destinations for your adventure...</p>
        </div>
      </div>

      <!-- Islands Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="(island, index) in islands"
          :key="island.island_id"
          class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        
        >
          <!-- Island Image -->
          <div class="relative">
            <div class="aspect-video w-full overflow-hidden">
              <img
                v-if="island.images && island.images.length"
                :src="`http://localhost:5000${island.images[0]}`"
                :alt="island.name"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span class="text-2xl">🏝️</span>
                  </div>
                  <p class="text-gray-500 text-sm">No Image Available</p>
                </div>
              </div>
            </div>
            
            <!-- Selection Badge -->
            <div v-if="selectedIslands.includes(island)" class="absolute top-4 right-4">
              <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>

            <!-- Price Badge -->
            <div class="absolute bottom-4 left-4">
              <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span class="text-orange-600 font-bold text-sm">₱{{ island.price }}</span>
              </div>
            </div>
          </div>

          <!-- Island Info -->
          <div class="p-6">
            <div class="mb-4">
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ island.name }}</h3>
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Created by {{ island.full_name }}
              </p>
            </div>

            <!-- Features -->
            <div v-if="island.features" class="mb-6">
              <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>✨</span>
                Features
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(feature, i) in island.features.split(',')" 
                  :key="i"
                  class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200"
                >
                  {{ feature.trim() }}
                </span>
              </div>
            </div>

            <!-- Action Button -->
            <button
              @click="toggleSelect(island)"
              :disabled="selectedIslands.length >= 3 && !selectedIslands.includes(island)"
              class="w-full py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              :class="selectedIslands.includes(island)
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300 hover:from-gray-200 hover:to-gray-300'
                : selectedIslands.length >= 3
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'"
            >
              <span v-if="selectedIslands.includes(island)" class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                Remove
              </span>
              <span v-else class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                Select Island
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && islands.length === 0" class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20">
          <div class="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-4xl">🏝️</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">No Islands Available</h3>
          <p class="text-gray-600 mb-6">We're working on adding more amazing destinations for your island hopping adventure.</p>
          <button
            @click="router.push({ name: 'BoatDetails', params: { id: boatId } })"
            class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Go Back to Boat Details
          </button>
        </div>
      </div>

      <!-- Continue Button -->
      <div v-if="!loading && islands.length > 0" class="mt-12">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-center sm:text-left">
              <h3 class="text-lg font-bold text-gray-800 mb-1">Ready to Continue?</h3>
              <p class="text-gray-600 text-sm">
                {{ selectedIslands.length === 0 
                  ? 'Select at least one island to continue' 
                  : `You've selected ${selectedIslands.length} island${selectedIslands.length > 1 ? 's' : ''}` 
                }}
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="router.push({ name: 'BoatDetails', params: { id: boatId } })"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                </svg>
                Back
              </button>
              
              <button
                @click="goToAddOns"
                :disabled="selectedIslands.length === 0 || loadingNext"
                class="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span v-if="loadingNext" class="flex items-center gap-2">
                  <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Loading...</span>
                </span>
                <span v-else class="flex items-center gap-2">
                  <span>🎯</span>
                  <span>Continue to Add-ons</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';

const router = useRouter();
const route = useRoute();
const boatId = route.params.id;

const islands = ref([]);
const loading = ref(true);
const selectedIslands = ref([]);
const loadingNext = ref(false);
const bookingInfo = ref(null);

onMounted(async () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true
  });

  try {
    const storedBooking = JSON.parse(localStorage.getItem("bookingInfo"));
    if (!storedBooking || !storedBooking.date || !storedBooking.time || !storedBooking.location) {
      router.push({ name: "BoatDetails", params: { id: boatId } });
      return;
    }
    bookingInfo.value = storedBooking;

    const res = await axios.get("http://localhost:5000/api/islands");
    islands.value = res.data;
  } catch (err) {
    console.error("Error fetching islands:", err);
  } finally {
    loading.value = false;
  }
});

const toggleSelect = (island) => {
  const index = selectedIslands.value.findIndex(i => i.island_id === island.island_id);
  if (index !== -1) {
    selectedIslands.value.splice(index, 1);
  } else if (selectedIslands.value.length < 3) {
    selectedIslands.value.push(island);
  }
};

const goToAddOns = () => {
  if (selectedIslands.value.length === 0) {
    alert("Please select at least one island to continue with your booking.");
    return;
  }

  if (selectedIslands.value.length > 3) {
    alert("You can select a maximum of 3 islands for your tour.");
    return;
  }

  loadingNext.value = true;

  // Simulate loading delay for better UX
  setTimeout(() => {
    const updatedBooking = {
      ...bookingInfo.value,
      islands: selectedIslands.value,
      totalIslandPrice: selectedIslands.value.reduce((sum, island) => sum + parseFloat(island.price), 0)
    };
    
    localStorage.setItem("bookingInfo", JSON.stringify(updatedBooking));
    router.push({ name: "AddOns", params: { id: boatId } });
  }, 1200);
};
</script>
