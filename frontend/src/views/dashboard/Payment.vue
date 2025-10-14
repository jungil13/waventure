<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span class="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <CreditCardIcon class="h-8 w-8 text-green-600" />
            </span>
            Complete Your Booking
          </h1>
          <p class="text-lg text-gray-600">Review your booking details and choose your payment method</p>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Booking Summary -->
        <div class="w-full lg:w-2/3">
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                <ClipboardDocumentListIcon class="h-5 w-5 text-orange-600" />
              </span>
              Booking Summary
            </h2>

            <!-- Boat Details -->
            <div v-if="boat" class="mb-8">
              <div class="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PaperAirplaneIcon class="h-6 w-6 text-orange-500" />
                  Boat Details
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Boat Image -->
                  <div class="relative">
                    <img v-if="boat.images?.length" :src="'http://localhost:5000' + boat.images[0]"
                      class="w-full h-48 object-cover rounded-xl shadow-lg" />
                    <div v-else class="w-full h-48 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl flex items-center justify-center">
                      <PaperAirplaneIcon class="h-16 w-16 text-orange-400" />
                    </div>
                  </div>
                  
                  <!-- Boat Information -->
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <PaperAirplaneIcon class="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Boat Name</p>
                        <p class="font-semibold text-gray-800">{{ boat.name }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <SwatchIcon class="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Type</p>
                        <p class="font-semibold text-gray-800">{{ boat.boat_type }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon class="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Capacity</p>
                        <p class="font-semibold text-gray-800">{{ boat.capacity }} persons</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <CurrencyDollarIcon class="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Base Price</p>
                        <p class="font-semibold text-gray-800">₱{{ parseFloat(boat.rental_price).toLocaleString() }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Booking Details -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center gap-3">
                    <CalendarDaysIcon class="h-5 w-5 text-orange-500" />
                    <div>
                      <p class="text-sm text-gray-600">Date</p>
                      <p class="font-semibold text-gray-800">{{ bookingInfo?.date }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <ClockIcon class="h-5 w-5 text-orange-500" />
                    <div>
                      <p class="text-sm text-gray-600">Time</p>
                      <p class="font-semibold text-gray-800">{{ bookingInfo?.time }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 md:col-span-2">
                    <MapPinIcon class="h-5 w-5 text-orange-500" />
                    <div>
                      <p class="text-sm text-gray-600">Meet-up Location</p>
                      <p class="font-semibold text-gray-800">{{ bookingInfo?.location }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Selected Islands -->
                <div v-if="bookingInfo?.islands?.length" class="mt-6">
                  <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapIcon class="h-5 w-5 text-green-500" />
                    Selected Islands
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="island in bookingInfo.islands" :key="island.island_id"
                      class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {{ island.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add-ons -->
            <div class="mb-8">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PlusCircleIcon class="h-6 w-6 text-blue-500" />
                  Add-ons
                </h3>
                <div v-if="bookingInfo?.addons?.length" class="space-y-3">
                  <div v-for="addon in bookingInfo.addons" :key="addon.addon_id" 
                    class="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon class="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p class="font-semibold text-gray-800">{{ addon.name }}</p>
                        <p v-if="addon.quantity" class="text-sm text-gray-600">Quantity: {{ addon.quantity }}</p>
                      </div>
                    </div>
                    <span class="font-bold text-blue-600">₱{{ (addon.price * (addon.quantity || 1)).toLocaleString() }}</span>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusCircleIcon class="h-8 w-8 text-blue-400" />
                  </div>
                  <p class="text-gray-500">No add-ons selected</p>
                </div>
              </div>
            </div>

            <!-- Food Package -->
            <div class="mb-8">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CakeIcon class="h-6 w-6 text-green-500" />
                  Food Package
                </h3>
                <div v-if="bookingInfo?.food" class="bg-white rounded-xl p-4 shadow-sm">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon class="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p class="font-semibold text-gray-800">{{ bookingInfo.food.name }}</p>
                        <p class="text-sm text-gray-600">Food Package</p>
                      </div>
                    </div>
                    <span class="font-bold text-green-600">₱{{ parseFloat(bookingInfo.food.price).toLocaleString() }}</span>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CakeIcon class="h-8 w-8 text-green-400" />
                  </div>
                  <p class="text-gray-500">No food package selected</p>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
                  Total Amount
                </h2>
                <p class="text-3xl font-bold text-green-600">{{ formatPrice(totalPrice) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Section -->
        <div class="w-full lg:w-1/3">
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <CreditCardIcon class="h-5 w-5 text-green-600" />
              </span>
              Payment Method
            </h2>

            <!-- Payment Options -->
            <div class="space-y-4">
              <label class="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200"
                :class="paymentMethod === 'GCash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'">
                <input type="radio" value="GCash" v-model="paymentMethod" class="mr-3 w-5 h-5 text-green-600" />
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <img src="https://logoeps.com/wp-content/uploads/2025/02/GCash-logo-1-1.png" class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">GCash</p>
                    <p class="text-sm text-gray-600">Pay with GCash wallet</p>
                  </div>
                </div>
              </label>

              
            </div>

            <!-- GCash Payment Details -->
            <div v-if="paymentMethod === 'GCash'" class="mt-8">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <QrCodeIcon class="h-5 w-5 text-green-600" />
                  GCash Payment
                </h3>
                
                <div class="text-center">
                  <p class="text-sm text-gray-600 mb-4">Scan QR code to pay with GCash:</p>
                  <div class="bg-white rounded-xl p-4 shadow-sm inline-block">
                    <img src="https://cdn.shopify.com/s/files/1/0272/8535/6646/files/Happyfoods_Corporation_480x480.png?v=1620648625"
                      alt="GCash QR" class="w-48 mx-auto" />
                  </div>
                  
                  <div class="mt-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload Payment Proof</label>
                    <div class="relative">
                      <input type="file" 
                        class="w-full border-2 border-dashed border-green-300 rounded-xl p-4 text-sm hover:border-green-400 transition-colors cursor-pointer" 
                        @change="handleFileUpload" 
                        accept="image/*" />
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div class="text-center">
                          <CloudArrowUpIcon class="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <p class="text-sm text-gray-500">Click to upload payment proof</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirm Button -->
            <button
              class="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              @click="confirmBooking"
              :disabled="submitting || (paymentMethod==='GCash' && !paymentProof)"
            >
              <div v-if="submitting" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
              <div v-else class="flex items-center justify-center gap-2">
                <CheckCircleIcon class="h-6 w-6" />
                <span>Confirm Booking</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import {
  CreditCardIcon,
  ClipboardDocumentListIcon,
  PaperAirplaneIcon,
  SwatchIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  MapIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  CakeIcon,
  QrCodeIcon,
  CloudArrowUpIcon
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const boatId = route.params.id;

const boat = ref(null);
const bookingInfo = ref(null);
const paymentMethod = ref("GCash");
const paymentProof = ref(null);
const submitting = ref(false);
const user = JSON.parse(localStorage.getItem("user") || "{}");

onMounted(async () => {
  AOS.init({ duration: 800, once: true });
  
  const storedBooking = JSON.parse(localStorage.getItem("bookingInfo") || "null");
  if (!storedBooking) {
    router.push({ name: "BoatDetails", params: { id: boatId } });
    return;
  }
  bookingInfo.value = storedBooking;

  try {
    const res = await axios.get(`http://localhost:5000/api/boats/${boatId}`);
    boat.value = res.data;
  } catch (err) {
    console.error(err);
  }
});

// Total price including boat, islands, addons, and food
const totalPrice = computed(() => {
  if (!bookingInfo.value || !boat.value) return 0;

  const basePrice = Number(boat.value.rental_price) || 0;

  const islandsTotal = (bookingInfo.value.islands || []).reduce(
    (sum, island) => sum + (Number(island.price) || 0),
    0
  );

  const addonsTotal = (bookingInfo.value.addons || []).reduce(
    (sum, addon) => sum + (Number(addon.price) * (addon.quantity || 1)),
    0
  );

  const foodTotal = bookingInfo.value.food ? Number(bookingInfo.value.food.price) : 0;

  return basePrice + islandsTotal + addonsTotal + foodTotal;
});

const formatPrice = (value) => {
  return `₱${Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const handleFileUpload = (e) => {
  paymentProof.value = e.target.files[0];
};

const confirmBooking = async () => {
  // Check if user is logged in
  if (!user || (!user.user_id && !user.userId && !user.id)) {
    await Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: 'Please login first to complete your booking.',
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#ea580c',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/login");
      }
    });
    return;
  }

  if (!bookingInfo.value || !boat.value) {
    await Swal.fire({
      icon: 'error',
      title: 'Booking Information Missing',
      text: 'Unable to find booking details. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  submitting.value = true;
  try {
    // Get user ID from different possible field names
    const userId = user.user_id || user.userId || user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("boat_id", boatId);
    formData.append("booking_date", bookingInfo.value.date);
    formData.append("booking_time", bookingInfo.value.time);
    formData.append("meet_up_location", bookingInfo.value.location);
    formData.append("duration_option", "Full Day");
    formData.append("status", "Pending");
    formData.append("payment_method", paymentMethod.value);
    formData.append(
      "payment_status",
      "Pending"
    );
    formData.append("total_price", totalPrice.value);
    formData.append("islands", JSON.stringify(bookingInfo.value.islands || []));
    formData.append("addons", JSON.stringify(bookingInfo.value.addons || []));
    if (bookingInfo.value.food)
      formData.append("food", JSON.stringify(bookingInfo.value.food));
    if (paymentProof.value) formData.append("payment_proof", paymentProof.value);

    await axios.post("http://localhost:5000/api/bookings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await Swal.fire({
      icon: 'success',
      title: 'Booking Confirmed! 🎉',
      html: `
        <div class="text-center">
          <p class="mb-4">Your booking has been successfully created!</p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-green-700">
              <strong>Payment Method:</strong> ${paymentMethod.value}<br>
              <strong>Total Amount:</strong> ${formatPrice(totalPrice.value)}
            </p>
          </div>
          <p class="text-sm text-gray-600">You will receive a confirmation email shortly.</p>
        </div>
      `,
      confirmButtonText: 'View My Bookings',
      confirmButtonColor: '#10b981',
      showCancelButton: true,
      cancelButtonText: 'Stay Here',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      localStorage.removeItem("bookingInfo");
      if (result.isConfirmed) {
        router.push("/user/bookings");
      }
    });
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Booking Failed',
      html: `
        <div class="text-center">
          <p class="mb-4">We encountered an error while processing your booking.</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-red-700">
              ${err.response?.data?.message || 'Please try again or contact support if the problem persists.'}
            </p>
          </div>
        </div>
      `,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6b7280'
    });
  } finally {
    submitting.value = false;
  }
};

</script>
