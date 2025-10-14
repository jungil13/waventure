<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-10" data-aos="fade-down">
      <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 rounded-2xl p-8 text-white shadow-lg">
        <h1 class="text-4xl font-extrabold mb-2">⭐ All Reviews</h1>
        <p class="text-lg opacity-90">Monitor customer feedback across all boats</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8" data-aos="fade-up">
      <div
        class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">⭐ Average Rating</p>
            <h2 class="text-3xl font-bold text-gray-900">
              {{ averageRating > 0 ? averageRating.toFixed(1) : '0.0' }} / 5
            </h2>
            <p class="text-xs text-yellow-500 mt-1">Overall satisfaction</p>
          </div>
          <div class="w-14 h-14 bg-yellow-400/90 rounded-xl flex items-center justify-center text-white text-2xl">
            ★
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">💬 Total Reviews</p>
            <h2 class="text-3xl font-bold text-gray-900">{{ totalReviews }}</h2>
            <p class="text-xs text-blue-500 mt-1">All feedback</p>
          </div>
          <div class="w-14 h-14 bg-blue-400/90 rounded-xl flex items-center justify-center text-white text-2xl">
            💬
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">🚤 Boats Reviewed</p>
            <h2 class="text-3xl font-bold text-gray-900">{{ boatsReviewed }}</h2>
            <p class="text-xs text-green-500 mt-1">Active boats</p>
          </div>
          <div class="w-14 h-14 bg-green-400/90 rounded-xl flex items-center justify-center text-white text-2xl">
            🚤
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">👥 Customers</p>
            <h2 class="text-3xl font-bold text-gray-900">{{ customersReviewed }}</h2>
            <p class="text-xs text-purple-500 mt-1">Reviewers</p>
          </div>
          <div class="w-14 h-14 bg-purple-400/90 rounded-xl flex items-center justify-center text-white text-2xl">
            👥
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-6 mb-8 shadow-md border border-gray-100" data-aos="fade-up">
      <div class="flex flex-wrap items-center gap-4">
        <label class="text-gray-700 font-semibold">Filter by:</label>

        <select
          v-model="selectedBoat"
          @change="filterReviews"
          class="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="">All Boats</option>
          <option v-for="boat in boats" :key="boat.boat_id" :value="boat.boat_id">{{ boat.name }}</option>
        </select>

        <select
          v-model="selectedRating"
          @change="filterReviews"
          class="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select
          v-model="sortBy"
          @change="filterReviews"
          class="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>

        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-semibold hover:from-red-500 hover:to-pink-500 transition-all"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-600">
      <div class="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-400 mx-auto mb-3"></div>
      <p>Loading reviews...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredReviews.length === 0" class="text-center py-16">
      <div class="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-4xl">
        ★
      </div>
      <h3 class="text-2xl font-semibold text-gray-800 mb-2">No Reviews Found</h3>
      <p class="text-gray-500 mb-4">
        {{ hasActiveFilters ? 'No reviews match your current filters.' : 'No reviews have been submitted yet.' }}
      </p>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="px-6 py-3 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all"
      >
        Clear Filters
      </button>
    </div>

    <!-- Reviews -->
    <div v-else class="space-y-6" data-aos="fade-up">
      <div
        v-for="review in filteredReviews"
        :key="review.review_id"
        class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
      >
        <div class="flex items-center space-x-4 mb-4">
          <img
            :src="getCustomerAvatar(review)"
            alt="Avatar"
            class="w-14 h-14 rounded-full border border-gray-200"
          />
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">{{ review.customer_name || 'Anonymous' }}</h3>
            <p class="text-sm text-gray-500">{{ review.boat_name }} ({{ review.boat_type }})</p>
            <p class="text-sm text-gray-400">{{ formatDate(review.created_at) }}</p>
          </div>
          <div class="text-right">
            <div class="flex items-center justify-end space-x-1 mb-1">
              <template v-for="i in 5" :key="i">
                <span :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
              </template>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ review.rating }}/5</span>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 mb-4">
          <p class="text-gray-700">{{ review.review_text || 'No comment provided' }}</p>
        </div>

        <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-400 text-white flex items-center justify-center rounded-full">⚓</div>
            <div>
              <p class="text-sm font-semibold text-gray-700">Boat Owner</p>
              <p class="text-xs text-gray-500">{{ review.owner_name || 'Unknown' }}</p>
            </div>
          </div>
          <div class="text-right text-xs text-gray-400">
            <p>Boat ID: {{ review.boat_id }}</p>
            <p>Review ID: {{ review.review_id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-10" data-aos="fade-up">
      <div class="flex items-center space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="px-4 py-2 rounded-xl border cursor-pointer"
          :class="page === currentPage ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white border-gray-300 hover:bg-gray-100'"
        >
          {{ page }}
        </span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  // Replace ShipIcon with one of these alternatives
  RocketLaunchIcon as BoatIcon, // Option 1
  // or
  // TruckIcon as BoatIcon,     // Option 2
  // or
  // SparklesIcon as BoatIcon,  // Option 3
} from "@heroicons/vue/24/solid"; // Change to solid instead of outline
import AdminReviewService from "@/services/adminReviewService";

// Reactive data
const reviews = ref([]);
const boats = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Filters
const selectedBoat = ref("");
const selectedRating = ref("");
const sortBy = ref("newest");

// Computed properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.value.length;
});

const totalReviews = computed(() => reviews.value.length);

const boatsReviewed = computed(() => {
  const uniqueBoats = new Set(reviews.value.map(review => review.boat_id));
  return uniqueBoats.size;
});

const customersReviewed = computed(() => {
  const uniqueCustomers = new Set(reviews.value.map(review => review.user_id));
  return uniqueCustomers.size;
});

const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  // Filter by boat
  if (selectedBoat.value) {
    filtered = filtered.filter(review => review.boat_id == selectedBoat.value);
  }

  // Filter by rating
  if (selectedRating.value) {
    filtered = filtered.filter(review => review.rating == selectedRating.value);
  }

  // Sort
  switch (sortBy.value) {
    case "newest":
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case "oldest":
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case "highest":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "lowest":
      filtered.sort((a, b) => a.rating - b.rating);
      break;
  }

  return filtered;
});

const hasActiveFilters = computed(() => {
  return selectedBoat.value || selectedRating.value;
});

const totalPages = computed(() => {
  return Math.ceil(filteredReviews.value.length / itemsPerPage.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const loadAllReviews = async () => {
  try {
    loading.value = true;
    const response = await AdminReviewService.getAllReviews(
      currentPage.value, 
      itemsPerPage.value
    );
    
    if (response.success) {
      reviews.value = response.data.reviews;
      
      // Update stats
      const stats = response.data.stats;
      averageRating.value = stats.average_rating;
      totalReviews.value = stats.total_reviews;
      boatsReviewed.value = stats.boats_reviewed;
      customersReviewed.value = stats.customers_reviewed;
      
      // Update pagination
      const pagination = response.data.pagination;
      currentPage.value = pagination.page;
      totalPages.value = pagination.totalPages;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to load reviews'
    });
  } finally {
    loading.value = false;
  }
};

const loadBoats = async () => {
  try {
    const response = await AdminReviewService.getAllBoats();
    if (response?.success) {
      boats.value = response.data.boats || [];
    }
  } catch (error) {
    console.error('Error loading boats:', error);
  }
};

const filterReviews = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const clearFilters = () => {
  selectedBoat.value = "";
  selectedRating.value = "";
  sortBy.value = "newest";
  currentPage.value = 1;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getCustomerAvatar = (review) => {
  if (review.customer_avatar) {
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${review.customer_avatar}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customer_name || 'Customer')}&background=8B5CF6&color=fff`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch(currentPage, () => {
  loadAllReviews();
});
// Lifecycle
onMounted(async () => {
  AOS.init({ duration: 1000, once: true });
  await Promise.all([
    loadAllReviews(),
    loadBoats()
  ]);
});
</script>
