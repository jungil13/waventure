<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-8 sm:py-12 lg:py-16 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <div class="relative max-w-7xl mt-12 mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12" data-aos="fade-down">
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          Book Your
          <span class="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
          Select your preferred date and time to check available boats for your island hopping adventure in Cordova, Cebu.
        </p>
      </div>

      <!-- Booking Form -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-12" data-aos="zoom-in" data-aos-delay="200">
        <form @submit.prevent="checkAvailability" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Date Picker -->
            <div data-aos="fade-right" data-aos-delay="300">
              <label class="block text-sm font-medium text-gray-200 mb-3">
                <svg class="inline h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Choose Date
              </label>
              <input
                v-model="selectedDate"
                type="date"
                :min="minDate"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <!-- Time Picker -->
            <div data-aos="fade-left" data-aos-delay="400">
              <label class="block text-sm font-medium text-gray-200 mb-3">
                <svg class="inline h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Choose Time
              </label>
              <input
                v-model="selectedTime"
                type="time"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <!-- Duration Selection -->
          <div data-aos="fade-up" data-aos-delay="500">
            <label class="block text-sm font-medium text-gray-200 mb-3">
              <svg class="inline h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Duration
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                v-for="duration in durationOptions"
                :key="duration.value"
                type="button"
                @click="selectedDuration = duration.value"
                :class="[
                  'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                  selectedDuration === duration.value
                    ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10'
                ]"
              >
                <div class="font-semibold">{{ duration.label }}</div>
                <div class="text-sm opacity-75">{{ duration.description }}</div>
              </button>
            </div>
          </div>

          <!-- Check Availability Button -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="600">
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {{ isLoading ? 'Checking Availability...' : 'Check Availability' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Available Boats Section -->
      <div v-if="availableBoats.length > 0" class="mb-12" data-aos="fade-up" data-aos-delay="700">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Available Boats</h2>
          <p class="text-gray-300">Choose your perfect vessel for the adventure</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(boat, index) in availableBoats"
            :key="boat.boat_id"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
            data-aos="fade-up"
            :data-aos-delay="800 + (index * 100)"
          >
            <!-- Boat Image -->
            <div class="relative h-48 overflow-hidden">
              <img
                :src="boat.image || '/api/placeholder/400/300'"
                :alt="boat.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                @error="handleImageError"
              />
              <div class="absolute top-4 right-4">
                <span :class="getStatusBadgeClass(boat.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ boat.status }}
                </span>
              </div>
              <div class="absolute bottom-4 left-4">
                <span class="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ₱{{ boat.rental_price.toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Boat Info -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {{ boat.name }}
              </h3>
              <p class="text-gray-300 text-sm mb-4 line-clamp-2">{{ boat.features }}</p>
              
              <!-- Boat Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-300">
                  <svg class="h-4 w-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Capacity: {{ boat.capacity }} people
                </div>
                <div class="flex items-center text-sm text-gray-300">
                  <svg class="h-4 w-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Type: {{ boat.boat_type || 'Standard' }}
                </div>
              </div>

              <!-- Book Now Button -->
              <button
                @click="selectBoat(boat)"
                class="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Book This Boat
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="checked && !isLoading" class="text-center py-16" data-aos="fade-up">
        <div class="mx-auto h-24 w-24 bg-gray-500/20 rounded-full flex items-center justify-center mb-6">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">No Boats Available</h3>
        <p class="text-gray-300 mb-6">No boats are available for the selected date and time. Please try another slot.</p>
        <button
          @click="resetSearch"
          class="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200 border border-white/20"
        >
          Try Different Time
        </button>
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

const router = useRouter();

// Form data
const selectedDate = ref("");
const selectedTime = ref("");
const selectedDuration = ref("Half-day");
const availableBoats = ref([]);
const checked = ref(false);
const isLoading = ref(false);

// Duration options
const durationOptions = [
  { value: "Half-day", label: "Half Day", description: "4-6 hours" },
  { value: "Full-day", label: "Full Day", description: "8-10 hours" },
  { value: "Custom", label: "Custom", description: "Flexible timing" }
];

// Computed properties
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Methods
const checkAvailability = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Please select both date and time',
      showConfirmButton: false,
      timer: 2000
    });
    return;
  }

  isLoading.value = true;
  checked.value = true;

  try {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to check boat availability and make bookings.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ea580c'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    // Fetch available boats from backend
    const response = await axios.get('http://localhost:5000/api/boats/available', {
      params: {
        date: selectedDate.value,
        time: selectedTime.value,
        duration: selectedDuration.value
      }
    });

    availableBoats.value = response.data.map(boat => ({
      ...boat,
      image: getBoatImage(boat)
    }));

    if (availableBoats.value.length === 0) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'No boats available for selected time',
        showConfirmButton: false,
        timer: 3000
      });
    }

  } catch (error) {
    console.error('Error checking availability:', error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Failed to check availability',
      showConfirmButton: false,
      timer: 3000
    });
    
    // Fallback to dummy data for demo
    availableBoats.value = [
      {
        boat_id: 1,
        name: "Sea Explorer",
        features: "Perfect for family trips and small groups. Equipped with GPS, life jackets, and sound system.",
        capacity: 12,
        boat_type: "Speedboat",
        rental_price: 6000,
        status: "Available",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
      },
      {
        boat_id: 2,
        name: "Island Voyager",
        features: "Spacious boat ideal for group island hopping. Features comfortable seating and safety equipment.",
        capacity: 15,
        boat_type: "Bangka",
        rental_price: 8000,
        status: "Available",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
      },
      {
        boat_id: 3,
        name: "Adventure Rider",
        features: "Great for thrill-seekers and quick island tours. Fast and maneuverable.",
        capacity: 8,
        boat_type: "Speedboat",
        rental_price: 5000,
        status: "Available",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
      }
    ];
  } finally {
    isLoading.value = false;
  }
};

const getBoatImage = (boat) => {
  // If boat has images from database, use the first one
  if (boat.images && boat.images.length > 0) {
    const imageUrl = boat.images[0];
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:5000${imageUrl}`;
    } else {
      return `http://localhost:5000/uploads/boats/${imageUrl}`;
    }
  }
  
  // Fallback to placeholder
  return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=300&fit=crop`;
};

const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-500/80 text-white';
    case 'rented':
      return 'bg-red-500/80 text-white';
    case 'undermaintenance':
      return 'bg-yellow-500/80 text-white';
    default:
      return 'bg-gray-500/80 text-white';
  }
};

const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop';
};

const selectBoat = (boat) => {
  // Store selected boat and booking details
  const bookingData = {
    boat: boat,
    date: selectedDate.value,
    time: selectedTime.value,
    duration: selectedDuration.value
  };
  
  localStorage.setItem('selectedBoat', JSON.stringify(bookingData));
  
  // Navigate to booking details page
  router.push({
    name: 'boat-details',
    params: { id: boat.boat_id },
    query: {
      date: selectedDate.value,
      time: selectedTime.value,
      duration: selectedDuration.value
    }
  });
};

const resetSearch = () => {
  selectedDate.value = "";
  selectedTime.value = "";
  selectedDuration.value = "Half-day";
  availableBoats.value = [];
  checked.value = false;
};

// Initialize AOS
onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
  });
});
</script>
