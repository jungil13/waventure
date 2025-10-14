<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            🎯 Choose Add-ons & Food Packages
          </h1>
          <p class="text-lg text-gray-600 mb-2">Enhance your island hopping experience with amazing add-ons and delicious food</p>
          <div class="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              {{ selectedAddons.length }} add-ons selected
            </span>
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              {{ selectedFood ? 'Food package selected' : 'No food package' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-orange-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Loading Packages</h3>
          <p class="text-gray-600">Discovering amazing add-ons and food packages...</p>
        </div>
      </div>

      <div v-else class="space-y-12">
        <!-- Add-ons Section -->
        <div>
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span class="w-10 h-10 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                <span class="text-orange-600">🎯</span>
              </span>
              Add-ons
            </h2>
            <p class="text-gray-600">Choose from our selection of exciting add-ons to enhance your adventure</p>
          </div>
          
          <div v-if="addons.length === 0" class="text-center py-12">
            <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
              <div class="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🎯</span>
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2">No Add-ons Available</h3>
              <p class="text-gray-600">No add-ons are currently available for this boat.</p>
            </div>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="(addon, index) in addons"
              :key="addon.addon_id"
              class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <!-- Addon Image -->
              <div class="relative">
                <div class="aspect-video w-full overflow-hidden">
                  <img
                    v-if="addon.images && addon.images.length"
                    :src="`http://localhost:5000${addon.images[0]}`"
                    :alt="addon.name"
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span class="text-2xl">🎯</span>
                      </div>
                      <p class="text-gray-500 text-sm">No Image Available</p>
                    </div>
                  </div>
                </div>
                
                <!-- Selection Badge -->
                <div v-if="selectedAddons.includes(addon)" class="absolute top-4 right-4">
                  <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <!-- Price Badge -->
                <div class="absolute bottom-4 left-4">
                  <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span class="text-orange-600 font-bold text-sm">₱{{ addon.price }}</span>
                  </div>
                </div>
              </div>

              <!-- Addon Info -->
              <div class="p-6">
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">{{ addon.name }}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2">{{ addon.description || 'No description available' }}</p>
                </div>

                <!-- Selection Controls -->
                <div class="space-y-4">
                  <!-- Checkbox -->
                  <div class="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      :value="addon"
                      v-model="selectedAddons"
                      class="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <label class="text-sm font-medium text-gray-700 cursor-pointer">
                      Add this add-on
                    </label>
                  </div>

                  <!-- Quantity Selector -->
                  <div v-if="selectedAddons.includes(addon)" class="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
                    <span class="text-sm font-medium text-gray-700">Quantity:</span>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="decreaseQuantity(addon)"
                        class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        v-model.number="addon.quantity"
                        class="w-16 text-center border-0 bg-transparent font-semibold text-gray-800 focus:outline-none"
                      />
                      <button
                        @click="increaseQuantity(addon)"
                        class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Food Packages Section -->
        <div>
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span class="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <span class="text-green-600">🍽️</span>
              </span>
              Food Packages
            </h2>
            <p class="text-gray-600">Select a delicious food package for your island adventure</p>
          </div>
          
          <div v-if="foodPackages.length === 0" class="text-center py-12">
            <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
              <div class="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🍽️</span>
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2">No Food Packages Available</h3>
              <p class="text-gray-600">No food packages are currently available for this boat.</p>
            </div>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(food, index) in foodPackages"
              :key="food.package_id"
              class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              :class="selectedFood === food ? 'border-orange-500 shadow-orange-200' : 'border-white/20'"
              @click="selectedFood = food"
        
            >
              <!-- Food Image -->
              <div class="relative">
                <div class="aspect-video w-full overflow-hidden">
                  <img
                    v-if="food.images && food.images.length"
                    :src="`http://localhost:5000${food.images[0]}`"
                    :alt="food.name"
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span class="text-2xl">🍽️</span>
                      </div>
                      <p class="text-gray-500 text-sm">No Image Available</p>
                    </div>
                  </div>
                </div>
                
                <!-- Selection Badge -->
                <div v-if="selectedFood === food" class="absolute top-4 right-4">
                  <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <!-- Price Badge -->
                <div class="absolute bottom-4 left-4">
                  <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span class="text-green-600 font-bold text-sm">₱{{ food.price }}</span>
                  </div>
                </div>
              </div>

              <!-- Food Info -->
              <div class="p-6">
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">{{ food.name }}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2">{{ food.description || 'No description available' }}</p>
                </div>

                <!-- Selection Indicator -->
                <div class="flex items-center justify-center space-x-3 bg-gray-50 rounded-2xl p-3">
                  <input
                    type="radio"
                    name="foodPackage"
                    :value="food"
                    v-model="selectedFood"
                    class="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500 focus:ring-2"
                  />
                  <label class="text-sm font-medium text-gray-700 cursor-pointer">
                    {{ selectedFood === food ? 'Selected Package' : 'Choose this package' }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div v-if="!loading" class="mt-12">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-center sm:text-left">
              <h3 class="text-lg font-bold text-gray-800 mb-1">Ready to Continue?</h3>
              <p class="text-gray-600 text-sm">
                {{ selectedFood 
                  ? `You've selected ${selectedAddons.length} add-on${selectedAddons.length !== 1 ? 's' : ''} and a food package`
                  : `You can skip add-ons and food, or select any and continue` }}
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="router.push({ name: 'ChooseIslands', params: { id: boatId } })"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                </svg>
                Back
              </button>
              
              <button
                @click="goToPayment"
                class="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span class="flex items-center gap-2">
                  <span>💳</span>
                  <span>Proceed to Payment</span>
                </span>
              </button>

              <button
                @click="skipSelections"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5l5-3-5-3v6z" clip-rule="evenodd" />
                </svg>
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';

const route = useRoute();
const router = useRouter();
const boatId = route.params.id;

const addons = ref([]);
const foodPackages = ref([]);
const selectedAddons = ref([]);
const selectedFood = ref(null);
const loading = ref(true);
const bookingInfo = ref(null);

onMounted(async () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true
  });

  try {
    const storedBooking = JSON.parse(localStorage.getItem("bookingInfo"));
    if (!storedBooking || !storedBooking.islands) {
      router.push({ name: "ChooseIslands", params: { id: boatId } });
      return;
    }
    bookingInfo.value = storedBooking;

    loading.value = true;
    const [addonsRes, foodRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/packages/addon/boat/${boatId}`),
      axios.get(`http://localhost:5000/api/packages/foodpackage/boat/${boatId}`),
    ]);

    addons.value = addonsRes.data.map(a => ({
      ...a,
      images: Array.isArray(a.images) ? a.images : JSON.parse(a.images || "[]"),
      quantity: 1,
    }));

    foodPackages.value = foodRes.data.map(f => ({
      ...f,
      images: Array.isArray(f.images) ? f.images : JSON.parse(f.images || "[]"),
    }));
  } catch (err) {
    console.error("Error fetching packages:", err);
  } finally {
    loading.value = false;
  }
});

// Quantity control functions
const increaseQuantity = (addon) => {
  if (addon.quantity < 10) {
    addon.quantity++;
  }
};

const decreaseQuantity = (addon) => {
  if (addon.quantity > 1) {
    addon.quantity--;
  }
};

const goToPayment = () => {
  const finalAddons = selectedAddons.value.map((addon) => ({
    ...addon,
    quantity: addon.quantity || 1,
  }));

  // Calculate total addon price
  const totalAddonPrice = finalAddons.reduce((sum, addon) => {
    return sum + (parseFloat(addon.price) * addon.quantity);
  }, 0);

  const updatedBooking = {
    ...bookingInfo.value,
    addons: finalAddons,
    food: selectedFood.value ? {
      package_id: selectedFood.value.package_id || selectedFood.value.id,
      name: selectedFood.value.name,
      description: selectedFood.value.description,
      price: selectedFood.value.price,
      images: selectedFood.value.images
    } : null,
    totalAddonPrice: totalAddonPrice,
    totalFoodPrice: selectedFood.value ? parseFloat(selectedFood.value.price) : 0,
  };

  localStorage.setItem("bookingInfo", JSON.stringify(updatedBooking));
  router.push({ name: "Payment", params: { id: boatId } });
};

// Skip button handler: clear addons and food, keep previous booking info
const skipSelections = () => {
  const updatedBooking = {
    ...bookingInfo.value,
    addons: [],
    food: null,
    totalAddonPrice: 0,
    totalFoodPrice: 0,
  };
  localStorage.setItem("bookingInfo", JSON.stringify(updatedBooking));
  router.push({ name: "Payment", params: { id: boatId } });
};
</script>
