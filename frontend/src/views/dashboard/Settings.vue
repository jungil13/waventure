<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span class="w-12 h-12 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
              <Cog6ToothIcon class="h-8 w-8 text-orange-600" />
            </span>
            Account Settings
          </h1>
          <p class="text-lg text-gray-600">Manage your profile, preferences, and security settings</p>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <!-- Profile Picture -->
          <div class="relative">
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg">
              <img 
                :src="userProfile.profile_pic ? `http://localhost:5000${userProfile.profile_pic}` : 'https://images.unsplash.com/photo-1517841905240-472988babdf9'" 
                :alt="userProfile.full_name || 'Profile'" 
                class="w-full h-full object-cover" 
              />
            </div>
            <button 
              @click="triggerFileUpload"
              class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
            >
              <CameraIcon class="h-5 w-5 text-white" />
            </button>
            <input 
              ref="fileInput"
              type="file" 
              @change="handleProfilePictureUpload"
              accept="image/*"
              class="hidden"
            />
          </div>
          
          <!-- Profile Info -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ userProfile.full_name || 'User Name' }}</h2>
            <div class="space-y-2">
              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <MapPinIcon class="h-5 w-5 text-orange-500" />
                <span>{{ userProfile.location || 'Location not set' }}</span>
              </div>
              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <EnvelopeIcon class="h-5 w-5 text-orange-500" />
                <span>{{ userProfile.email || 'Email not set' }}</span>
              </div>
              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <PhoneIcon class="h-5 w-5 text-orange-500" />
                <span>{{ userProfile.phone || 'Phone not set' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Personal Information -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <UserIcon class="h-5 w-5 text-blue-600" />
            </span>
            Personal Information
          </h2>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                v-model="profileForm.fullName"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                v-model="profileForm.email"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                v-model="profileForm.phone"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                v-model="profileForm.location"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Enter your location"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea 
                rows="3" 
                v-model="profileForm.bio"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm resize-none" 
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              :disabled="profileLoading"
              class="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div v-if="profileLoading" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
              <div v-else class="flex items-center justify-center gap-2">
                <CheckIcon class="h-5 w-5" />
                <span>Save Changes</span>
              </div>
            </button>
          </form>
        </div>

        <!-- Preferences -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20" >
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Cog6ToothIcon class="h-5 w-5 text-purple-600" />
            </span>
            Preferences
          </h2>
          
          <form @submit.prevent="updatePreferences" class="space-y-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                <div class="flex items-center gap-3">
                  <EnvelopeIcon class="h-6 w-6 text-blue-500" />
                  <div>
                    <p class="font-semibold text-gray-800">Email Notifications</p>
                    <p class="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="preferencesForm.emailNotifications"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                <div class="flex items-center gap-3">
                  <BellIcon class="h-6 w-6 text-green-500" />
                  <div>
                    <p class="font-semibold text-gray-800">Push Notifications</p>
                    <p class="text-sm text-gray-600">Receive browser notifications</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="preferencesForm.pushNotifications"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                <div class="flex items-center gap-3">
                  <NewspaperIcon class="h-6 w-6 text-purple-500" />
                  <div>
                    <p class="font-semibold text-gray-800">Newsletter Subscription</p>
                    <p class="text-sm text-gray-600">Receive our newsletter</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="preferencesForm.newsletterSubscription"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
            
            <button 
              type="submit"
              :disabled="preferencesLoading"
              class="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div v-if="preferencesLoading" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
              <div v-else class="flex items-center justify-center gap-2">
                <CheckIcon class="h-5 w-5" />
                <span>Save Preferences</span>
              </div>
            </button>
          </form>
        </div>

        <!-- Security -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <ShieldCheckIcon class="h-5 w-5 text-red-600" />
            </span>
            Security
          </h2>
          
          <form @submit.prevent="changePassword" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                v-model="passwordForm.currentPassword"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                v-model="passwordForm.newPassword"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                v-model="passwordForm.confirmPassword"
                class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-colors bg-white/50 backdrop-blur-sm" 
                placeholder="Confirm new password"
              />
            </div>
            
            <button 
              type="submit"
              :disabled="passwordLoading"
              class="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div v-if="passwordLoading" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
              <div v-else class="flex items-center justify-center gap-2">
                <ShieldCheckIcon class="h-5 w-5" />
                <span>Update Password</span>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
import {
  Cog6ToothIcon,
  CameraIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CheckIcon,
  BellIcon,
  NewspaperIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

// Reactive data
const userProfile = ref({});
const profileLoading = ref(false);
const preferencesLoading = ref(false);
const passwordLoading = ref(false);

// Forms
const profileForm = ref({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  bio: ''
});

const preferencesForm = ref({
  emailNotifications: true,
  pushNotifications: true,
  newsletterSubscription: false
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// File input ref
const fileInput = ref(null);

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user')) || {};

// Load user profile
const loadUserProfile = async () => {
  try {
    const userId = user.userId || user.user_id || user.id;
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }
    
    console.log('Loading user profile for ID:', userId);
    const response = await axios.get(`http://localhost:5000/api/settings/profile/${userId}`);
    if (response.data.success) {
      userProfile.value = response.data.data;
      
      // Populate form with current data
      profileForm.value = {
        fullName: userProfile.value.full_name || '',
        email: userProfile.value.email || '',
        phone: userProfile.value.phone || '',
        location: userProfile.value.location || '',
        bio: userProfile.value.bio || ''
      };
      
      // Populate preferences
      preferencesForm.value = {
        emailNotifications: userProfile.value.email_notifications || false,
        pushNotifications: userProfile.value.push_notifications || false,
        newsletterSubscription: userProfile.value.newsletter_subscription || false
      };
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load user profile'
    });
  }
};

// Update profile
const updateProfile = async () => {
  try {
    profileLoading.value = true;
    
    const userId = user.userId || user.user_id || user.id;
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }
    
    const response = await axios.put(`http://localhost:5000/api/settings/profile/${userId}`, profileForm.value);
    
    if (response.data.success) {
      userProfile.value = response.data.data;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!'
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update profile'
    });
  } finally {
    profileLoading.value = false;
  }
};

// Update preferences
const updatePreferences = async () => {
  try {
    preferencesLoading.value = true;
    
    const userId = user.userId || user.user_id || user.id;
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }
    
    const response = await axios.put(`http://localhost:5000/api/settings/preferences/${userId}`, preferencesForm.value);
    
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Preferences updated successfully!'
      });
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update preferences'
    });
  } finally {
    preferencesLoading.value = false;
  }
};

// Change password
const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'New passwords do not match'
    });
    return;
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Password must be at least 6 characters long'
    });
    return;
  }
  
  try {
    passwordLoading.value = true;
    
    const userId = user.userId || user.user_id || user.id;
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }
    
    const response = await axios.put(`http://localhost:5000/api/settings/password/${userId}`, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password updated successfully!'
      });
      
      // Clear password form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  } catch (error) {
    console.error('Error changing password:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to change password'
    });
  } finally {
    passwordLoading.value = false;
  }
};

// Trigger file upload
const triggerFileUpload = () => {
  fileInput.value?.click();
};

// Handle profile picture upload
const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File',
      text: 'Please select an image file'
    });
    return;
  }
  
  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'File Too Large',
      text: 'Please select an image smaller than 5MB'
    });
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const userId = user.userId || user.user_id || user.id;
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }
    
    const response = await axios.post(`http://localhost:5000/api/settings/profile-picture/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      userProfile.value.profile_pic = response.data.data.profile_pic;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile picture updated successfully!'
      });
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to upload profile picture'
    });
  }
};

onMounted(() => {
  AOS.init({ duration: 800, once: true });
  loadUserProfile();
});
</script>
