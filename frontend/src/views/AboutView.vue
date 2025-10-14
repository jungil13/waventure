<script setup>
import { 
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  MapPinIcon,
  ClockIcon
} from "@heroicons/vue/24/outline";
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Section -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20" data-aos="fade-up" data-aos-duration="1000">
        <div class="inline-flex items-center space-x-2 text-sm sm:text-base lg:text-lg font-semibold tracking-widest text-amber-400 mb-4 sm:mb-6 uppercase">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>About WaveVenture</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg">
          Your Gateway to 
          <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Island Adventures
          </span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
          WaveVenture is your gateway to exploring the stunning islands of Cordova, Cebu. We provide safe and exciting boat adventures, guided by experienced crews to ensure your trip is unforgettable. From private rentals to fun group packages, we are committed to making your island-hopping experience seamless and memorable.
        </p>
      </div>

      <!-- Mission & Vision Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lg:mb-24">
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="zoom-in"
        >
          <div class="p-6 sm:p-8 lg:p-10">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <HeartIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-md">Our Mission</h3>
            </div>
            <p class="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed drop-shadow-sm">
              To provide the best island-hopping experience with safety, comfort, and unforgettable adventures, bringing people closer to the beauty of nature and the vibrant culture of Cordova.
            </p>
          </div>
        </div>

        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <div class="p-6 sm:p-8 lg:p-10">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <StarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-md">Our Vision</h3>
            </div>
            <p class="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed drop-shadow-sm">
              To be the leading island-hopping provider in Cebu, known for exceptional service, sustainability efforts, and creating memories that last a lifetime.
            </p>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="mb-16 sm:mb-20 lg:mb-24" data-aos="fade-up" data-aos-delay="300">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Our <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Core Values</span>
          </h2>
          <p class="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto drop-shadow-sm">
            The principles that guide everything we do
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <ShieldCheckIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Safety First</h3>
            <p class="text-gray-200 text-sm sm:text-base drop-shadow-sm">Your safety is our top priority with certified equipment and trained professionals.</p>
          </div>
          
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <UsersIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Customer Focus</h3>
            <p class="text-gray-200 text-sm sm:text-base drop-shadow-sm">We're dedicated to providing exceptional service and creating memorable experiences.</p>
          </div>
          
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <MapPinIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Local Expertise</h3>
            <p class="text-gray-200 text-sm sm:text-base drop-shadow-sm">Deep knowledge of local waters, hidden gems, and the best spots to visit.</p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="text-center" data-aos="fade-up" data-aos-delay="400">
        <div class="mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Meet Our <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Expert Crew</span>
          </h2>
          <p class="text-gray-200 text-base sm:text-lg max-w-3xl mx-auto drop-shadow-sm">
            Our professional and friendly crew members are dedicated to ensuring you have the best adventure possible — from safe travels to fun activities at sea.
          </p>
        </div>

        <!-- Crew Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
            data-aos="flip-left"
          >
            <div class="p-6 sm:p-8 text-center">
              <div class="relative mb-6">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <UsersIcon class="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <StarIcon class="w-5 h-5 text-white" />
                </div>
              </div>
              <h4 class="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-md">Captain Juan</h4>
              <p class="text-amber-400 font-semibold text-sm sm:text-base mb-3">Lead Captain</p>
              <p class="text-gray-200 text-xs sm:text-sm drop-shadow-sm">15+ years of experience navigating the waters of Cebu</p>
            </div>
          </div>

          <div
            class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
            data-aos="flip-left"
            data-aos-delay="200"
          >
            <div class="p-6 sm:p-8 text-center">
              <div class="relative mb-6">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <HeartIcon class="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <StarIcon class="w-5 h-5 text-white" />
                </div>
              </div>
              <h4 class="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-md">Maria</h4>
              <p class="text-amber-400 font-semibold text-sm sm:text-base mb-3">Tour Guide</p>
              <p class="text-gray-200 text-xs sm:text-sm drop-shadow-sm">Expert in local culture and marine life</p>
            </div>
          </div>

          <div
            class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
            data-aos="flip-left"
            data-aos-delay="400"
          >
            <div class="p-6 sm:p-8 text-center">
              <div class="relative mb-6">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <ShieldCheckIcon class="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <StarIcon class="w-5 h-5 text-white" />
                </div>
              </div>
              <h4 class="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-md">Pedro</h4>
              <p class="text-amber-400 font-semibold text-sm sm:text-base mb-3">Safety Officer</p>
              <p class="text-gray-200 text-xs sm:text-sm drop-shadow-sm">Certified in marine safety and emergency response</p>
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
