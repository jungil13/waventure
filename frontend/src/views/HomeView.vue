<script setup>
import imageUrl from '@/assets/bg.png';
import { RouterLink } from 'vue-router';
</script>

<template>
  <section
    class="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center text-center overflow-hidden"
    :style="{ backgroundImage: `url('${imageUrl}')` }"
  >
    <!-- Enhanced Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-black/20 via-black/20 to-black/20"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40"></div>

    <!-- Floating Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"></div>
      <div class="absolute top-40 right-20 w-1 h-1 bg-orange-400/40 rounded-full animate-pulse delay-1000"></div>
      <div class="absolute bottom-40 left-20 w-1.5 h-1.5 bg-amber-300/30 rounded-full animate-pulse delay-2000"></div>
      <div class="absolute top-60 left-1/4 w-1 h-1 bg-orange-300/50 rounded-full animate-pulse delay-3000"></div>
    </div>

    <!-- Content -->
    <div
      class="relative z-10 max-w-4xl px-4 sm:px-6 lg:px-8"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <!-- Small Tagline -->
      <div
        class="inline-flex items-center space-x-2 text-sm sm:text-base lg:text-lg font-semibold tracking-widest text-amber-400 mb-4 sm:mb-6 uppercase"
        data-aos="fade-down"
        data-aos-delay="200"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>Waventure Awaits You</span>
        <svg class="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <!-- Main Heading -->
      <h1
        class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 sm:mb-8 lg:mb-10 drop-shadow-2xl leading-tight"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Discover the Islands of 
        <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent animate-pulse">
          Cordova
        </span>
      </h1>

      <!-- Description -->
      <p
        class="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-10 lg:mb-12 leading-relaxed max-w-3xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        Sail into unforgettable adventures across pristine waters and hidden gems.
        From breathtaking views to fun activities and delicious food packages —
        your next island-hopping journey begins here.
      </p>

      <!-- Call to Action Buttons -->
      <div 
        class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        data-aos="zoom-in"
        data-aos-delay="800"
      >
        <RouterLink
          to="/login"
          class="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl overflow-hidden"
        >
          <span class="relative z-10 flex items-center space-x-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Book Your Adventure</span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </RouterLink>

        <RouterLink
          to="/fleet"
          class="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white border-2 border-white/30 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-xl"
        >
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Explore Fleet</span>
          </span>
        </RouterLink>
      </div>

      <!-- Stats Section -->
      <div 
        class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 max-w-2xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="1000"
      >
        <div class="text-center">
          <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-400 mb-1">50+</div>
          <div class="text-xs sm:text-sm text-gray-300">Islands</div>
        </div>
        <div class="text-center">
          <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-1">100+</div>
          <div class="text-xs sm:text-sm text-gray-300">Happy Customers</div>
        </div>
        <div class="text-center">
          <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-400 mb-1">24/7</div>
          <div class="text-xs sm:text-sm text-gray-300">Support</div>
        </div>
        <div class="text-center">
          <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-1">5★</div>
          <div class="text-xs sm:text-sm text-gray-300">Rating</div>
        </div>
      </div>
    </div>

    <!-- Enhanced Scroll Down Indicator -->
    <div
      class="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      data-aos="fade-up"
      data-aos-delay="1200"
    >
      <div class="flex flex-col items-center text-gray-200 group cursor-pointer">
        <div class="w-6 h-10 sm:w-8 sm:h-12 border-2 border-white/30 rounded-full flex justify-center group-hover:border-amber-400 transition-colors duration-300">
          <div class="w-1 h-3 sm:h-4 bg-white/60 rounded-full mt-2 sm:mt-3 animate-bounce group-hover:bg-amber-400 transition-colors duration-300"></div>
        </div>
        <span class="text-xs sm:text-sm mt-2 group-hover:text-amber-400 transition-colors duration-300">Scroll Down</span>
      </div>
    </div>
  </section>
    <footer class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 pt-16 pb-8 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <!-- Logo & Tagline -->
          <div class="lg:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <div class="relative">
                <img src="@/assets/logo.png" alt="Waventure Logo" class="h-12 w-auto" />
                <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full opacity-20"></div>
              </div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Waventure
              </h1>
            </div>
            <p class="text-base text-gray-400 leading-relaxed mb-6 max-w-md">
              Discover the beauty of Cordova's islands with our fleet of boats, 
              activities, and packages. Your adventure starts here!
            </p>
            <div class="flex space-x-4">
              <!-- Facebook -->
              <a href="#" class="group p-3 bg-gray-800/50 rounded-xl hover:bg-orange-500/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.95v-7.05H8v-2.9h2.5V9.5c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.62.76-1.62 1.54v1.84H16.5l-.4 2.9h-2.35V22A10 10 0 0022 12z" />
                </svg>
              </a>
              <!-- Instagram -->
              <a href="#" class="group p-3 bg-gray-800/50 rounded-xl hover:bg-orange-500/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                </svg>
              </a>
              <!-- Twitter -->
              <a href="#" class="group p-3 bg-gray-800/50 rounded-xl hover:bg-orange-500/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13c-1.38 1-4.22 1-5 1 .38.2 3.46 2 9 2 10.88 0 16-9 16-16v-.73A10.9 10.9 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center">
              <svg class="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              Quick Links
            </h2>
            <div class="space-y-3">
              <RouterLink to="/" class="block text-gray-400 hover:text-orange-400 transition-colors duration-300 group">
                <span class="group-hover:translate-x-1 inline-block transition-transform duration-300">Home</span>
              </RouterLink>
              <RouterLink to="/fleet" class="block text-gray-400 hover:text-orange-400 transition-colors duration-300 group">
                <span class="group-hover:translate-x-1 inline-block transition-transform duration-300">Our Fleet</span>
              </RouterLink>
              <RouterLink to="/services" class="block text-gray-400 hover:text-orange-400 transition-colors duration-300 group">
                <span class="group-hover:translate-x-1 inline-block transition-transform duration-300">Services</span>
              </RouterLink>
              <RouterLink to="/contact" class="block text-gray-400 hover:text-orange-400 transition-colors duration-300 group">
                <span class="group-hover:translate-x-1 inline-block transition-transform duration-300">Contact</span>
              </RouterLink>
              <RouterLink to="/about" class="block text-gray-400 hover:text-orange-400 transition-colors duration-300 group">
                <span class="group-hover:translate-x-1 inline-block transition-transform duration-300">About</span>
              </RouterLink>
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center">
              <svg class="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact Info
            </h2>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <p class="text-gray-400 text-sm">Cordova, Cebu</p>
                  <p class="text-gray-500 text-xs">Philippines</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <div>
                  <p class="text-gray-400 text-sm">+63 912 345 6789</p>
                  <p class="text-gray-500 text-xs">24/7 Support</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <div>
                  <p class="text-gray-400 text-sm">info@waventure.com</p>
                  <p class="text-gray-500 text-xs">Get in touch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-800">
          <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div class="text-center sm:text-left">
              <p class="text-gray-500 text-sm">
                © 2025 Waventure. All rights reserved. | Capstone Project
              </p>
            </div>
            <div class="flex items-center space-x-6 text-sm">
              <a href="#" class="text-gray-500 hover:text-orange-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" class="text-gray-500 hover:text-orange-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" class="text-gray-500 hover:text-orange-400 transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

</template>

<style scoped>
/* Smooth transition for the button */
a {
  transition: all 0.3s ease;
}
</style>
