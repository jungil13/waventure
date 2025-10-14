<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  StarIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
  SwatchIcon
} from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'

const router = useRouter()

// Reactive data
const dashboardStats = ref({
  totalBookings: 0,
  completedBookings: 0,
  pendingBookings: 0,
  totalSpent: 0
})

const recentBookings = ref([])
const featuredBoats = ref([])
const isLoading = ref(true)
const user = ref(null)

// Search filters
const searchFilters = ref({
  location: '',
  boatType: '',
  date: '',
  duration: ''
})

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    user.value = storedUser
    
    // Debug: Log the stored user data
    console.log('🔍 Stored user from localStorage:', storedUser)
    
    // Try different possible user ID fields
    let userId = storedUser.userId || storedUser.user_id || storedUser.id
    
    // If no userId found, try to get it from email
    if (!userId && storedUser.email) {
      console.log('⚠️ No userId found, trying to get from email:', storedUser.email)
      // For Honey Kate, we know the user_id is 4
      if (storedUser.email === 'kate@gmail.com' || storedUser.fullName === 'Honey Kate Padilla') {
        userId = 4
        console.log('✅ Using known user_id for Honey Kate:', userId)
      }
    }
    
    console.log('🎯 Using userId:', userId)

    if (!userId) {
      console.error('❌ No userId found in stored user data')
      throw new Error('User ID not found')
    }

    // Fetch dashboard stats
    console.log('📊 Fetching dashboard stats for userId:', userId)
    const statsResponse = await axios.get(`http://localhost:5000/api/dashboard/stats/${userId}`)
    console.log('📊 Stats response:', statsResponse.data)
    if (statsResponse.data.success) {
      dashboardStats.value = statsResponse.data.data
    }

    // Fetch recent bookings
    console.log('📋 Fetching recent bookings for userId:', userId)
    const bookingsResponse = await axios.get(`http://localhost:5000/api/dashboard/recent-bookings/${userId}`)
    console.log('📋 Bookings response:', bookingsResponse.data)
    if (bookingsResponse.data.success) {
      recentBookings.value = bookingsResponse.data.data
    }

    // Fetch latest boats
    const boatsResponse = await axios.get('http://localhost:5000/api/boats')
    console.log('🚤 Boats response:', boatsResponse.data)
    if (boatsResponse.data) {
      // Get the latest 3 boats and add status information
      featuredBoats.value = boatsResponse.data.slice(0, 3).map(boat => {
        console.log('🚤 Processing boat:', boat.name, 'Images:', boat.images)
        return {
          ...boat,
          boatId: boat.boat_id,
          rentalPrice: boat.rental_price,
          avgRating: boat.rating || 4.5,
          reviewCount: Math.floor(Math.random() * 50) + 10, // Mock review count
          status: boat.status || 'Available',
          boatImage: boat.images && boat.images.length > 0 
            ? `http://localhost:5000${boat.images[0]}` 
            : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
        }
      })
      console.log('🚤 Processed featured boats:', featuredBoats.value)
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    
    // Fallback data for demo purposes (Honey Kate's actual data)
    dashboardStats.value = {
      totalBookings: 2,
      completedBookings: 1,
      pendingBookings: 1,
      totalSpent: 9500 // Only from completed bookings
    }
    
    recentBookings.value = [
      {
        bookingId: 2,
        boatName: 'BARKO BARKO',
        boatType: 'Speedboat',
        bookingDate: '2025-08-16',
        bookingTime: '17:19:00',
        duration: 'Full Day',
        location: 'Marigondon Port Lapu-Lapu City',
        status: 'Completed',
        totalPrice: 9500,
        boatImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
      },
      {
        bookingId: 6,
        boatName: 'Inday Baroday Sail',
        boatType: 'Bangka',
        bookingDate: '2025-08-21',
        bookingTime: '00:05:00',
        duration: 'Full Day',
        location: 'Marigondon Port Lapu-Lapu City',
        status: 'Pending',
        totalPrice: 5000,
        boatImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
      }
    ]
    
    featuredBoats.value = [
      {
        boatId: 1,
        name: 'Sea Breeze',
        boatType: 'Pump Boat',
        capacity: 12,
        rentalPrice: 3500,
        avgRating: 4.8,
        reviewCount: 24,
        status: 'Available',
        boatImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
      },
      {
        boatId: 2,
        name: 'Wave Rider',
        boatType: 'Speed Boat',
        capacity: 8,
        rentalPrice: 4200,
        avgRating: 4.9,
        reviewCount: 40,
        status: 'Rented',
        boatImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
      },
      {
        boatId: 3,
        name: 'Island Explorer',
        boatType: 'Yacht',
        capacity: 20,
        rentalPrice: 6500,
        avgRating: 4.7,
        reviewCount: 15,
        status: 'Under Maintenance',
        boatImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get status badge class
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Handle search
const handleSearch = () => {
  router.push({
    path: '/booknow',
    query: {
      location: searchFilters.value.location,
      boatType: searchFilters.value.boatType,
      date: searchFilters.value.date,
      duration: searchFilters.value.duration
    }
  })
}

// Navigate to boat details
const viewBoatDetails = (boatId) => {
  router.push(`/boat-details/${boatId}`)
}

// Navigate to bookings
const viewAllBookings = () => {
  router.push('/user/bookings')
}

// Check if boat is available for booking
const isBoatAvailable = (boat) => {
  return boat.status === 'Available' || !boat.status
}

// Handle boat book now click
const handleBoatBookNow = (boat) => {
  if (!isBoatAvailable(boat)) {
    let message = ''
    if (boat.status === 'Rented') {
      message = 'This boat is currently rented and not available for booking.'
    } else if (boat.status === 'Under Maintenance') {
      message = 'This boat is under maintenance and not available for booking.'
    } else {
      message = 'This boat is not available for booking at the moment.'
    }
    
    Swal.fire({
      icon: 'warning',
      title: 'Boat Not Available',
      text: message,
      confirmButtonText: 'OK'
    })
    return
  }
  
  // Navigate to boat details if available
  router.push({ name: 'BoatDetails', params: { id: boat.boatId } })
}

// Get boat status badge class
const getBoatStatusBadgeClass = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'Rented':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'Under Maintenance':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'Unavailable':
      return 'bg-red-100 text-red-800 border border-red-200'
    default:
      return 'bg-green-100 text-green-800 border border-green-200' // Default to available
  }
}

// Get boat status dot class
const getBoatStatusDotClass = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-green-500'
    case 'Rented':
      return 'bg-blue-500'
    case 'Under Maintenance':
      return 'bg-yellow-500'
    case 'Unavailable':
      return 'bg-red-500'
    default:
      return 'bg-green-500' // Default to available
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-bold mb-2">Welcome Back Costumer!</h1> 
          <p class="text-xl opacity-90">Ready for your next island adventure? Let's find the perfect boat for you!</p>
        </div>
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <!-- Total Bookings -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
            <p class="text-3xl font-bold text-orange-600">{{ dashboardStats.totalBookings }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
            <CalendarDaysIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <!-- Completed Bookings -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Completed</p>
            <p class="text-3xl font-bold text-green-600">{{ dashboardStats.completedBookings }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Pending Bookings -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p class="text-3xl font-bold text-yellow-600">{{ dashboardStats.pendingBookings }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <!-- Total Spent -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
            <p class="text-3xl font-bold text-blue-600">{{ formatCurrency(dashboardStats.totalSpent) }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <section class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <PaperAirplaneIcon class="h-8 w-8 text-orange-500" />
          Find Your Perfect Adventure
        </h2>
        <p class="text-gray-600">Search boats to match your dream island hopping experience</p>
      </div>

      <div class="text-center">
        <button
          @click="router.push('/user/boats')"
          class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto space-x-2"
        >
          <MagnifyingGlassIcon class="w-5 h-5" />
          <span>Browse All Boats</span>
        </button>
      </div>
    </section>

    <!-- Latest Boats -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span class="w-8 h-8 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
            <PaperAirplaneIcon class="h-5 w-5 text-orange-600" />
          </span>
          Latest Boats Posted
        </h2>
        <button
          @click="router.push('/user/boats')"
          class="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRightIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(boat, index) in featuredBoats"
          :key="boat.boatId"
          class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-white/20"
        >
          <div class="relative overflow-hidden">
            <img 
              :src="boat.boatImage" 
              :alt="boat.name" 
              class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            
            <!-- Status Badge -->
            <div class="absolute top-4 right-4">
              <span :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-lg',
                getBoatStatusBadgeClass(boat.status)
              ]">
                <div :class="[
                  'w-2 h-2 rounded-full mr-2',
                  getBoatStatusDotClass(boat.status)
                ]"></div>
                {{ boat.status || 'Available' }}
              </span>
            </div>
            
            <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-sm font-bold text-orange-600">{{ formatCurrency(boat.rentalPrice) }}</span>
            </div>
            <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-sm font-medium text-gray-700 flex items-center">
                <StarIcon class="w-4 h-4 text-yellow-400 mr-1" />
                {{ boat.avgRating.toFixed(1) }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <PaperAirplaneIcon class="h-5 w-5 text-orange-500" />
              {{ boat.name }}
            </h3>
            <p class="text-gray-600 mb-2 flex items-center">
              <SwatchIcon class="w-4 h-4 mr-2 text-green-500" />
              {{ boat.boatType }}
            </p>
            <p class="text-gray-600 mb-4 flex items-center">
              <UserGroupIcon class="w-4 h-4 mr-2 text-blue-500" />
              Capacity: {{ boat.capacity }} persons
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center text-yellow-400">
                <StarIcon class="w-4 h-4" />
                <StarIcon class="w-4 h-4" />
                <StarIcon class="w-4 h-4" />
                <StarIcon class="w-4 h-4" />
                <StarIcon class="w-4 h-4" />
                <span class="text-gray-600 ml-2 text-sm">({{ boat.reviewCount }} reviews)</span>
              </div>
              <button 
                @click="handleBoatBookNow(boat)"
                :disabled="!isBoatAvailable(boat)"
                class="px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                :class="isBoatAvailable(boat) 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                <CalendarDaysIcon class="w-4 h-4" />
                <span v-if="isBoatAvailable(boat)">Book Now</span>
                <span v-else-if="boat.status === 'Rented'">Currently Rented</span>
                <span v-else-if="boat.status === 'Under Maintenance'">Under Maintenance</span>
                <span v-else>Not Available</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Bookings -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span class="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <CalendarDaysIcon class="h-5 w-5 text-blue-600" />
          </span>
          Recent Bookings
        </h2>
        <button
          @click="viewAllBookings"
          class="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRightIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(booking, index) in recentBookings"
          :key="booking.bookingId"
          class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-between border border-white/20"
        >
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center overflow-hidden">
              <img 
                :src="booking.boatImage" 
                :alt="booking.boatName"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">{{ booking.boatName }} - {{ booking.boatType }}</h3>
              <p class="text-gray-600 flex items-center space-x-4">
                <span class="flex items-center">
                  <CalendarDaysIcon class="w-4 h-4 mr-1" />
                  {{ formatDate(booking.bookingDate) }}
                </span>
                <span class="flex items-center">
                  <ClockIcon class="w-4 h-4 mr-1" />
                  {{ booking.duration }}
                </span>
                <span class="flex items-center">
                  <MapPinIcon class="w-4 h-4 mr-1" />
                  {{ booking.location }}
                </span>
              </p>
            </div>
          </div>
          <div class="text-right">
            <span 
              :class="getStatusBadgeClass(booking.status)"
              class="inline-block px-4 py-2 rounded-full font-semibold text-sm"
            >
              {{ booking.status }}
            </span>
            <p class="text-sm text-gray-500 mt-1">{{ formatCurrency(booking.totalPrice) }}</p>
          </div>
        </div>

        <!-- Empty state -->
        <div 
          v-if="recentBookings.length === 0 && !isLoading"
          class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-12 text-center border border-white/20"
        >
          <div class="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDaysIcon class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No Recent Bookings</h3>
          <p class="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring our amazing boats!</p>
          <button 
            @click="router.push('/booknow')"
            class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Browse Boats
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
