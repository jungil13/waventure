<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">Reviews & Feedback</h1>
        <p class="text-xl opacity-90">Manage customer reviews and build your reputation</p>
      </div>
    </div>

    <!-- Enhanced Stats Section -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">⭐ Average Rating</p>
            <h2 class="text-3xl font-bold text-white">{{ averageRating > 0 ? averageRating.toFixed(1) : '0.0' }} / 5</h2>
            <p class="text-xs text-yellow-400 mt-1">Customer satisfaction</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <StarIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2" >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">💬 Total Reviews</p>
            <h2 class="text-3xl font-bold text-white">{{ totalReviews }}</h2>
            <p class="text-xs text-blue-400 mt-1">Customer feedback</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <ChatBubbleLeftRightIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">📈 Response Rate</p>
            <h2 class="text-3xl font-bold text-white">{{ responseRate }}%</h2>
            <p class="text-xs text-green-400 mt-1">Engagement level</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <ArrowPathIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
      <p class="text-white text-lg">Loading reviews...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="reviews.length === 0" class="text-center py-12">
      <div class="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-white mb-3">No Reviews Yet</h3>
      <p class="text-purple-200 text-center max-w-md mx-auto mb-6">
        You haven't received any reviews yet. Reviews will appear here once customers rate your boats after their trips.
      </p>
    </div>

    <!-- Enhanced Reviews Section -->
    <div v-else class="space-y-6">
      <div v-for="review in reviews" :key="review.id"
           class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        
        <!-- Customer Info -->
        <div class="flex items-center space-x-4 mb-4">
          <div class="relative">
            <img :src="review.avatar" alt="Avatar" class="w-14 h-14 rounded-full border-2 border-white/30" />
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
          </div>
          <div>
            <h3 class="font-bold text-white text-lg">{{ review.customer }}</h3>
            <p class="text-sm text-purple-200">{{ review.boat_name }} ({{ review.boat_type }})</p>
            <p class="text-sm text-gray-300">{{ review.date }}</p>
          </div>
        </div>

        <!-- Rating -->
        <div class="flex items-center mb-4">
          <div class="flex items-center space-x-1">
            <template v-for="i in 5" :key="i">
              <StarIcon class="w-6 h-6" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-600'" />
            </template>
          </div>
          <span class="ml-3 text-lg font-bold text-white">{{ review.rating }}/5</span>
          <div class="ml-4 px-3 py-1 bg-white/10 rounded-full">
            <span class="text-sm text-gray-300">Verified Review</span>
          </div>
        </div>

        <!-- Review Text -->
        <div class="bg-white/5 rounded-2xl p-4 mb-4">
          <p class="text-gray-200 leading-relaxed">{{ review.comment }}</p>
        </div>

        <!-- Owner Reply -->
        <div v-if="review.reply" class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 mb-4">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">⚓</span>
            </div>
            <span class="text-purple-400 font-semibold">Your Reply</span>
          </div>
          <p class="text-white">{{ review.reply }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Reply Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 relative text-white">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="mb-6">
          <h2 class="text-3xl font-bold mb-2">💬 Reply to {{ selectedReview.customer }}</h2>
          <p class="text-gray-300">Respond to customer feedback and build relationships</p>
        </div>

        <!-- Customer Review Preview -->
        <div class="bg-white/5 rounded-2xl p-4 mb-6">
          <div class="flex items-center space-x-3 mb-3">
            <img :src="selectedReview.avatar" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-white/30" />
            <div>
              <h3 class="font-semibold text-white">{{ selectedReview.customer }}</h3>
              <div class="flex items-center space-x-1">
                <template v-for="i in 5" :key="i">
                  <StarIcon class="w-4 h-4" :class="i <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-600'" />
                </template>
                <span class="ml-2 text-sm text-gray-300">{{ selectedReview.rating }}/5</span>
              </div>
            </div>
          </div>
          <p class="text-gray-200 text-sm">{{ selectedReview.comment }}</p>
        </div>

        <!-- Reply Form -->
        <div>
          <label class="block text-white font-semibold mb-2">Your Reply</label>
          <textarea v-model="replyText"
                    class="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="4" placeholder="Write your professional reply..."></textarea>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button @click="closeModal"
                  class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200">
            Cancel
          </button>
          <button @click="submitReply"
                  class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            💬 Send Reply
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
import {
    StarIcon,
    ChatBubbleLeftRightIcon,
    ArrowPathIcon,
} from "@heroicons/vue/24/solid";
import OwnerReviewService from "@/services/ownerReviewService";

// Get owner ID from localStorage
const owner = ref({});
try {
  const raw = localStorage.getItem("user");
  if (raw) {
    const parsed = JSON.parse(raw);
    owner.value = parsed && typeof parsed === "object" ? parsed : {};
  }
} catch (e) {
  console.error("Failed to parse user from localStorage", e);
}

const getOwnerId = () => {
  return owner.value?.user_id || owner.value?.userId || null;
};

const reviews = ref([]);
const reviewStats = ref({
  average_rating: 0,
  total_reviews: 0,
  rating_distribution: {
    five_star: 0,
    four_star: 0,
    three_star: 0,
    two_star: 0,
    one_star: 0
  }
});
const loading = ref(true);
const showModal = ref(false);
const selectedReview = ref({});
const replyText = ref("");

const averageRating = computed(() => {
    const rating = reviewStats.value.average_rating;
    return rating ? parseFloat(rating) : 0;
});

const totalReviews = computed(() => {
    return reviewStats.value.total_reviews || 0;
});

const responseRate = computed(() => {
    // Since we don't have reply functionality in the backend yet, return 0
    return 0;
});

// Load owner reviews
const loadOwnerReviews = async () => {
  try {
    loading.value = true;
    const ownerId = getOwnerId();
    if (!ownerId) {
      console.error('No owner ID found');
      return;
    }

    const response = await OwnerReviewService.getOwnerReviews(ownerId);
    if (response?.success) {
      reviews.value = response.data.reviews.map(review => ({
        id: review.review_id,
        customer: review.customer,
        date: new Date(review.created_at).toLocaleDateString(),
        rating: review.rating,
        comment: review.review_text || 'No comment provided',
        avatar: review.avatar ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${review.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customer)}&background=8B5CF6&color=fff`,
        boat_name: review.boat_name,
        boat_type: review.boat_type,
        reply: "" // No reply functionality yet
      }));
      
      reviewStats.value = response.data.stats;
    }
  } catch (error) {
    console.error('Error loading owner reviews:', error);
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
    } else {
      alert('Failed to load reviews. Please refresh the page.');
    }
  } finally {
    loading.value = false;
  }
};

const openReply = (review) => {
    selectedReview.value = review;
    replyText.value = review.reply || "";
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const submitReply = () => {
    if (selectedReview.value.id) {
        const review = reviews.value.find((r) => r.id === selectedReview.value.id);
        if (review) review.reply = replyText.value;
    }
    closeModal();
};

const reportReview = (id) => {
    alert(`Reported review ID: ${id}`);
};

onMounted(async () => {
    AOS.init({ duration: 1000, once: true });
    await loadOwnerReviews();
});
</script>
