<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon,
  KeyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isValidToken = ref(false)
const userInfo = ref(null)
const errors = ref({})

// Get token from URL
const token = route.query.token

onMounted(async () => {
  AOS.init({
    duration: 1000,
    once: true,
  })

  // Verify token on mount
  if (token) {
    await verifyToken()
  } else {
    // No token provided, redirect to login
    Swal.fire({
      icon: 'error',
      title: 'Invalid Link',
      text: 'No reset token provided. Please request a new password reset.',
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#ea580c'
    }).then(() => {
      router.push('/login')
    })
  }
})

const verifyToken = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/auth/verify-reset-token/${token}`)
    isValidToken.value = true
    userInfo.value = res.data.user
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid or Expired Token',
      text: 'This password reset link is invalid or has expired. Please request a new one.',
      confirmButtonText: 'Request New Link',
      confirmButtonColor: '#ea580c'
    }).then(() => {
      router.push('/login')
    })
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!newPassword.value) {
    errors.value.newPassword = 'New password is required'
  } else if (newPassword.value.length < 6) {
    errors.value.newPassword = 'Password must be at least 6 characters'
  }
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleResetPassword = async () => {
  if (!validateForm()) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Please fix the errors below',
      showConfirmButton: false,
      timer: 2000
    })
    return
  }

  isLoading.value = true

  try {
    const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
      token: token,
      newPassword: newPassword.value
    })

    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'Password Reset Successful!',
      text: 'Your password has been updated successfully. You can now sign in with your new password.',
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#ea580c',
      showCancelButton: false
    })

    // Redirect to login
    router.push('/login')

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Reset Failed',
      text: error.response?.data?.message || 'Failed to reset password. Please try again.',
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#ea580c'
    })
  } finally {
    isLoading.value = false
  }
}

const handleGoToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <div class="relative w-full max-w-md mt-12" data-aos="fade-up">
      <!-- Header -->
      <div class="text-center mb-8" data-aos="fade-down">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <KeyIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Reset Password</h2>
        <p class="text-gray-300">Enter your new password below</p>
        <div v-if="userInfo" class="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
          <p class="text-sm text-gray-300">Resetting password for:</p>
          <p class="text-white font-medium">{{ userInfo.fullName }}</p>
          <p class="text-sm text-gray-400">{{ userInfo.email }}</p>
        </div>
      </div>

      <!-- Reset Password Form -->
      <div v-if="isValidToken" class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8" data-aos="zoom-in" data-aos-delay="200">
        <form class="space-y-6" @submit.prevent="handleResetPassword">
          <!-- New Password Field -->
          <div data-aos="fade-right" data-aos-delay="300">
            <label for="newPassword" class="block text-sm font-medium text-gray-200 mb-2">
              New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="newPassword"
                :type="showPassword ? 'text' : 'password'"
                v-model="newPassword"
                required
                placeholder="Enter your new password"
                class="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.newPassword }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            <p v-if="errors.newPassword" class="mt-1 text-sm text-red-400">{{ errors.newPassword }}</p>
          </div>

          <!-- Confirm Password Field -->
          <div data-aos="fade-left" data-aos-delay="400">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-200 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                required
                placeholder="Confirm your new password"
                class="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-400">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Password Requirements -->
          <div class="bg-white/5 rounded-lg p-4 border border-white/10" data-aos="fade-up" data-aos-delay="500">
            <h4 class="text-sm font-medium text-gray-200 mb-2">Password Requirements:</h4>
            <ul class="text-xs text-gray-300 space-y-1">
              <li class="flex items-center">
                <CheckCircleIcon class="h-3 w-3 text-green-400 mr-2" />
                At least 6 characters long
              </li>
              <li class="flex items-center">
                <CheckCircleIcon class="h-3 w-3 text-green-400 mr-2" />
                Must match confirmation
              </li>
            </ul>
          </div>

          <!-- Reset Button -->
          <div data-aos="fade-up" data-aos-delay="600">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
              <span v-else class="flex items-center">
                Reset Password
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </span>
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="mt-6" data-aos="fade-up" data-aos-delay="700">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-transparent text-gray-300">Remember your password?</span>
            </div>
          </div>
        </div>

        <!-- Login Link -->
        <div class="mt-6" data-aos="fade-up" data-aos-delay="800">
          <button
            @click="handleGoToLogin"
            class="w-full flex justify-center py-3 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>

      <!-- Invalid Token State -->
      <div v-else class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center" data-aos="zoom-in" data-aos-delay="200">
        <div class="mx-auto h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon class="h-8 w-8 text-red-400" />
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Invalid Reset Link</h3>
        <p class="text-gray-300 mb-6">This password reset link is invalid or has expired.</p>
        <button
          @click="handleGoToLogin"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
        >
          Go to Login
        </button>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8" data-aos="fade-up" data-aos-delay="900">
        <p class="text-sm text-gray-400">
          Having trouble? 
          <a href="#" class="text-orange-400 hover:text-orange-300 transition-colors">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</template>
