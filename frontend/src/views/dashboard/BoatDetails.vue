<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div v-if="boat" class="mb-6 sm:mb-8" >
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{{ boat.name }}</h1>
              <div class="flex items-center space-x-2 text-gray-600">
                <UserIcon class="h-4 w-4 text-orange-500" />
                <span class="text-sm sm:text-base">Owned by {{ boat.full_name }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                boat.status === 'Available' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              ]">
                <div :class="[
                  'w-2 h-2 rounded-full mr-2',
                  boat.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                ]"></div>
                {{ boat.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="boat" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- LEFT: Boat Images & Info (2/3 on desktop) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Carousel -->
          <div class="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
            <div class="aspect-video w-full">
              <img 
                :src="`http://localhost:5000${boat.images[currentImage]}`" 
                :alt="boat.name"
                class="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            <!-- Navigation Buttons -->
            <button 
              @click="prevImage"
              class="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
            </button>
            <button 
              @click="nextImage"
              class="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <ChevronRightIcon class="h-5 w-5 text-gray-700" />
            </button>

            <!-- Image Indicators -->
            <div v-if="boat.images && boat.images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              <button 
                v-for="(image, index) in boat.images" 
                :key="index"
                @click="currentImage = index"
                :class="[
                  'w-3 h-3 rounded-full transition-all duration-200',
                  currentImage === index ? 'bg-white shadow-lg' : 'bg-white/50'
                ]"
              ></button>
            </div>
          </div>

          <!-- Boat Information Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Capacity Card -->
            <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <UsersIcon class="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Capacity</p>
                  <p class="text-2xl font-bold text-gray-800">{{ boat.capacity }} people</p>
                </div>
              </div>
            </div>

            <!-- Boat Type Card -->
            <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <PaperAirplaneIcon class="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Boat Type</p>
                  <p class="text-2xl font-bold text-gray-800">{{ boat.boat_type || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Duration Card -->
            <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <ClockIcon class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Duration</p>
                  <p class="text-lg font-bold text-gray-800">{{ boat.duration_options || 'Flexible' }}</p>
                </div>
              </div>
            </div>

            <!-- Price Card -->
            <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <CurrencyDollarIcon class="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Price</p>
                  <p class="text-2xl font-bold text-gray-800">
                    ₱{{ Number(boat.rental_price).toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <SpeakerXMarkIcon class="h-6 w-6 text-orange-500" />
              Boat Features
            </h2>
            <div v-if="boat.features && parsedFeatures.length" class="flex flex-wrap gap-3">
              <span 
                v-for="(feature, i) in parsedFeatures" 
                :key="i"
                class="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 rounded-full px-4 py-2 text-sm font-medium border border-orange-200 hover:from-orange-200 hover:to-pink-200 transition-all duration-200"
              >
                {{ feature }}
              </span>
            </div>
            <div v-else class="text-gray-500 italic">
              No specific features listed for this boat.
            </div>
          </div>
        </div>

        <!-- RIGHT: Booking Form (1/3 on desktop) -->
        <div class="lg:col-span-1">
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 sticky top-6">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">🚤 Book This Boat</h2>
              <p class="text-gray-600 text-sm">Fill in the details to start your adventure</p>
            </div>

            <div class="space-y-6">
              <!-- Date Selection -->
              <div>
                <label class="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                  <span>📅</span>
                  Select Date
                </label>
                <input 
                  type="date" 
                  v-model="selectedDate"
                  :min="new Date().toISOString().split('T')[0]"
                  class="w-full border-2 border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <!-- Time Selection -->
              <div>
                <label class="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                  <span>⏰</span>
                  Pickup Time
                </label>
                <input 
                  type="time" 
                  v-model="pickupTime"
                  class="w-full border-2 border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <!-- Meetup Location -->
              <div v-if="boat.meetupLocations && boat.meetupLocations.length">
                <label class="flex text-sm font-semibold text-gray-700 mb-3 items-center gap-2">
                  <MapPinIcon class="h-5 w-5 text-orange-500" />
                  Meetup Location
                </label>
                <div class="space-y-2">
                  <button 
                    v-for="(location, i) in boat.meetupLocations" 
                    :key="i" 
                    @click="selectedLocation = location" 
                    :class="[
                      'w-full p-4 rounded-2xl text-sm font-medium transition-all duration-200 border-2',
                      selectedLocation === location
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-500 shadow-lg'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-300'
                    ]"
                  >
                    {{ location }}
                  </button>
                </div>
              </div>

              <!-- Price Summary -->
              <div class="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border border-orange-200">
                <div class="flex justify-between items-center">
                  <span class="text-gray-700 font-medium">Total Price:</span>
                  <span class="text-2xl font-bold text-orange-600">
                    ₱{{ Number(boat.rental_price).toLocaleString() }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">*Additional charges may apply for add-ons</p>
              </div>

              <!-- Book Now Button -->
              <button 
                @click="goToIslands" 
                :disabled="loading || !selectedDate || !pickupTime || !selectedLocation"
                class="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-3"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <span>🚤</span>
                  <span>Proceed to Choose Islands</span>
                </span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              </button>

              <!-- Validation Message -->
              <div v-if="!selectedDate || !pickupTime || !selectedLocation" class="text-center">
                <p class="text-sm text-gray-500">Please fill in all required fields to continue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center min-h-screen">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-orange-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Loading Boat Details</h3>
          <p class="text-gray-600">Please wait while we fetch the boat information...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from "sweetalert2";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  SpeakerXMarkIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const boatId = route.params.id;

const boat = ref(null);
const selectedDate = ref("");
const pickupTime = ref("");
const selectedLocation = ref("");
const currentImage = ref(0);
const loading = ref(false);

onMounted(async () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true
  });

  try {
    const res = await axios.get(`http://localhost:5000/api/boats/${boatId}`);
    boat.value = {
      ...res.data,
      meetupLocations: ["RORO Port Cordova", "Marigondon Port Lapu-Lapu City"],
    };
  } catch (error) {
    console.error("Error fetching boat:", error);
  }
});

const parsedFeatures = computed(() => {
  if (!boat.value?.features) return [];
  try {
    // If features is a JSON string, parse it
    const arr = typeof boat.value.features === "string"
      ? JSON.parse(boat.value.features)
      : boat.value.features;
    // Ensure all items are trimmed
    return Array.isArray(arr) ? arr.map(f => f.trim()) : [];
  } catch {
    // fallback if parsing fails
    return boat.value.features.split(',').map(f => f.trim());
  }
});

const nextImage = () => {
  if (boat.value?.images?.length) {
    currentImage.value = (currentImage.value + 1) % boat.value.images.length;
  }
};
const prevImage = () => {
  if (boat.value?.images?.length) {
    currentImage.value = (currentImage.value - 1 + boat.value.images.length) % boat.value.images.length;
  }
};

const goToIslands = async () => {
  // Validation
  if (!selectedDate.value || !pickupTime.value || !selectedLocation.value) {
    alert("Please fill in all required fields (date, time, and location) before proceeding.");
    return;
  }

  // Check if selected date is in the past
  const selectedDateTime = new Date(`${selectedDate.value}T${pickupTime.value}`);
  const now = new Date();
  
  if (selectedDateTime <= now) {
    await Swal.fire({
      icon: 'warning',
      title: 'Invalid date/time',
      text: 'Please select a future date and time for your booking.',
      confirmButtonColor: '#ea580c'
    });
    return;
  }

  loading.value = true;

  // Verify availability with backend
  try {
    const { data } = await axios.get(`http://localhost:5000/api/bookings/availability`, {
      params: { boatId, date: selectedDate.value }
    });
    if (!data.available) {
      loading.value = false;
      await Swal.fire({
        icon: 'error',
        title: 'Date unavailable',
        text: 'This boat is already booked on the selected date. Please choose another date.',
        confirmButtonColor: '#dc2626'
      });
      return;
    }
  } catch (e) {
    console.error('Availability check failed:', e);
    loading.value = false;
    await Swal.fire({
      icon: 'error',
      title: 'Availability check failed',
      text: 'Unable to verify availability at the moment. Please try again.',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  // Simulate loading delay for better UX
  setTimeout(() => {
    const bookingData = {
      boatId,
      boatName: boat.value?.name,
      boatPrice: boat.value?.rental_price,
      date: selectedDate.value,
      time: pickupTime.value,
      location: selectedLocation.value,
    };
    
    localStorage.setItem("bookingInfo", JSON.stringify(bookingData));
    router.push({ name: "ChooseIslands", params: { id: boatId } });
  }, 1500);
};
</script>
