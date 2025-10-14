<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  UserIcon,
  KeyIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const showDemoAccounts = ref(false)

// Demo accounts data
const demoAccounts = [
  {
    type: 'Admin',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin',
    description: 'System administrator'
  },
  {
    type: 'BoatOwner',
    name: 'Sung Jin Woo',
    email: 'jungil@gmail.com',
    password: '123456',
    description: 'Boat rental business owner'
  },
  {
    type: 'BoatOwner',
    name: 'Mark Jayson',
    email: 'mark@gmail.com',
    password: 'mark',
    description: 'Local fisherman turned boat owner'
  },
  {
    type: 'Customer',
    name: 'Honey Kate Padilla',
    email: 'kate@gmail.com',
    password: 'kate',
    description: 'Regular customer account'
  },
  {
    type: 'Customer', 
    name: 'Mikha Lim',
    email: 'mikha@gmail.com',
    password: '123456',
    description: 'Adventure seeker account'
  }
]

const handleLogin = async () => {
  if (!email.value || !password.value) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Please fill in all fields',
      showConfirmButton: false,
      timer: 2000
    })
    return
  }

  isLoading.value = true
  
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value
    })

    // Save token + user in localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Login successful!',
      showConfirmButton: false,
      timer: 2000
    })

    // Redirect based on user_type (matches backend)
    setTimeout(() => {
      const userType = res.data.user.user_type
      if (userType === 'BoatOwner') {
        router.push('/owner/ownerdashboard')
      } else if (userType === 'Customer') {
        router.push('/user/dashboard')
      } else if (userType === 'Admin') {
        router.push('/admin/admindashboard')
      } else {
        router.push('/')
      }
    }, 2000)
  } catch (error) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: error.response?.data?.message || 'Login failed',
      showConfirmButton: false,
      timer: 2500
    })
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = async () => {
  // Generate captcha question
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const captchaQuestion = `${num1} + ${num2} = ?`;

  const { value: email } = await Swal.fire({
    title: 'Reset Password',
    input: 'email',
    inputLabel: 'Email Address',
    inputPlaceholder: 'Enter your email address',
    inputValidator: (value) => {
      if (!value) {
        return 'Please enter your email address'
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address'
      }
    },
    showCancelButton: true,
    confirmButtonText: 'Next',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ea580c',
    cancelButtonColor: '#6b7280'
  })

  if (email) {
    const { value: captchaAnswer } = await Swal.fire({
      title: 'Verification',
      html: `
        <div class="text-center">
          <p class="mb-4 text-gray-600">Please solve this math problem to verify you're not a robot:</p>
          <div class="text-2xl font-bold text-gray-800 mb-4">${captchaQuestion}</div>
        </div>
      `,
      input: 'number',
      inputLabel: 'Answer',
      inputPlaceholder: 'Enter your answer',
      inputValidator: (value) => {
        if (!value) {
          return 'Please solve the verification problem'
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Verify & Reset',
      cancelButtonText: 'Back',
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#6b7280'
    })

    if (captchaAnswer) {
      const formData = { email, captchaAnswer, captchaQuestion }
      
      console.log('Form data:', formData)
      try {
        const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
          email: formData.email,
          captchaAnswer: formData.captchaAnswer,
          captchaQuestion: formData.captchaQuestion
        })

        console.log('API response:', res.data)

        // Show success message and redirect automatically
        Swal.fire({
          icon: 'success',
          title: 'Email Verified!',
          text: `Redirecting to password reset for ${res.data.user.email}...`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          // Automatically redirect to reset password page
          window.location.href = res.data.resetUrl;
        })
      } catch (error) {
        console.error('API error:', error)
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: error.response?.data?.message || 'Failed to verify email. Please try again.',
          confirmButtonColor: '#ea580c'
        })
      }
    }
  }
}

const handleCreateAccount = () => {
  router.push('/register')
}

const selectDemoAccount = (account) => {
  email.value = account.email
  password.value = account.password
  showDemoAccounts.value = false
  
  console.log('Selected demo account:', account.name, 'Email:', account.email)
  
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `Demo account loaded: ${account.name}`,
    showConfirmButton: false,
    timer: 2000
  })
}

const getAccountTypeIcon = (type) => {
  switch (type) {
    case 'Customer':
      return '👤'
    case 'BoatOwner':
      return '🚤'
    case 'Admin':
      return '👨‍💼'
    default:
      return '👤'
  }
}

const getAccountTypeColor = (type) => {
  switch (type) {
    case 'Customer':
      return 'text-blue-400'
    case 'BoatOwner':
      return 'text-orange-400'
    case 'Admin':
      return 'text-purple-400'
    default:
      return 'text-gray-400'
  }
}

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  const container = document.querySelector('.demo-accounts-container')
  if (container && !container.contains(event.target)) {
    showDemoAccounts.value = false
  }
}

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
  })
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
  
  // Debug: Log demo accounts
  console.log('Demo accounts loaded:', demoAccounts.length, 'accounts')
  console.log('Demo accounts:', demoAccounts)
})

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <div class="relative w-full max-w-md" data-aos="fade-up">
      <!-- Header -->
      <div class="text-center mb-8" data-aos="fade-down">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <UserIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p class="text-gray-300">Sign in to your account to continue</p>
      </div>

     

      <!-- Login Form -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative z-10" data-aos="zoom-in" data-aos-delay="200">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div data-aos="fade-right" data-aos-delay="300">
            <label for="email" class="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div data-aos="fade-left" data-aos-delay="400">
            <label for="password" class="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="password"
                class="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
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
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between" data-aos="fade-up" data-aos-delay="500">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-white/20 rounded bg-white/10"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-200">
                Remember me
              </label>
            </div>
            <button
              type="button"
              @click="handleForgotPassword"
              class="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <!-- Sign In Button -->
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
                Signing in...
              </span>
              <span v-else class="flex items-center">
                Sign In
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
              <span class="px-2 bg-transparent text-gray-300">Or continue with</span>
            </div>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="mt-6" data-aos="fade-up" data-aos-delay="800">
          <button
            @click="handleCreateAccount"
            class="w-full flex justify-center py-3 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            Don't have an account? Sign up
          </button>
        </div>

        <!-- Demo Accounts Dropdown -->
        <div class="mt-4" data-aos="fade-up" data-aos-delay="900">
          <div class="relative demo-accounts-container">
            <button
              @click="showDemoAccounts = !showDemoAccounts"
              class="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <KeyIcon class="w-4 h-4 mr-2" />
              Demo Accounts
              <svg class="ml-2 w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showDemoAccounts }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-show="showDemoAccounts"
              class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 z-[9999] max-h-64 overflow-y-auto"
            >
              <div class="p-2">
                <div class="text-xs font-semibold text-gray-600 mb-2 px-2">Select a demo account:</div>
                <div 
                  v-for="account in demoAccounts" 
                  :key="account.email"
                  @click="selectDemoAccount(account)"
                  class="flex items-center p-3 rounded-lg hover:bg-white/20 cursor-pointer transition-colors duration-200 group"
                >
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                      {{ getAccountTypeIcon(account.type) }}
                    </div>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                        {{ account.name }}
                      </p>
                      <span :class="getAccountTypeColor(account.type)" class="text-xs font-medium">
                        {{ account.type }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 truncate">{{ account.email }}</p>
                    <p class="text-xs text-gray-400">{{ account.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 relative z-0" data-aos="fade-up" data-aos-delay="1000">
        <p class="text-sm text-gray-400">
          By signing in, you agree to our
          <a href="#" class="text-orange-400 hover:text-orange-300 transition-colors">Terms of Service</a>
          and
          <a href="#" class="text-orange-400 hover:text-orange-300 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>