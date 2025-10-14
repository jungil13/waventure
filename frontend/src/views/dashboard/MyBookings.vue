<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8" >
        <div class="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative z-10">
            <h1 class="text-4xl font-bold mb-2">📋 My Bookings</h1>
            <p class="text-xl opacity-90">Manage and review your island hopping adventures</p>
          </div>
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab" 
            @click="activeTab = tab"
            class="px-6 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2"
            :class="activeTab === tab 
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
              : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'"
          >
            <span>{{ getTabIcon(tab) }}</span>
            <span>{{ tab }}</span>
            <span v-if="getTabCount(tab) > 0" class="bg-white/20 px-2 py-1 rounded-full text-xs">
              {{ getTabCount(tab) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Booking Cards -->
      <div v-if="filteredBookings.length" class="space-y-8">
        <div 
          v-for="(booking, index) in filteredBookings" 
          :key="booking.booking_id" 
          class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden" 
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-bold">Booking #{{ booking.booking_id }}</h2>
                <p class="text-orange-100">{{ formatDate(booking.booking_date) }} at {{ booking.booking_time }}</p>
              </div>
              <div class="text-right">
                <span class="inline-block px-4 py-2 text-sm font-semibold rounded-full" :class="{
                  'bg-green-500 text-white': booking.status === 'Completed',
                  'bg-yellow-500 text-white': booking.status === 'Pending',
                  'bg-blue-500 text-white': booking.status === 'Confirmed',
                  'bg-red-500 text-white': booking.status === 'Cancelled'
                }">
                  {{ booking.status }}
                </span>
                <p class="text-orange-100 text-sm mt-1">{{ formatCurrency(booking.total_price) }}</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">

            <!-- Booking Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Boat Image -->
              <div class="relative">
                <img 
                  v-if="booking.boat_images && booking.boat_images.length"
                  :src="`http://localhost:5000${booking.boat_images[0]}`" 
                  alt="Boat"
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
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <div class="flex items-center space-x-2">
                      <span class="text-orange-500">🚤</span>
                      <span><strong>Type:</strong> {{ booking.boat_type || 'N/A' }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-orange-500">👤</span>
                      <span><strong>Name:</strong> {{ booking.full_name }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-orange-500">📍</span>
                      <span><strong>Location:</strong> {{ booking.meet_up_location || 'TBD' }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-orange-500">⏰</span>
                      <span><strong>Duration:</strong> {{ booking.duration_option }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-orange-500">💳</span>
                      <span><strong>Payment:</strong> {{ booking.payment_method }} ({{ booking.payment_status || 'Unpaid' }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add-ons -->
            <div v-if="booking.addons && booking.addons.length" class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">🎯</span>
                Add-ons
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="addon in booking.addons" :key="addon.addon_id" class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div class="flex items-center space-x-3">
                    <template v-if="addon.images && JSON.parse(addon.images)?.length">
                      <img :src="`http://localhost:5000${JSON.parse(addon.images)[0]}`"
                        class="w-12 h-12 object-cover rounded-lg" />
                    </template>
                    <template v-else>
                      <div class="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 text-xs">
                        No Image
                      </div>
                    </template>
                    <div>
                      <p class="font-semibold text-gray-800">{{ addon.name }}</p>
                      <p class="text-sm text-gray-600">Qty: {{ addon.quantity }} × {{ formatCurrency(addon.price) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Food Packages -->
            <div v-if="booking.foodpackages && booking.foodpackages.length" class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">🍽️</span>
                Food Packages
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="food in booking.foodpackages" :key="food.package_id" class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div class="flex items-center space-x-3">
                    <template v-if="food.images && JSON.parse(food.images)?.length">
                      <img :src="`http://localhost:5000${JSON.parse(food.images)[0]}`"
                        class="w-12 h-12 object-cover rounded-lg" />
                    </template>
                    <template v-else>
                      <div class="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 text-xs">
                        No Image
                      </div>
                    </template>
                    <div>
                      <p class="font-semibold text-gray-800">{{ food.name }}</p>
                      <p class="text-sm text-gray-600">Qty: {{ food.quantity }} × {{ formatCurrency(food.price) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Islands -->
            <div v-if="booking.islands && booking.islands.length" class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">🏝️</span>
                Islands
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="island in booking.islands" :key="island.island_id" class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div class="flex items-center space-x-3">
                    <template v-if="island.images && JSON.parse(island.images)?.length">
                      <img :src="`http://localhost:5000${JSON.parse(island.images)[0]}`"
                        class="w-16 h-16 object-cover rounded-lg" />
                    </template>
                    <template v-else>
                      <div class="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 text-xs">
                        No Image
                      </div>
                    </template>
                    <div>
                      <p class="font-semibold text-gray-800">{{ island.name }}</p>
                      <p class="text-sm text-gray-600">{{ formatCurrency(island.price) }}</p>
                      <p class="text-xs text-gray-500">{{ island.features }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Proof Section -->
            <div v-if="booking.payment_proof" class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">💳</span>
                Payment Proof
              </h3>
              <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <img 
                  :src="getPaymentProofUrl(booking.payment_proof)" 
                  :alt="`Payment proof for booking ${booking.booking_id}`"
                  class="w-full max-w-xs h-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  @click="viewPaymentProof(booking.payment_proof)"
                  @error="handleImageError"
                />
                <p class="text-sm text-gray-600 mt-2">Click image to view full size</p>
              </div>
            </div>

            <!-- Cancellation Notice -->
            <div v-if="booking.status === 'Cancelled'" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div class="flex items-center space-x-2">
                <span class="text-red-500 text-xl">⚠️</span>
                <div>
                  <h4 class="font-semibold text-red-800">Booking Cancelled</h4>
                  <p class="text-red-600 text-sm">This booking has been cancelled. Please contact support if you have any questions about refunds.</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                @click="printBooking(booking)" 
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
              >
                <span>🖨️</span>
                <span>Print Receipt</span>
              </button>

              <button 
                @click="router.push({ name: 'ModifyBooking', params: { id: booking.booking_id } })"
                class="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>✏️</span>
                <span>Modify Booking</span>
              </button>

              <!-- Rate Now Button - Only show for completed bookings -->
              <button 
                v-if="booking.status === 'Completed'"
                @click="router.push({ name: 'RateBooking', params: { id: booking.booking_id } })"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>⭐</span>
                <span>Rate & Review</span>
              </button>

              <!-- View Review Button - Show if booking is completed and user has reviewed -->
              <button 
                v-if="booking.status === 'Completed' && booking.has_reviewed"
                @click="viewReview(booking.booking_id)"
                class="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>👁️</span>
                <span>View Review</span>
              </button>

              <!-- Cancel Button - Only show for pending/confirmed bookings -->
              <button 
                v-if="(booking.status === 'Pending' || booking.status === 'Confirmed') && activeTab !== 'Deleted'"
                @click="cancelBooking(booking)"
                class="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>❌</span>
                <span>Cancel Booking</span>
              </button>

              <!-- Delete Button - Only show for non-deleted bookings -->
              <button 
                v-if="activeTab !== 'Deleted'"
                @click="deleteBooking(booking)"
                class="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>

              <!-- Restore Button - Only show for deleted bookings -->
              <button 
                v-if="activeTab === 'Deleted'"
                @click="restoreBooking(booking)"
                class="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>♻️</span>
                <span>Restore</span>
              </button>

              <!-- View History Button -->
              <button 
                @click="viewBookingHistory(booking)"
                class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>📜</span>
                <span>History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Empty State -->
      <div v-else class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center border border-white/20">
        <div class="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-gray-400 text-3xl">📋</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
        <p class="text-gray-600 mb-6">No bookings found for "{{ activeTab }}". Start your island adventure today!</p>
        <button 
          @click="router.push('/user/boats')"
          class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Browse Boats
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Delete Booking</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete booking #{{ selectedBooking?.booking_id }}? 
          This action can be undone by restoring the booking from the "Deleted" tab.
        </p>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for deletion (optional)</label>
          <select v-model="deleteReason" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option value="">Select a reason</option>
            <option value="cancelled">Booking cancelled by user</option>
            <option value="duplicate">Duplicate booking</option>
            <option value="wrong_date">Wrong booking date</option>
            <option value="change_plans">Change of plans</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        <div class="flex space-x-4">
          <button 
            @click="showDeleteModal = false; selectedBooking = null; deleteReason = ''"
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-200"
          >
            Delete Booking
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Booking Confirmation Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Cancel Booking</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to cancel booking #{{ selectedBooking?.booking_id }}? 
          This action cannot be undone and may affect your refund eligibility.
        </p>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation</label>
          <select v-model="cancelReason" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option value="">Select a reason</option>
            <option value="change_plans">Change of plans</option>
            <option value="weather_concerns">Weather concerns</option>
            <option value="emergency">Emergency situation</option>
            <option value="found_better_option">Found a better option</option>
            <option value="financial_reasons">Financial reasons</option>
            <option value="group_size_changed">Group size changed</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        <div class="flex space-x-4">
          <button 
            @click="showCancelModal = false; selectedBooking = null; cancelReason = ''"
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
          >
            Keep Booking
          </button>
          <button 
            @click="confirmCancel"
            class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>

    <!-- Booking History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">Booking History</h3>
          <button 
            @click="showHistoryModal = false; selectedBooking = null; bookingHistory = []"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div class="mb-4 p-4 bg-orange-50 rounded-lg">
          <h4 class="font-semibold text-orange-800">Booking #{{ selectedBooking?.booking_id }}</h4>
          <p class="text-orange-600">{{ selectedBooking?.boat_name }} - {{ formatDate(selectedBooking?.booking_date) }}</p>
        </div>

        <div v-if="bookingHistory.length === 0" class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📜</div>
          <p>No history available for this booking</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="(history, index) in bookingHistory" 
            :key="history.history_id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                     :class="BookingSoftDeleteService.getActionColor(history.action).replace('text-', 'bg-').replace('bg-', 'bg-').split(' ')[0]">
                  {{ BookingSoftDeleteService.getActionIcon(history.action) }}
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="font-semibold text-gray-800 capitalize">{{ history.action.replace('_', ' ') }}</span>
                  <span class="text-sm text-gray-500">{{ BookingSoftDeleteService.formatTimeAgo(history.created_at) }}</span>
                </div>
                <p v-if="history.change_reason" class="text-sm text-gray-600 mb-2">{{ history.change_reason }}</p>
                <div v-if="history.action === 'cancelled' && history.new_values" class="text-sm text-orange-600 mb-2">
                  <strong>Cancellation Reason:</strong> {{ JSON.parse(history.new_values).cancellation_reason || 'Not specified' }}
                </div>
                <p v-if="history.changed_by_name" class="text-sm text-gray-500">
                  Changed by: {{ history.changed_by_name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import BookingSoftDeleteService from "../../services/bookingSoftDeleteService";
import Swal from "sweetalert2";

const router = useRouter();

const tabs = ["All Bookings", "Upcoming", "Past", "Cancelled"];
const activeTab = ref("All Bookings");
const bookings = ref([]);
const deletedBookings = ref([]);
const showDeleteModal = ref(false);
const showCancelModal = ref(false);
const showHistoryModal = ref(false);
const selectedBooking = ref(null);
const deleteReason = ref('');
const cancelReason = ref('');
const bookingHistory = ref([]);

const user = JSON.parse(localStorage.getItem("user"));

const fetchBookings = async () => {
  try {
    // Try different user ID fields
    const userId = user.userId || user.user_id || user.id;
    const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
    bookings.value = res.data;
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
  }
};

const fetchDeletedBookings = async () => {
  try {
    const response = await BookingSoftDeleteService.getDeletedBookings();
    deletedBookings.value = response.data || [];
  } catch (err) {
    console.error("Failed to fetch deleted bookings:", err);
  }
};

const filteredBookings = computed(() => {
  if (activeTab.value === "All Bookings") return bookings.value;
  if (activeTab.value === "Upcoming") return bookings.value.filter(b => b.status === "Pending" || b.status === "Confirmed");
  if (activeTab.value === "Past") return bookings.value.filter(b => b.status === "Completed");
  if (activeTab.value === "Cancelled") return bookings.value.filter(b => b.status === "Cancelled");
  if (activeTab.value === "Deleted") return deletedBookings.value;
  return [];
});

// Get tab count for badges
const getTabCount = (tab) => {
  if (tab === "All Bookings") return bookings.value.length;
  if (tab === "Upcoming") return bookings.value.filter(b => b.status === "Pending" || b.status === "Confirmed").length;
  if (tab === "Past") return bookings.value.filter(b => b.status === "Completed").length;
  if (tab === "Cancelled") return bookings.value.filter(b => b.status === "Cancelled").length;
  if (tab === "Deleted") return deletedBookings.value.length;
  return 0;
};

// Get tab icon
const getTabIcon = (tab) => {
  const icons = {
    "All Bookings": "📋",
    "Upcoming": "⏰",
    "Past": "✅",
    "Cancelled": "❌"
  };
  return icons[tab] || "📋";
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatCurrency = (value) =>
  `₱${Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const printBooking = (booking) => {
  // Create a comprehensive receipt HTML
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Receipt - ${booking.boat_name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #f97316; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .logo { 
          font-size: 24px; 
          font-weight: bold; 
          color: #f97316; 
          margin-bottom: 10px;
        }
        .receipt-title { 
          font-size: 20px; 
          font-weight: bold; 
          margin-bottom: 5px;
        }
        .booking-info { 
          background: #f8fafc; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 20px;
        }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 8px; 
          padding: 5px 0;
        }
        .info-label { 
          font-weight: bold; 
          color: #374151;
        }
        .info-value { 
          color: #6b7280;
        }
        .section { 
          margin-bottom: 25px;
        }
        .section-title { 
          font-size: 16px; 
          font-weight: bold; 
          color: #f97316; 
          margin-bottom: 10px; 
          border-bottom: 1px solid #e5e7eb; 
          padding-bottom: 5px;
        }
        .item-list { 
          margin-left: 20px;
        }
        .item { 
          margin-bottom: 8px; 
          padding: 5px 0;
        }
        .payment-proof { 
          text-align: center; 
          margin: 20px 0;
        }
        .payment-proof img { 
          max-width: 100%; 
          height: auto; 
          border: 1px solid #e5e7eb; 
          border-radius: 8px;
        }
        .total { 
          font-size: 18px; 
          font-weight: bold; 
          color: #f97316; 
          text-align: right; 
          margin-top: 20px; 
          padding-top: 15px; 
          border-top: 2px solid #e5e7eb;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          color: #6b7280; 
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">WAVENTURE</div>
        <div class="receipt-title">Booking Receipt</div>
        <div>Booking #${booking.booking_id}</div>
      </div>

      <div class="booking-info">
        <div class="info-row">
          <span class="info-label">Customer Name:</span>
          <span class="info-value">${booking.full_name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Boat:</span>
          <span class="info-value">${booking.boat_name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${formatDate(booking.booking_date)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Time:</span>
          <span class="info-value">${booking.booking_time}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Duration:</span>
          <span class="info-value">${booking.duration_option}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Meet-up Location:</span>
          <span class="info-value">${booking.meet_up_location || 'TBD'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Method:</span>
          <span class="info-value">${booking.payment_method}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Status:</span>
          <span class="info-value">${booking.payment_status || 'Unpaid'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Booking Status:</span>
          <span class="info-value">${booking.status}</span>
        </div>
      </div>

      ${booking.addons && booking.addons.length ? `
        <div class="section">
          <div class="section-title">Add-ons</div>
          <div class="item-list">
            ${booking.addons.map(addon => `
              <div class="item">${addon.name} - Qty: ${addon.quantity} × ${formatCurrency(addon.price)}</div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${booking.foodpackages && booking.foodpackages.length ? `
        <div class="section">
          <div class="section-title">Food Packages</div>
          <div class="item-list">
            ${booking.foodpackages.map(food => `
              <div class="item">${food.name} - Qty: ${food.quantity} × ${formatCurrency(food.price)}</div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${booking.islands && booking.islands.length ? `
        <div class="section">
          <div class="section-title">Islands</div>
          <div class="item-list">
            ${booking.islands.map(island => `
              <div class="item">${island.name} - ${formatCurrency(island.price)}</div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${booking.payment_proof ? `
        <div class="section">
          <div class="section-title">Payment Proof</div>
          <div class="payment-proof">
            <img src="${getPaymentProofUrl(booking.payment_proof)}" alt="Payment Proof" />
          </div>
        </div>
      ` : ''}

      <div class="total">
        Total Amount: ${formatCurrency(booking.total_price)}
      </div>

      <div class="footer">
        <p>Thank you for choosing WAVENTURE!</p>
        <p>For inquiries, please contact us at support@waventure.com</p>
        <p>Receipt generated on ${new Date().toLocaleDateString('en-PH')} at ${new Date().toLocaleTimeString('en-PH')}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  
  // Wait for images to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };
};

// Helper function to get payment proof URL
const getPaymentProofUrl = (paymentProofPath) => {
  if (!paymentProofPath) return '';
  // Ensure the path starts with /uploads/payments/
  const cleanPath = paymentProofPath.startsWith('/') ? paymentProofPath : `/${paymentProofPath}`;
  return `http://localhost:5000${cleanPath}`;
};

// Handle image loading errors
const handleImageError = (event) => {
  console.error('Failed to load payment proof image:', event.target.src);
  event.target.style.display = 'none';
  // Show a placeholder or error message
  const parent = event.target.parentElement;
  if (parent && !parent.querySelector('.image-error')) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'image-error text-center p-4 text-gray-500';
    errorDiv.innerHTML = `
      <div class="text-4xl mb-2">📄</div>
      <p>Payment proof image not available</p>
      <p class="text-sm">The image may have been moved or deleted</p>
    `;
    parent.appendChild(errorDiv);
  }
};

const viewPaymentProof = (paymentProofPath) => {
  const imageUrl = getPaymentProofUrl(paymentProofPath);
  console.log('Opening payment proof:', imageUrl);
  
  const modal = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
  
  modal.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Proof - Booking Receipt</title>
      <style>
        body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
        .modal-content { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%; text-align: center; }
        .modal-content img { max-width: 100%; max-height: 80vh; border-radius: 4px; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .close-btn { background: #f97316; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-top: 20px; font-size: 16px; font-weight: bold; }
        .close-btn:hover { background: #ea580c; }
        .error-message { color: #dc2626; padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin: 20px 0; }
        .loading { color: #6b7280; padding: 40px; }
      </style>
    </head>
    <body>
      <div class="modal-content">
        <h2 style="color: #f97316; margin-bottom: 20px;">Payment Proof</h2>
        <div id="image-container">
          <div class="loading">Loading payment proof...</div>
        </div>
        <button class="close-btn" onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `);
  
  modal.document.close();
  
  // Load image after document is ready
  modal.onload = () => {
    const container = modal.document.getElementById('image-container');
    const img = new Image();
    
    img.onload = function() {
      container.innerHTML = '<img src="' + imageUrl + '" alt="Payment Proof" />';
    };
    
    img.onerror = function() {
      container.innerHTML = '<div class="error-message"><h3>Image Not Found</h3><p>The payment proof image could not be loaded.</p><p>URL: ' + imageUrl + '</p></div>';
    };
    
    img.src = imageUrl;
  };
};

const viewReview = (bookingId) => {
  // Navigate to review page or show review modal
  router.push({ name: 'RateBooking', params: { id: bookingId } });
};

// Soft delete booking
const deleteBooking = async (booking) => {
  selectedBooking.value = booking;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await BookingSoftDeleteService.softDeleteBooking(selectedBooking.value.booking_id, deleteReason.value);
    
    Swal.fire({
      title: 'Success!',
      text: 'Booking deleted successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    // Refresh bookings
    await fetchBookings();
    await fetchDeletedBookings();
    
    showDeleteModal.value = false;
    selectedBooking.value = null;
    deleteReason.value = '';
  } catch (error) {
    console.error('Error deleting booking:', error);
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message || 'Failed to delete booking',
      icon: 'error'
    });
  }
};

// Restore booking
const restoreBooking = async (booking) => {
  try {
    const result = await Swal.fire({
      title: 'Restore Booking?',
      text: `Are you sure you want to restore booking #${booking.booking_id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, restore it!'
    });

    if (result.isConfirmed) {
      await BookingSoftDeleteService.restoreBooking(booking.booking_id, 'Restored by user');
      
      Swal.fire({
        title: 'Success!',
        text: 'Booking restored successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Refresh bookings
      await fetchBookings();
      await fetchDeletedBookings();
    }
  } catch (error) {
    console.error('Error restoring booking:', error);
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message || 'Failed to restore booking',
      icon: 'error'
    });
  }
};

// View booking history
const viewBookingHistory = async (booking) => {
  try {
    const response = await BookingSoftDeleteService.getBookingHistory(booking.booking_id);
    bookingHistory.value = response.data || [];
    selectedBooking.value = booking;
    showHistoryModal.value = true;
  } catch (error) {
    console.error('Error fetching booking history:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to fetch booking history',
      icon: 'error'
    });
  }
};

// Cancel booking
const cancelBooking = async (booking) => {
  // Check if booking can be cancelled
  if (booking.status !== 'Pending' && booking.status !== 'Confirmed') {
    Swal.fire({
      title: 'Cannot Cancel',
      text: 'This booking cannot be cancelled. Only pending or confirmed bookings can be cancelled.',
      icon: 'warning'
    });
    return;
  }

  selectedBooking.value = booking;
  showCancelModal.value = true;
};

const confirmCancel = async () => {
  if (!cancelReason.value) {
    Swal.fire({
      title: 'Reason Required',
      text: 'Please select a reason for cancellation',
      icon: 'warning'
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in again to cancel your booking',
        icon: 'error'
      });
      return;
    }

    const response = await axios.put(
      `http://localhost:5000/api/bookings/${selectedBooking.value.booking_id}/status`,
      {
        status: 'Cancelled',
        cancelReason: cancelReason.value
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    Swal.fire({
      title: 'Success!',
      text: 'Booking cancelled successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    // Refresh bookings
    await fetchBookings();
    
    showCancelModal.value = false;
    selectedBooking.value = null;
    cancelReason.value = '';
  } catch (error) {
    console.error('Error cancelling booking:', error);
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message || 'Failed to cancel booking',
      icon: 'error'
    });
  }
};

onMounted(() => {
  AOS.init({ duration: 800, once: true });
  fetchBookings();
  fetchDeletedBookings();
});
</script>
