<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8" >
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">Booking Management</h1>
        <p class="text-xl opacity-90">Monitor and manage all your boat bookings in one place</p>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">Upcoming</p>
            <h2 class="text-3xl font-bold text-white">{{ upcomingCount }}</h2>
            <p class="text-xs text-blue-400 mt-1">Active bookings</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <CalendarDaysIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
        <div>
            <p class="text-sm font-medium text-gray-300 mb-1">Completed</p>
            <h2 class="text-3xl font-bold text-white">{{ completedCount }}</h2>
            <p class="text-xs text-green-400 mt-1">Successful trips</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <CheckCircleIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
        <div>
            <p class="text-sm font-medium text-gray-300 mb-1">Cancelled</p>
            <h2 class="text-3xl font-bold text-white">{{ cancelledCount }}</h2>
            <p class="text-xs text-red-400 mt-1">Cancelled bookings</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <XCircleIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span class="text-white text-lg">Loading bookings...</span>
        </div>
        </div>
      </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/20 border border-red-500/30 rounded-3xl p-6 mb-8">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <span class="text-white text-lg">⚠️</span>
        </div>
        <div>
          <h3 class="text-red-400 font-semibold">Error Loading Bookings</h3>
          <p class="text-gray-300 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Bookings Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group"
      >
        <!-- Boat Image with Overlay -->
        <div class="relative w-full h-48 overflow-hidden">
          <img
            :src="booking.image ? `http://localhost:5000${booking.image}` : 'https://placehold.co/400x200/333333/ffffff?text=No+Image'"
            alt="Boat Image"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            @error="handleImageError"
          />
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span class="text-sm font-bold text-orange-600">₱{{ booking.amount }}</span>
          </div>
          <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span class="text-sm font-medium text-gray-700">#{{ booking.id }}</span>
          </div>
          <!-- Payment Status Indicator -->
          <div class="absolute top-4 left-4 flex flex-col space-y-1">
            <!-- Payment Proof Indicator -->
            <div v-if="booking.paymentProof" class="bg-green-500/90 backdrop-blur-sm rounded-full p-2">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Payment Status Badge -->
            <div 
              :class="{
                'bg-green-500/90': booking.paymentStatus === 'Paid',
                'bg-red-500/90': booking.paymentStatus === 'Unpaid'
              }"
              class="backdrop-blur-sm rounded-full px-2 py-1"
            >
              <span class="text-white text-xs font-semibold">
                {{ booking.paymentStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6 space-y-4">
        <!-- Header -->
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">{{ booking.boat }}</h2>
          <span
            :class="{
                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': booking.status === 'Pending',
                'bg-blue-500/20 text-blue-400 border border-blue-500/30': booking.status === 'Confirmed',
                'bg-green-500/20 text-green-400 border border-green-500/30': booking.status === 'Completed',
                'bg-red-500/20 text-red-400 border border-red-500/30': booking.status === 'Cancelled'
              }"
              class="px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ booking.status }}
          </span>
        </div>

          <!-- Customer Info -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm">{{ booking.customer.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-semibold text-white">{{ booking.customer }}</p>
              <p class="text-xs text-gray-400">Customer</p>
            </div>
          </div>

          <!-- Booking Details -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center space-x-2">
              <CalendarDaysIcon class="w-4 h-4 text-gray-400" />
              <span class="text-gray-200">{{ formatDate(booking.date) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <MapPinIcon class="w-4 h-4 text-gray-400" />
              <span class="text-gray-200">{{ booking.island }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <GiftIcon class="w-4 h-4 text-gray-400" />
              <span class="text-gray-200">{{ booking.foodPackage }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <PlusIcon class="w-4 h-4 text-gray-400" />
              <span class="text-gray-200">{{ booking.addons }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <CreditCardIcon class="w-4 h-4 text-gray-400" />
              <span class="text-gray-200">{{ booking.paymentMethod }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-gray-200">
                {{ booking.paymentProof ? 'Payment proof uploaded' : 'No payment proof' }}
              </span>
            </div>
        </div>

        <!-- Actions -->
          <div class="flex justify-end space-x-2 pt-4">
          <button
            @click="viewBooking(booking)"
              class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
              <EyeIcon class="w-4 h-4" />
              <span class="hidden sm:inline">View</span>
          </button>
          <button
            v-if="booking.paymentProof"
            @click="viewPaymentProof(booking)"
              class="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="hidden sm:inline">Proof</span>
          </button>
          <button
            @click="editBooking(booking)"
              class="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
              <PencilSquareIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Edit</span>
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Booking Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm"
    >
      <div
        class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-3xl shadow-2xl border border-white/20 relative text-white overflow-y-auto max-h-[90vh]"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="mb-6">
          <h2 class="text-3xl font-bold mb-2 flex items-center space-x-2">
            <DocumentTextIcon class="w-8 h-8 text-orange-500" />
            <span>Booking Details</span>
          </h2>
          <p class="text-gray-300">Manage booking information and status</p>
        </div>

        <!-- Booking Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <DocumentTextIcon class="w-5 h-5 text-blue-400" />
              <span>Basic Information</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Booking ID:</span>
                <span class="text-white font-medium">#{{ selectedBooking.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Boat:</span>
                <span class="text-white font-medium">{{ selectedBooking.boat }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Customer:</span>
                <span class="text-white font-medium">{{ selectedBooking.customer }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Date:</span>
                <span class="text-white font-medium">{{ formatDate(selectedBooking.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Time:</span>
                <span class="text-white font-medium">{{ formatTime(selectedBooking.time) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <CreditCardIcon class="w-5 h-5 text-green-400" />
              <span>Payment Details</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Amount:</span>
                <span class="text-green-400 font-bold">₱{{ selectedBooking.amount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Payment Method:</span>
                <span class="text-white font-medium">{{ selectedBooking.paymentMethod }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Payment Status:</span>
                <span 
                  :class="{
                    'text-green-400': selectedBooking.paymentStatus === 'Paid',
                    'text-red-400': selectedBooking.paymentStatus === 'Unpaid'
                  }"
                  class="font-medium"
                >
                  {{ selectedBooking.paymentStatus }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Island:</span>
                <span class="text-white font-medium">{{ selectedBooking.island }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Food Package:</span>
                <span class="text-white font-medium">{{ selectedBooking.foodPackage }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Proof Section -->
        <div v-if="selectedBooking.paymentProof" class="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 class="font-semibold text-white mb-4 flex items-center space-x-2">
            <DocumentTextIcon class="w-5 h-5 text-yellow-400" />
            <span>Payment Proof</span>
          </h3>
          <div class="space-y-4">
            <!-- Payment Proof Image -->
            <div class="flex justify-center">
              <div class="relative group">
                <img 
                  :src="getPaymentProofUrl(selectedBooking.paymentProof)" 
                  alt="Payment Proof" 
                  class="max-w-full h-auto max-h-96 rounded-xl shadow-lg border border-white/20 cursor-pointer hover:scale-105 transition-transform duration-300"
                  @error="handlePaymentProofError"
                  @click="openPaymentProofModal"
                />
                <div v-if="paymentProofError" class="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-xl">
                  <div class="text-center text-white">
                    <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm">Payment proof image not found</p>
                    <p class="text-xs text-gray-400 mt-1 break-all px-4">{{ selectedBooking.paymentProof }}</p>
                  </div>
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <div class="text-white text-center">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                    <p class="text-sm font-medium">Click to enlarge</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Payment Proof Actions -->
            <div class="flex justify-center space-x-4">
              <button
                @click="openPaymentProofModal"
                class="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
                <span>View Full Size</span>
              </button>
              <button
                @click="downloadPaymentProof"
                class="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Status Management -->
        <div class="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 class="font-semibold text-white mb-4 flex items-center space-x-2">
            <ClockIcon class="w-5 h-5 text-purple-400" />
            <span>Status Management</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Booking Status -->
            <div>
              <label class="text-gray-300 font-medium mb-2 block">Booking Status:</label>
              <select
                v-model="selectedBooking.status"
                class="w-full bg-white font-bold border border-white/20 rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Pending" class="font-bold">Pending</option>
                <option value="Confirmed" class="font-bold">Confirmed</option>
                <option value="Completed" class="font-bold">Completed</option>
                <option value="Cancelled" class="font-bold">Cancelled</option>
              </select>
            </div>
            
            <!-- Payment Status -->
            <div>
              <label class="text-gray-300 font-medium mb-2 block">Payment Status:</label>
              <select
                v-model="selectedBooking.paymentStatus"
                class="w-full bg-white font-bold border border-white/20 rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Unpaid" class="font-bold">Unpaid</option>
                <option value="Paid" class="font-bold">Paid</option>
              </select>
            </div>
          </div>
          
          <!-- Auto-payment notice -->
          <div v-if="selectedBooking.status === 'Confirmed'" class="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-blue-400 text-sm font-medium">
                Auto-payment: When status is "Confirmed", payment will automatically be set to "Paid"
              </span>
            </div>
          </div>
        </div>

        <!-- Booking History -->
        <div class="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 class="font-semibold text-white mb-4 flex items-center space-x-2">
            <DocumentTextIcon class="w-5 h-5 text-indigo-400" />
            <span>Booking History</span>
          </h3>
          <div class="space-y-3">
            <div
              v-for="(log, index) in selectedBooking.history"
              :key="index"
              class="flex items-start space-x-3 p-3 bg-white/5 rounded-xl"
            >
              <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span class="text-gray-200 text-sm">{{ log }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            @click="closeModal"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          <button
            @click="saveBooking"
            class="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Proof Modal -->
    <div
      v-if="showPaymentProofModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 backdrop-blur-sm"
      @click="closePaymentProofModal"
    >
      <div
        class="relative max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20"
        @click.stop
      >
        <button
          @click="closePaymentProofModal"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="text-center mb-4">
          <h3 class="text-2xl font-bold text-white mb-2">Payment Proof</h3>
          <p class="text-gray-300">Booking #{{ selectedBooking.id }}</p>
        </div>

        <div class="flex justify-center">
          <img 
            :src="getPaymentProofUrl(selectedBooking.paymentProof)" 
            alt="Payment Proof" 
            class="max-w-full h-auto max-h-[70vh] rounded-xl shadow-lg border border-white/20"
            @error="handlePaymentProofError"
          />
        </div>

        <div class="flex justify-center space-x-4 mt-6">
          <button
            @click="downloadPaymentProof"
            class="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-6 py-3 rounded-xl transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Download Image</span>
          </button>
          <button
            @click="closePaymentProofModal"
            class="flex items-center space-x-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 px-6 py-3 rounded-xl transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { bookingService } from "@/services/bookingService";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  MapPinIcon,
  GiftIcon,
  PlusIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";

// Reactive data
const bookings = ref([]);
const showModal = ref(false);
const showPaymentProofModal = ref(false);
const selectedBooking = ref({});
const loading = ref(false);
const error = ref(null);
const paymentProofError = ref(false);

// Get current owner ID from localStorage or context
const getCurrentOwnerId = () => {
  // This should be replaced with actual authentication logic
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.user_id || 2; // Default to owner ID 2 for testing
};

// Computed properties for stats
const upcomingCount = computed(() => {
  return bookings.value.filter((b) => b.status === "Pending" || b.status === "Confirmed").length;
});

const completedCount = computed(() => {
  return bookings.value.filter((b) => b.status === "Completed").length;
});

const cancelledCount = computed(() => {
  return bookings.value.filter((b) => b.status === "Cancelled").length;
});

// API Functions
const fetchOwnerBookings = async () => {
  try {
    loading.value = true;
    error.value = null;
    const ownerId = getCurrentOwnerId();
    const data = await bookingService.getOwnerBookings(ownerId);
    bookings.value = data;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    error.value = "Failed to fetch bookings. Please try again.";
    // Fallback to mock data for development
    bookings.value = [
  {
    id: "B001",
    boat: "BARKO BARKO",
    customer: "Honey Kate Padilla",
    date: "2025-08-16",
    time: "17:19:00",
    island: "Sulpa Island",
    foodPackage: "Sea Foods",
    addons: "Karaoke Set",
    amount: 9500,
    paymentMethod: "COD",
    paymentProof: null,
    status: "Completed",
    history: ["Booking created on 2025-08-29", "Completed on 2025-08-29"],
  },
  {
    id: "B002",
    boat: "Inday Baroday Sail",
    customer: "Mikha Lim",
    date: "2025-08-30",
    time: "19:37:00",
    island: "Caohagan Island",
    foodPackage: "Lechon",
    addons: "Kayak",
    amount: 4700,
    paymentMethod: "GCash",
    paymentProof: "/uploads/payments/1756463857020-ChatGPT Image Aug 29, 2025, 04_14_15 AM.png",
    status: "Pending",
    history: ["Booking created on 2025-08-29"],
  },
  {
    id: "B003",
    boat: "Inday Baroday Sail",
    customer: "Honey Kate Padilla",
    date: "2025-08-21",
    time: "00:05:00",
    island: "Caohagan Island",
    foodPackage: "No Package",
    addons: "Kayak",
    amount: 5000,
    paymentMethod: "GCash",
    paymentProof: "/uploads/payments/1756484270193-c3b3ef3d94cddaf939d67ae0f9126927.jpg",
    status: "Confirmed",
    history: ["Booking created on 2025-08-29"],
  },
  {
    id: "B004",
    boat: "Kris Luci",
    customer: "John Doe",
    date: "2025-09-06",
    time: "17:19:00",
    island: "Olango Island",
    foodPackage: "Sea Foods Package",
    addons: "Snorkeling Gear",
    amount: 4900,
    paymentMethod: "GCash",
    paymentProof: "/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg",
    status: "Pending",
    history: ["Booking created on 2025-09-06"],
  },
    ];
  } finally {
    loading.value = false;
  }
};

const updateBookingStatus = async (bookingId, newStatus, paymentStatus = null) => {
  try {
    const requestBody = { status: newStatus };
    if (paymentStatus) {
      requestBody.paymentStatus = paymentStatus;
    }
    
    const data = await bookingService.updateBookingStatus(bookingId, newStatus, paymentStatus);
    
    // Update local state
    const bookingIndex = bookings.value.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      bookings.value[bookingIndex].status = newStatus;
      if (paymentStatus) {
        bookings.value[bookingIndex].paymentStatus = paymentStatus;
      }
      bookings.value[bookingIndex].history.push(
        `Status updated to ${newStatus} on ${new Date().toISOString().split("T")[0]}`
      );
      if (paymentStatus) {
        bookings.value[bookingIndex].history.push(
          `Payment status updated to ${paymentStatus} on ${new Date().toISOString().split("T")[0]}`
        );
      }
    }
    
    return data;
  } catch (err) {
    console.error("Error updating booking status:", err);
    throw new Error("Failed to update booking status");
  }
};

const updatePaymentStatus = async (bookingId, paymentStatus) => {
  try {
    const data = await bookingService.updatePaymentStatus(bookingId, paymentStatus);
    
    // Update local state
    const bookingIndex = bookings.value.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      bookings.value[bookingIndex].paymentStatus = paymentStatus;
      bookings.value[bookingIndex].history.push(
        `Payment status updated to ${paymentStatus} on ${new Date().toISOString().split("T")[0]}`
      );
    }
    
    return data;
  } catch (err) {
    console.error("Error updating payment status:", err);
    throw new Error("Failed to update payment status");
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If it's today
    if (diffDays === 0) {
      return 'Today';
    }
    // If it's yesterday
    if (diffDays === 1) {
      return 'Yesterday';
    }
    // If it's within a week
    if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
    // Default format
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    // If timeString is in HH:MM:SS format, extract just HH:MM
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const min = minutes;
      
      // Convert to 12-hour format
      if (hour === 0) {
        return `12:${min} AM`;
      } else if (hour < 12) {
        return `${hour}:${min} AM`;
      } else if (hour === 12) {
        return `12:${min} PM`;
      } else {
        return `${hour - 12}:${min} PM`;
      }
    }
    return timeString;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

const getPaymentProofUrl = (paymentProof) => {
  if (!paymentProof) return null;
  
  // If it's already a full URL, return as is
  if (paymentProof.startsWith('http')) {
    return paymentProof;
  }
  
  // If it's a relative path, construct the full URL
  return `http://localhost:5000${paymentProof}`;
};

// Payment proof modal functions
const openPaymentProofModal = () => {
  showPaymentProofModal.value = true;
  paymentProofError.value = false;
};

const closePaymentProofModal = () => {
  showPaymentProofModal.value = false;
};

const downloadPaymentProof = async () => {
  if (!selectedBooking.value.paymentProof) return;
  
  try {
    const imageUrl = getPaymentProofUrl(selectedBooking.value.paymentProof);
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `payment_proof_booking_${selectedBooking.value.id}.jpg`;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    console.log('Payment proof download initiated');
  } catch (error) {
    console.error('Error downloading payment proof:', error);
  }
};

// Event handlers
const viewBooking = (booking) => {
  selectedBooking.value = { ...booking };
  showModal.value = true;
};

const editBooking = (booking) => {
  selectedBooking.value = { 
    ...booking, 
    originalStatus: booking.status,
    originalPaymentStatus: booking.paymentStatus 
  };
  showModal.value = true;
};

const viewPaymentProof = (booking) => {
  selectedBooking.value = { ...booking };
  openPaymentProofModal();
};

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400x200/333333/ffffff?text=No+Image';
};

const handlePaymentProofError = (event) => {
  paymentProofError.value = true;
};

const saveBooking = async () => {
  try {
    const statusChanged = selectedBooking.value.status !== selectedBooking.value.originalStatus;
    const paymentStatusChanged = selectedBooking.value.paymentStatus !== selectedBooking.value.originalPaymentStatus;
    
    if (statusChanged || paymentStatusChanged) {
      // If both status and payment status changed, or if status is "Confirmed" (auto-payment)
      if ((statusChanged && paymentStatusChanged) || selectedBooking.value.status === 'Confirmed') {
        await updateBookingStatus(selectedBooking.value.id, selectedBooking.value.status, selectedBooking.value.paymentStatus);
      } else if (statusChanged) {
        await updateBookingStatus(selectedBooking.value.id, selectedBooking.value.status);
      } else if (paymentStatusChanged) {
        await updatePaymentStatus(selectedBooking.value.id, selectedBooking.value.paymentStatus);
      }
    }
    closeModal();
  } catch (err) {
    console.error("Error saving booking:", err);
    error.value = "Failed to update booking. Please try again.";
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedBooking.value = {};
  paymentProofError.value = false;
};

// Initialize component
onMounted(async () => {
  AOS.init({ duration: 1000, once: true });
  await fetchOwnerBookings();
});
</script>
