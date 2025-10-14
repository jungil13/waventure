<template>
  <nav class="bg-white backdrop-blur-lg shadow-lg fixed w-full z-50 border-b border-gray-200/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 sm:h-18 lg:h-20 items-center">
        
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center space-x-2 sm:space-x-3">
          <RouterLink to="/" class="flex items-center space-x-2 sm:space-x-3 group">
            <div class="relative">
              <img src="@/assets/logo.png" alt="Waventure Logo" class="rounded-full h-8 w-auto sm:h-10 lg:h-12 transition-transform group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:shadow-orange-500/50">
              Waventure
            </h1>
          </RouterLink>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex flex-1 justify-center space-x-1 xl:space-x-2 items-center font-medium">
          <RouterLink 
            to="/" 
            class="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-orange-600 transition-all duration-300 group"
            :class="{ 'text-orange-600': $route.path === '/' }"
          >
            HOME
            <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </RouterLink>
          <RouterLink 
            to="/services" 
            class="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-orange-600 transition-all duration-300 group"
            :class="{ 'text-orange-600': $route.path === '/services' }"
          >
            SERVICES
            <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </RouterLink>
          <RouterLink 
            to="/contact" 
            class="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-orange-600 transition-all duration-300 group"
            :class="{ 'text-orange-600': $route.path === '/contact' }"
          >
            CONTACT
            <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </RouterLink>
          <RouterLink 
            to="/about" 
            class="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-orange-600 transition-all duration-300 group"
            :class="{ 'text-orange-600': $route.path === '/about' }"
          >
            ABOUT
            <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </RouterLink>
        </div>

        <!-- Action Buttons -->
        <div class="hidden lg:flex items-center space-x-2 xl:space-x-3">
          <RouterLink
            to="/fleet"
            class="relative px-4 xl:px-6 py-2 xl:py-2.5 text-sm xl:text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg xl:rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span class="relative z-10">BOOK NOW</span>
            <div class="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg xl:rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </RouterLink>
          <RouterLink
            to="/login"
            class="px-4 xl:px-6 py-2 xl:py-2.5 text-sm xl:text-base font-semibold text-gray-700 border-2 border-gray-300 rounded-lg xl:rounded-xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300"
          >
            SIGN IN
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center">
          <button 
            @click="isOpen = !isOpen" 
            class="relative p-2 text-gray-700 hover:text-orange-600 focus:outline-none transition-colors duration-300"
            :class="{ 'text-orange-600': isOpen }"
          >
            <div class="w-6 h-6 flex flex-col justify-center items-center">
              <span 
                class="block w-5 h-0.5 bg-current transition-all duration-300"
                :class="{ 'rotate-45 translate-y-1': isOpen, 'mb-1': !isOpen }"
              ></span>
              <span 
                class="block w-5 h-0.5 bg-current transition-all duration-300"
                :class="{ 'opacity-0': isOpen, 'mb-1': !isOpen }"
              ></span>
              <span 
                class="block w-5 h-0.5 bg-current transition-all duration-300"
                :class="{ '-rotate-45 -translate-y-1': isOpen }"
              ></span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="isOpen" 
      class="lg:hidden bg-white/98 backdrop-blur-lg shadow-xl border-t border-gray-200/50 transition-all duration-300 ease-in-out"
      :class="{ 'opacity-100 translate-y-0': isOpen, 'opacity-0 -translate-y-2': !isOpen }"
    >
      <div class="px-4 pt-4 pb-6 space-y-1">
        <RouterLink 
          to="/" 
          @click="isOpen = false"
          class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
          :class="{ 'text-orange-600 bg-orange-50': $route.path === '/' }"
        >
          HOME
        </RouterLink>
        <RouterLink 
          to="/services" 
          @click="isOpen = false"
          class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
          :class="{ 'text-orange-600 bg-orange-50': $route.path === '/services' }"
        >
          SERVICES
        </RouterLink>
        <RouterLink 
          to="/contact" 
          @click="isOpen = false"
          class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
          :class="{ 'text-orange-600 bg-orange-50': $route.path === '/contact' }"
        >
          CONTACT
        </RouterLink>
        <RouterLink 
          to="/about" 
          @click="isOpen = false"
          class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
          :class="{ 'text-orange-600 bg-orange-50': $route.path === '/about' }"
        >
          ABOUT
        </RouterLink>
        
        <!-- Mobile Action Buttons -->
        <div class="pt-4 space-y-3">
          <RouterLink
            to="/fleet"
            @click="isOpen = false"
            class="block w-full text-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg"
          >
            BOOK NOW
          </RouterLink>
          <RouterLink
            to="/login"
            @click="isOpen = false"
            class="block w-full text-center px-6 py-3 text-base font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300"
          >
            SIGN IN
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const isOpen = ref(false);
</script>

<style scoped>
/* Enhanced glow effect for Waventure logo */
.group:hover h1 {
  text-shadow: 
    0 0 10px rgba(251, 146, 60, 0.5),
    0 0 20px rgba(251, 146, 60, 0.3),
    0 0 30px rgba(251, 146, 60, 0.2),
    0 0 40px rgba(251, 146, 60, 0.1);
  filter: drop-shadow(0 0 8px rgba(251, 146, 60, 0.4));
}

/* Enhanced drop shadow effects */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.drop-shadow-2xl {
  filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
