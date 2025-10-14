<script setup>
import { 
  TruckIcon, // Boat icon
  UserGroupIcon,
  DevicePhoneMobileIcon,
  LifebuoyIcon,
  CheckCircleIcon,
  StarIcon
} from "@heroicons/vue/24/outline";
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div data-aos="fade-up" data-aos-duration="1000" class="text-center mb-12 sm:mb-16 lg:mb-20">
        <div class="inline-flex items-center space-x-2 text-sm sm:text-base lg:text-lg font-semibold tracking-widest text-amber-400 mb-4 sm:mb-6 uppercase">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Our Premium Services</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg">
          Why Choose 
          <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            WaveVenture?
          </span>
        </h2>
        <p class="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          We make your island hopping adventure smooth and unforgettable with reliable boats, a skilled crew, easy booking, and round-the-clock support.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        
        <!-- Boat Rentals -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TruckIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Premium Boat Fleet</h3>
            <p class="text-gray-200 text-sm sm:text-base leading-relaxed drop-shadow-sm">
              Choose from our carefully maintained fleet of boats designed for comfort, safety, and unforgettable island-hopping experiences.
            </p>
          </div>
        </div>

        <!-- Professional Crew -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <StarIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Expert Crew</h3>
            <p class="text-gray-200 text-sm sm:text-base leading-relaxed drop-shadow-sm">
              Our experienced and certified crew ensures you enjoy a safe, smooth, and fun adventure with local knowledge and professional service.
            </p>
          </div>
        </div>

        <!-- Easy Booking -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DevicePhoneMobileIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Instant Booking</h3>
            <p class="text-gray-200 text-sm sm:text-base leading-relaxed drop-shadow-sm">
              Book your adventure in seconds with our user-friendly platform. Fast, secure, and hassle-free online reservation system.
            </p>
          </div>
        </div>

        <!-- 24/7 Support -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <LifebuoyIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">24/7 Support</h3>
            <p class="text-gray-200 text-sm sm:text-base leading-relaxed drop-shadow-sm">
              Round-the-clock customer support ensures peace of mind. We're always here to assist you before, during, and after your adventure.
            </p>
          </div>
        </div>

      </div>

      <!-- Additional Features Section -->
      <div class="mt-16 sm:mt-20 lg:mt-24" data-aos="fade-up" data-aos-delay="500">
        <div class="bg-white/5 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10">
          <div class="text-center mb-8 sm:mb-12">
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Additional <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Benefits</span>
            </h3>
            <p class="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto drop-shadow-sm">
              Experience the complete package with our comprehensive service offerings
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm sm:text-base">Safety Equipment</h4>
                <p class="text-gray-300 text-xs sm:text-sm">Life jackets & safety gear included</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm sm:text-base">Flexible Scheduling</h4>
                <p class="text-gray-300 text-xs sm:text-sm">Half-day & full-day options</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm sm:text-base">Local Expertise</h4>
                <p class="text-gray-300 text-xs sm:text-sm">Best spots & hidden gems</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm sm:text-base">Weather Updates</h4>
                <p class="text-gray-300 text-xs sm:text-sm">Real-time weather monitoring</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm sm:text-base">Photo Services</h4>
                <p class="text-gray-300 text-xs sm:text-sm">Capture your memories</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm sm:text-base">Group Discounts</h4>
                <p class="text-gray-300 text-xs sm:text-sm">Special rates for large groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

/* Enhanced shadow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgb(0 0 0 / 0.35);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}
</style>
