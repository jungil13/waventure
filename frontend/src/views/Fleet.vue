<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import axios from "axios";

const router = useRouter();
const boats = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch boats from API
const fetchBoats = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await axios.get('http://localhost:5000/api/boats');
    
    console.log('API Response:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      boats.value = response.data.map(boat => {
        // Get boat images from the 'images' field (from boatimages table)
        let boatImages = boat.images || [];
        
        console.log(`Boat ${boat.name} images:`, boatImages);
        
        // Get the first image or use default
        let imageUrl = null;
        if (boatImages && boatImages.length > 0) {
          const firstImage = boatImages[0];
          console.log(`First image for ${boat.name}:`, firstImage);
          
          if (firstImage.startsWith('http')) {
            imageUrl = firstImage;
          } else if (firstImage.startsWith('/')) {
            imageUrl = `http://localhost:5000${firstImage}`;
          } else {
            imageUrl = `http://localhost:5000/uploads/boats/${firstImage}`;
          }
          
          console.log(`Final image URL for ${boat.name}:`, imageUrl);
        }
        
        return {
          id: boat.boat_id,
          name: boat.name,
          description: boat.features || "Experience the perfect island hopping adventure with our premium boat service.",
          image: imageUrl, // This will be null if no images, triggering the error handler
          capacity: boat.capacity,
          boat_type: boat.boat_type,
          rental_price: boat.rental_price,
          duration_options: boat.duration_options,
          status: boat.status,
          owner_id: boat.owner_id
        };
      });
    }
  } catch (err) {
    console.error("Error fetching boats:", err);
    error.value = "Failed to load boats. Please try again.";
    
    // Fallback to sample data
    boats.value = [
      {
        id: 1,
        name: "Sea Explorer",
        description: "Perfect for family island hopping adventures with spacious seating.",
        image: null,
        capacity: 12,
        boat_type: "Speedboat",
        rental_price: 6000,
        duration_options: "Half-day, Full-day",
        status: "Available"
      },
      {
        id: 2,
        name: "Wave Rider",
        description: "Fast and thrilling boat ride for adrenaline seekers.",
        image: null,
        capacity: 8,
        boat_type: "Speedboat",
        rental_price: 4500,
        duration_options: "Half-day, Full-day",
        status: "Available"
      },
      {
        id: 3,
        name: "Island Cruiser",
        description: "Luxury cruising with comfort and style for long adventures.",
        image: null,
        capacity: 15,
        boat_type: "Bangka",
        rental_price: 8000,
        duration_options: "Full-day",
        status: "Available"
      }
    ];
  } finally {
    loading.value = false;
  }
};

// Handle book now click
const handleBookNow = (boat) => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.userId) {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login first to use our full features and book your adventure!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Go to Login',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-orange-400',
        confirmButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
  } else {
    // User is logged in, redirect to booking page
    router.push({
      path: '/booknow',
      query: { boatId: boat.id }
    });
  }
};

// Get boat type icon
const getBoatTypeIcon = (boatType) => {
  switch (boatType?.toLowerCase()) {
    case 'speedboat':
      return '🚤';
    case 'bangka':
      return '⛵';
    case 'yacht':
      return '🛥️';
    default:
      return '🚤';
  }
};

// Handle image loading errors
const handleImageError = (event) => {
  // Hide the broken image and show placeholder
  event.target.style.display = 'none';
  const placeholder = event.target.nextElementSibling;
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
};

// Get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-green-500 text-white border-green-500/30';
    case 'rented':
      return 'bg-red-500 text-white border-red-500/30';
    case 'undermaintenance':
      return 'bg-yellow-500 text-white border-yellow-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

onMounted(async () => {
  AOS.init({
    duration: 1000,
    once: true,
  });
  
  await fetchBoats();
});
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 sm:mb-16 lg:mb-20" data-aos="fade-down">
        <div class="inline-flex items-center space-x-2 text-sm sm:text-base lg:text-lg font-semibold tracking-widest text-amber-400 mb-4 sm:mb-6 uppercase">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Book Your Adventure</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg">
          Choose Your 
          <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Discover our carefully curated fleet of boats, each designed to provide the perfect island hopping experience for your next adventure.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12 sm:py-16">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div class="flex items-center space-x-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span class="text-white text-lg">Loading our amazing fleet...</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-500/20 border border-red-500/30 rounded-3xl p-6 mb-8 max-w-2xl mx-auto">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-red-400 font-semibold">Error Loading Fleet</h3>
            <p class="text-gray-300 text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Boat Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        <div
          v-for="boat in boats"
          :key="boat.id"
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="zoom-in"
          :data-aos-delay="boat.id * 100"
        >
          <!-- Boat Image -->
          <div class="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
            <img
              v-if="boat.image"
              :src="boat.image"
              :alt="boat.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              @error="handleImageError"
            />
            <!-- Placeholder when no image -->
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <svg class="w-16 h-16 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 19a9 9 0 0118 0H3zM12 11a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
                <p class="text-sm font-medium">No Image Available</p>
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span 
                :class="getStatusColor(boat.status)"
                class="px-2 sm:px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm shadow-lg"
              >
                {{ boat.status }}
              </span>
            </div>

            <!-- Boat Type Badge -->
            <div class="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 shadow-lg">
              <span class="text-sm sm:text-lg">{{ getBoatTypeIcon(boat.boat_type) }}</span>
              <span class="hidden sm:inline">{{ boat.boat_type }}</span>
            </div>

            <!-- Price Badge -->
            <div class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold shadow-lg text-sm sm:text-base">
              ₱{{ boat.rental_price?.toLocaleString() || '0' }}
            </div>
          </div>

          <!-- Boat Info -->
          <div class="p-4 sm:p-6 lg:p-8">
            <div class="mb-4 sm:mb-6">
              <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 drop-shadow-md">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19a9 9 0 0118 0H3zM12 11a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
                <span class="truncate">{{ boat.name }}</span>
              </h2>
            
            </div>

            <!-- Boat Details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div class="flex items-center space-x-2 bg-white/5 rounded-lg p-2 sm:p-3">
                <svg class="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span class="text-gray-200 text-xs sm:text-sm font-medium">{{ boat.capacity }} people</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/5 rounded-lg p-2 sm:p-3">
                <svg class="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-gray-200 text-xs sm:text-sm font-medium">{{ boat.duration_options || 'Flexible' }}</span>
              </div>
            </div>

            <!-- Book Now Button -->
            <button
              @click="handleBookNow(boat)"
              class="w-full group/btn relative bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span class="relative z-10 flex items-center justify-center space-x-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span class="text-sm sm:text-base">Book Now</span>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && boats.length === 0" class="text-center py-12 sm:py-16">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20 max-w-md mx-auto">
          <svg class="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19a9 9 0 0118 0H3zM12 11a4 4 0 100-8 4 4 0 000 8z"/>
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">No Boats Available</h3>
          <p class="text-gray-400">We're currently updating our fleet. Please check back soon!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional: Smooth scrolling AOS fix */
html {
  scroll-behavior: smooth;
}

/* Custom line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced text shadows for better visibility */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.drop-shadow-md {
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
}

.drop-shadow-sm {
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
}

/* Enhanced card hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Better text contrast */
.text-gray-200 {
  color: rgb(229 231 235);
}

.text-gray-300 {
  color: rgb(209 213 219);
}

/* Responsive image loading */
img {
  transition: transform 0.7s ease-in-out;
}

/* Enhanced button hover effects */
.group\/btn:hover {
  transform: scale(1.05);
}

/* Better badge visibility */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Improved gradient overlays */
.bg-gradient-to-t {
  background-image: linear-gradient(to top, var(--tw-gradient-stops));
}

/* Enhanced shadow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgb(0 0 0 / 0.35);
}
</style>
