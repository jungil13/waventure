<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8" data-aos="fade-down">
        <div class="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative z-10">
            <h1 class="text-4xl font-bold mb-2">⭐ Rate Your Experience</h1>
            <p class="text-xl opacity-90">Share your thoughts about your boat rental experience</p>
          </div>
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>

      <!-- Booking Details -->
      <div v-else-if="booking" class="space-y-8">
        <!-- Booking Info Card -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20" data-aos="fade-up">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">📋 Booking Details</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Boat Image -->
            <div class="relative">
              <img 
                v-if="booking.boat_image"
                :src="`http://localhost:5000${booking.boat_image}`" 
                :alt="booking.boat_name"
                class="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <div v-else class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                <span class="text-gray-500 text-lg">No Image Available</span>
              </div>
            </div>

            <!-- Booking Info -->
            <div class="space-y-4">
              <div class="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">{{ booking.boat_name }}</h3>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span class="text-orange-600 font-bold">🚤</span>
                    </div>
                    <span class="text-gray-700"><strong>Type:</strong> {{ booking.boat_type }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span class="text-orange-600 font-bold">📅</span>
                    </div>
                    <span class="text-gray-700"><strong>Date:</strong> {{ formatDate(booking.booking_date) }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span class="text-orange-600 font-bold">💰</span>
                    </div>
                    <span class="text-gray-700"><strong>Price:</strong> {{ formatCurrency(booking.rental_price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Form -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20" data-aos="fade-up" data-aos-delay="200">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">⭐ Write Your Review</h2>
          
          <!-- Already Reviewed Alert -->
          <div v-if="hasReviewed" class="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 text-xl">ℹ️</span>
              </div>
              <div>
                <h3 class="font-bold text-blue-800">You've already reviewed this boat!</h3>
                <p class="text-blue-600">You can update your review below.</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="submitReview" class="space-y-6">
            <!-- Rating -->
            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-700">How would you rate this experience?</label>
              <div class="flex space-x-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="rating = star"
                  class="w-12 h-12 rounded-full transition-all duration-200 hover:scale-110"
                  :class="star <= rating ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400 hover:bg-yellow-200'"
                >
                  <span class="text-2xl">⭐</span>
                </button>
              </div>
              <p class="text-sm text-gray-500">{{ getRatingText(rating) }}</p>
            </div>

            <!-- Review Text -->
            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-700">Share your experience (optional)</label>
              <textarea
                v-model="reviewText"
                rows="6"
                class="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                placeholder="Tell us about your experience... What did you like? What could be improved?"
              ></textarea>
              <p class="text-sm text-gray-500">{{ reviewText.length }}/500 characters</p>
            </div>

            <!-- Submit Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                :disabled="rating === 0 || isSubmitting"
                class="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{{ hasReviewed ? 'Updating...' : 'Submitting...' }}</span>
                </span>
                <span v-else>{{ hasReviewed ? 'Update Review' : 'Submit Review' }}</span>
              </button>
              
              <button
                type="button"
                @click="goBack"
                class="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-2xl p-6" data-aos="fade-up">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <h3 class="font-bold text-green-800">Review submitted successfully!</h3>
              <p class="text-green-600">Thank you for sharing your experience.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center" data-aos="fade-up">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-red-600 text-2xl">❌</span>
        </div>
        <h3 class="text-xl font-bold text-red-800 mb-2">Booking Not Found</h3>
        <p class="text-red-600 mb-6">This booking doesn't exist or you don't have permission to review it.</p>
        <button
          @click="goBack"
          class="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

const route = useRoute()
const router = useRouter()

// Reactive data
const booking = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const hasReviewed = ref(false)
const existingReview = ref(null)

// Form data
const rating = ref(0)
const reviewText = ref('')

// Load booking data
const loadBookingData = async () => {
  try {
    isLoading.value = true
    
    const bookingId = route.params.id
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (!user) {
      router.push('/login')
      return
    }

    const response = await axios.get(`http://localhost:5000/api/reviews/booking/${bookingId}`, {
      params: { userId: user.userId || user.user_id || user.id }
    })

    if (response.data.success) {
      booking.value = response.data.data.booking
      hasReviewed.value = response.data.data.has_reviewed
      existingReview.value = response.data.data.existing_review
      
      // Pre-fill form if user has already reviewed
      if (hasReviewed.value && existingReview.value) {
        rating.value = existingReview.value.rating
        reviewText.value = existingReview.value.review_text || ''
      }
    }
  } catch (error) {
    console.error('Error loading booking data:', error)
  } finally {
    isLoading.value = false
  }
}

// Submit review
const submitReview = async () => {
  try {
    isSubmitting.value = true
    
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.userId || user.user_id || user.id
    
    const reviewData = {
      boat_id: booking.value.boat_id,
      user_id: userId,
      rating: rating.value,
      review_text: reviewText.value.trim() || null
    }

    let response
    if (hasReviewed.value && existingReview.value) {
      // Update existing review
      response = await axios.put(`http://localhost:5000/api/reviews/${existingReview.value.review_id}`, {
        rating: rating.value,
        review_text: reviewText.value.trim() || null
      })
    } else {
      // Create new review
      response = await axios.post('http://localhost:5000/api/reviews', reviewData)
    }

    if (response.data.success) {
      showSuccess.value = true
      hasReviewed.value = true
      
      // Hide success message after 3 seconds and redirect
      setTimeout(() => {
        router.push('/user/bookings')
      }, 3000)
    }
  } catch (error) {
    console.error('Error submitting review:', error)
    alert('Failed to submit review. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(amount)
}

const getRatingText = (rating) => {
  const texts = {
    1: 'Poor - Very disappointed',
    2: 'Fair - Below expectations',
    3: 'Good - Met expectations',
    4: 'Very Good - Exceeded expectations',
    5: 'Excellent - Outstanding experience'
  }
  return texts[rating] || 'Select a rating'
}

const goBack = () => {
  router.push('/user/bookings')
}

onMounted(() => {
  loadBookingData()
  AOS.init({
    duration: 1000,
    once: true
  })
})
</script>
