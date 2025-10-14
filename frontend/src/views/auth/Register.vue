<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const router = useRouter();

// Form state
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const userType = ref('Customer'); // default to Customer

// Show/hide password
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

// Form validation
const errors = ref({});

// Initialize AOS
onMounted(() => {
  AOS.init({ duration: 1000, once: true });
});

// SweetAlert2 Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// Form validation
const validateForm = () => {
  errors.value = {};
  
  if (!fullName.value.trim()) {
    errors.value.fullName = 'Full name is required';
  }
  
  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required';
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password';
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Registration handler
const handleRegister = async () => {
  if (!validateForm()) {
    Toast.fire({ icon: 'error', title: 'Please fix the errors below' });
    return;
  }

  isLoading.value = true;

  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      userType: userType.value,
    });

    Toast.fire({ icon: 'success', title: res.data.message || 'Registered successfully!' });

    // Show success modal
    await Swal.fire({
      icon: 'success',
      title: 'Registration Successful!',
      text: 'Your account has been created successfully. You can now sign in.',
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#ea580c',
      showCancelButton: false
    });

    // Redirect to login
    router.push('/login');

  } catch (err) {
    Toast.fire({ icon: 'error', title: err.response?.data?.message || 'Registration failed!' });
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <div class="relative w-full max-w-md mt-16" data-aos="fade-up">
      <!-- Header -->
      <div class="text-center mb-8" data-aos="fade-down">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <UserGroupIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p class="text-gray-300">Join Waventure and start your adventure</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8" data-aos="zoom-in" data-aos-delay="200">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <!-- Full Name Field -->
          <div data-aos="fade-right" data-aos-delay="300">
            <label for="fullName" class="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                class="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.fullName }"
              />
            </div>
            <p v-if="errors.fullName" class="mt-1 text-sm text-red-400">{{ errors.fullName }}</p>
          </div>

          <!-- Email Field -->
          <div data-aos="fade-left" data-aos-delay="400">
            <label for="email" class="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="Enter your email"
                class="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.email }"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div data-aos="fade-right" data-aos-delay="500">
            <label for="password" class="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="Enter your password"
                class="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.password }"
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
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password Field -->
          <div data-aos="fade-left" data-aos-delay="600">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-200 mb-2">
              Confirm Password
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
                placeholder="Confirm your password"
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

          <!-- User Type Field -->
          <div data-aos="fade-up" data-aos-delay="700">
            <label for="userType" class="block text-sm font-medium text-gray-200 mb-2">
              Register as
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserGroupIcon class="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="userType"
                v-model="userType"
                class="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="Customer" class="bg-gray-800 text-white">Customer</option>
                <option value="BoatOwner" class="bg-gray-800 text-white">Boat Owner</option>
              </select>
            </div>
          </div>

          <!-- Register Button -->
          <div data-aos="fade-up" data-aos-delay="800">
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
                Creating Account...
              </span>
              <span v-else class="flex items-center">
                Create Account
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </span>
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="mt-6" data-aos="fade-up" data-aos-delay="900">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-transparent text-gray-300">Already have an account?</span>
            </div>
          </div>
        </div>

        <!-- Login Link -->
        <div class="mt-6" data-aos="fade-up" data-aos-delay="1000">
          <button
            @click="handleLogin"
            class="w-full flex justify-center py-3 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            Sign In Instead
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8" data-aos="fade-up" data-aos-delay="1100">
        <p class="text-sm text-gray-400">
          By creating an account, you agree to our
          <a href="#" class="text-orange-400 hover:text-orange-300 transition-colors">Terms of Service</a>
          and
          <a href="#" class="text-orange-400 hover:text-orange-300 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>
