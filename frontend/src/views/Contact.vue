<script setup>
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
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
          <span>Get in Touch</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg">
          We'd Love to 
          <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Hear from You
          </span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Reach us anytime for bookings, questions, or support. Our team is here to help make your island adventure unforgettable!
        </p>
      </div>

      <!-- Contact Info Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24">
        <!-- Phone -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="zoom-in"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <PhoneIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Call Us</h3>
            <p class="text-gray-200 text-sm sm:text-base mb-2 drop-shadow-sm">+63 912 345 6789</p>
            <p class="text-amber-400 text-xs sm:text-sm font-medium">Available 24/7</p>
          </div>
        </div>

        <!-- Email -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <EnvelopeIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Email Us</h3>
            <p class="text-gray-200 text-sm sm:text-base mb-2 drop-shadow-sm">info@waventure.com</p>
            <p class="text-amber-400 text-xs sm:text-sm font-medium">Quick Response</p>
          </div>
        </div>

        <!-- Location -->
        <div
          class="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-500 sm:col-span-2 lg:col-span-1"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <div class="p-6 sm:p-8 text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPinIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-md">Visit Us</h3>
            <p class="text-gray-200 text-sm sm:text-base mb-2 drop-shadow-sm">Cordova, Cebu, Philippines</p>
            <p class="text-amber-400 text-xs sm:text-sm font-medium">Marina Location</p>
          </div>
        </div>
      </div>

      <!-- Contact Form & Additional Info -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
        <!-- Contact Form -->
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10" data-aos="fade-right">
          <div class="mb-6 sm:mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">
              Send us a <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Message</span>
            </h2>
            <p class="text-gray-200 text-sm sm:text-base drop-shadow-sm">
              Have questions about our services? Want to book a custom adventure? We're here to help!
            </p>
          </div>
          
          <form class="space-y-4 sm:space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label class="block text-white text-sm font-medium mb-2 drop-shadow-sm">First Name</label>
                <input 
                  type="text" 
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label class="block text-white text-sm font-medium mb-2 drop-shadow-sm">Last Name</label>
                <input 
                  type="text" 
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  placeholder="Your last name"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-white text-sm font-medium mb-2 drop-shadow-sm">Email</label>
              <input 
                type="email" 
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label class="block text-white text-sm font-medium mb-2 drop-shadow-sm">Phone</label>
              <input 
                type="tel" 
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="+63 912 345 6789"
              />
            </div>
            
            <div>
              <label class="block text-white text-sm font-medium mb-2 drop-shadow-sm">Message</label>
              <textarea 
                rows="4"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Tell us about your dream island adventure..."
              ></textarea>
            </div>
            
            <button 
              type="submit"
              class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 sm:py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>

        <!-- Additional Info -->
        <div class="space-y-6 sm:space-y-8" data-aos="fade-left">
          <!-- Business Hours -->
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
            <div class="flex items-center mb-4 sm:mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <ClockIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Business Hours</h3>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-200 text-sm sm:text-base">Monday - Friday</span>
                <span class="text-amber-400 font-semibold text-sm sm:text-base">6:00 AM - 8:00 PM</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-200 text-sm sm:text-base">Saturday - Sunday</span>
                <span class="text-amber-400 font-semibold text-sm sm:text-base">5:00 AM - 9:00 PM</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-200 text-sm sm:text-base">Emergency</span>
                <span class="text-green-400 font-semibold text-sm sm:text-base">24/7 Available</span>
              </div>
            </div>
          </div>

          <!-- Quick Response -->
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
            <div class="flex items-center mb-4 sm:mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <ChatBubbleLeftRightIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Quick Response</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <CheckCircleIcon class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-gray-200 text-sm sm:text-base">Phone calls answered within 2 rings</span>
              </div>
              <div class="flex items-center space-x-3">
                <CheckCircleIcon class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-gray-200 text-sm sm:text-base">Email responses within 1 hour</span>
              </div>
              <div class="flex items-center space-x-3">
                <CheckCircleIcon class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-gray-200 text-sm sm:text-base">WhatsApp support available</span>
              </div>
        </div>
      </div>

      <!-- Social Media -->
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
            <h3 class="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 drop-shadow-md">Follow Us</h3>
            <div class="flex space-x-4">
          <!-- Facebook -->
          <a
            href="https://facebook.com"
            target="_blank"
                class="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl hover:scale-110 transition-transform duration-300 shadow-lg"
            aria-label="Facebook"
          >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.676 0H1.326C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.326 24h11.494v-9.294H9.847v-3.622h2.973V8.413c0-2.947 1.796-4.555 4.416-4.555 1.256 0 2.337.093 2.651.135v3.073h-1.818c-1.427 0-1.703.678-1.703 1.672v2.191h3.406l-.444 3.622h-2.962V24h5.807C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.676 0"/>
            </svg>
          </a>

          <!-- Instagram -->
          <a
            href="https://instagram.com"
            target="_blank"
                class="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl hover:scale-110 transition-transform duration-300 shadow-lg"
            aria-label="Instagram"
          >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608.975-.975 2.242-1.253 3.608-1.315C8.416 2.175 8.796 2.163 12 2.163zm0 1.622c-3.18 0-3.552.012-4.805.07-1.065.049-1.643.228-2.024.389-.509.198-.872.436-1.255.819-.383.383-.621.746-.819 1.255-.161.381-.34.959-.389 2.024-.058 1.253-.07 1.625-.07 4.805s.012 3.552.07 4.805c.049 1.065.228 1.643.389 2.024.198.509.436.872.819 1.255.383.383.746.621 1.255.819.381.161.959.34 2.024.389 1.253.058 1.625.07 4.805.07s3.552-.012 4.805-.07c1.065-.049 1.643-.228 2.024-.389.509-.198.872-.436 1.255-.819.383-.383.621-.746.819-1.255.161-.381.34-.959.389-2.024.058-1.253.07-1.625.07-4.805s-.012-3.552-.07-4.805c-.049-1.065-.228-1.643-.389-2.024-.198-.509-.436-.872-.819-1.255-.383-.383-.746-.621-1.255-.819-.381-.161-.959-.34-2.024-.389-1.253-.058-1.625-.07-4.805-.07zM12 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 16 12a3.999 3.999 0 0 1-4 4zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
            </svg>
          </a>
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

/* Form input focus styles */
input:focus, textarea:focus {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Placeholder styles */
::placeholder {
  color: rgb(156, 163, 175);
}
</style>
