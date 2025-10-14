<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">🍽️ Food Packages & Add-ons</h1>
        <p class="text-xl opacity-90">Manage your food offerings and additional services</p>
      </div>
    </div>

    <!-- Enhanced Header with Add Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8" >
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">Manage Your Offerings</h2>
        <p class="text-gray-300">Create and manage food packages and add-on services for your boats</p>
      </div>
      <button @click="openAddModal"
        class="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Add New Item</span>
      </button>
    </div>

    <!-- Enhanced Tabs -->
    <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-2 mb-8">
      <div class="flex space-x-2">
        <button @click="activeTab = 'packages'"
          :class="activeTab === 'packages' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          class="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-200">
          <div class="flex items-center justify-center space-x-2">
            <span>🍽️</span>
            <span>Food Packages</span>
          </div>
        </button>
        <button @click="activeTab = 'addons'"
          :class="activeTab === 'addons' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          class="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-200">
          <div class="flex items-center justify-center space-x-2">
            <span>➕</span>
            <span>Add-ons</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Enhanced Grid of Items -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="item in (activeTab === 'packages' ? packages : addons)" :key="item.id"
        class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group">
        
        <!-- Image with Overlay -->
        <div class="relative w-full h-48 overflow-hidden">
          <img 
            :src="item.images?.[0] ? `http://localhost:5000${item.images[0]}` : 'https://placehold.co/400x200/333333/ffffff?text=No+Image'" 
            alt="Item" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          
          <!-- Price Overlay -->
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span class="text-sm font-bold text-orange-600">₱{{ item.price }}</span>
          </div>
          
          <!-- Status Badge -->
          <div class="absolute bottom-4 left-4">
            <span 
              :class="item.status === 'Available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'" 
              class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              {{ item.status }}
            </span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6 space-y-4">
          <div>
            <h2 class="text-xl font-bold text-white mb-2">{{ item.name }}</h2>
            <p class="text-sm text-gray-300 line-clamp-2">{{ item.description }}</p>
          </div>


          <!-- Action Buttons -->
          <div class="flex justify-between items-center pt-2">
            <button @click="viewItem(item)" 
              class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>View</span>
            </button>
            <button @click="editItem(item)"
              class="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Modal (Add/Edit/View) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 overflow-y-auto max-h-[90vh] text-white">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-3xl font-bold mb-2">
                {{ modalMode === 'add' ? '➕ Add New Item' : modalMode === 'edit' ? '✏️ Edit Item' : '👁️ Item Details' }}
              </h2>
              <p class="text-gray-300">
                {{ modalMode === 'add' ? 'Create a new food package or add-on' : modalMode === 'edit' ? 'Update item information' : 'View item details' }}
              </p>
            </div>
            <button @click="closeModal" class="text-gray-300 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Enhanced Form -->
          <div v-if="modalMode !== 'view'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-white font-semibold mb-2">🚤 Select Boat</label>
                <select v-model="form.boat_id" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option disabled value="">Select your boat</option>
                  <option v-for="boat in boats" :key="boat.boat_id" :value="boat.boat_id">{{ boat.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-white font-semibold mb-2">💰 Price</label>
                <input v-model="form.price" type="number" placeholder="Enter price"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">📝 Name</label>
              <input v-model="form.name" type="text" placeholder="Enter item name"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">📄 Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Describe your item"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"></textarea>
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">⚙️ Status</label>
              <select v-model="form.status"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="Available">✅ Available</option>
                <option value="Not Available">❌ Not Available</option>
              </select>
            </div>

            <!-- Enhanced Image Upload -->
            <div>
              <label class="block text-white font-semibold mb-2">📸 Upload Images (Max 5)</label>
              <div class="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                <input ref="imageInput" type="file" multiple accept="image/*" @change="handleImageUpload"
                  class="hidden" />
                <button @click="$refs.imageInput.click()" class="text-white hover:text-orange-400 transition-colors">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-sm">Click to upload images</p>
                </button>
              </div>
              <div v-if="previewImages.length" class="mt-4 grid grid-cols-3 gap-3">
                <div v-for="(img, index) in previewImages" :key="index" class="relative group">
                  <img :src="img.startsWith('http') ? img : `http://localhost:5000${img}`" class="w-full h-24 object-cover rounded-xl" />
                  <button type="button" @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced View Mode -->
          <div v-else class="space-y-6">
            <div class="grid grid-cols-2 gap-3">
              <img v-for="img in form.images" :key="img" :src="img.startsWith('http') ? img : `http://localhost:5000${img}`"
                class="w-full h-32 object-cover rounded-xl" />
            </div>
            <div class="bg-white/5 rounded-2xl p-6 space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-400">Name:</span>
                <span class="text-white font-semibold">{{ form.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Description:</span>
                <span class="text-white font-semibold">{{ form.description }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Price:</span>
                <span class="text-green-400 font-bold">₱{{ form.price }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Status:</span>
                <span :class="form.status === 'Available' ? 'text-green-400' : 'text-red-400'" class="font-semibold">{{ form.status }}</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="flex justify-end space-x-4 mt-8">
            <button @click="closeModal" 
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200">
              Cancel
            </button>
            <button v-if="modalMode !== 'view'" @click="saveItem"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              💾 Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const activeTab = ref("packages");
const packages = ref([]);
const addons = ref([]);
const boats = ref([]);
const showModal = ref(false);
const modalMode = ref("add");
const previewImages = ref([]);
const imageInput = ref(null);

const form = ref({
  id: null,
  boat_id: "",
  name: "",
  description: "",
  price: "",
  status: "Available",
  images: [],
  newImages: [],
});

// Get token and user info from localStorage
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user")); // assuming it stores { user_id, name, user_type, ... }
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { Authorization: `Bearer ${token}` },
});

// Load Boats
const loadBoats = async () => {
  try {
    const res = await api.get("/boats/my");
    boats.value = res.data;
    
    if (boats.value.length === 0) {
      Swal.fire({
        title: "No Boats Found",
        text: "You need to add a boat first before creating food packages or add-ons.",
        icon: "warning",
        confirmButtonText: "OK"
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load your boats", "error");
  }
};

// Load all food packages and addons for this user
const loadItems = async () => {
  try {
    const foodRes = await api.get(`/packages/foodpackage/user/${user.user_id}`);
    packages.value = foodRes.data;

    const addonRes = await api.get(`/packages/addon/user/${user.user_id}`);
    addons.value = addonRes.data;
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load items", "error");
  }
};

// Modal Controls
const openAddModal = () => {
  if (boats.value.length === 0) {
    Swal.fire({
      title: "No Boats Available",
      text: "You need to add a boat first before creating food packages or add-ons.",
      icon: "warning",
      confirmButtonText: "OK"
    });
    return;
  }
  
  modalMode.value = "add";
  form.value = { id: null, boat_id: "", name: "", description: "", price: "", status: "Available", images: [], newImages: [] };
  previewImages.value = [];
  showModal.value = true;
};

const editItem = (item) => {
  modalMode.value = "edit";
  form.value = { ...item, newImages: [] };
  // Handle existing images properly
  if (item.images && Array.isArray(item.images)) {
    previewImages.value = [...item.images];
  } else if (item.images && typeof item.images === 'string') {
    try {
      previewImages.value = JSON.parse(item.images);
    } catch (e) {
      previewImages.value = [];
    }
  } else {
    previewImages.value = [];
  }
  showModal.value = true;
};

const viewItem = (item) => {
  modalMode.value = "view";
  form.value = { ...item };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  previewImages.value = [];
  if (imageInput.value) imageInput.value.value = "";
};

// Handle image uploads
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files).slice(0, 5); // max 5 images
  files.forEach(file => previewImages.value.push(URL.createObjectURL(file)));
  form.value.newImages = files;
};

const removeImage = (index) => {
  // Remove from preview
  previewImages.value.splice(index, 1);
  
  // If it's a new image, remove from newImages array
  if (form.value.newImages && index < form.value.newImages.length) {
    form.value.newImages.splice(index, 1);
  } else if (form.value.images && index < form.value.images.length) {
    // If it's an existing image, remove from existing images
    form.value.images.splice(index, 1);
  }
  
  if (imageInput.value) imageInput.value.value = "";
};

// Save item (add/edit)
const saveItem = async () => {
  if (!form.value.boat_id) {
    Swal.fire("Error", "Please select a boat", "error");
    return;
  }
  if (!form.value.name || !form.value.price) {
    Swal.fire("Error", "Name and Price are required", "error");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("boat_id", form.value.boat_id);
    formData.append("name", form.value.name);
    formData.append("description", form.value.description);
    formData.append("price", form.value.price);
    formData.append("status", form.value.status);

    // Handle existing images for edit mode
    if (modalMode.value === "edit" && form.value.images && form.value.images.length > 0) {
      formData.append("existing_images", JSON.stringify(form.value.images));
    }

    // Add new images
    if (form.value.newImages && form.value.newImages.length > 0) {
      form.value.newImages.forEach(file => formData.append("images", file));
    }

    const route = activeTab.value === "packages" ? "foodpackage" : "addon";

    if (modalMode.value === "add") {
      await api.post(`/packages/${route}`, formData);
      Swal.fire("Success", "Item added successfully", "success");
    } else if (modalMode.value === "edit") {
      // Use the correct ID field based on the type
      const idField = activeTab.value === "packages" ? "package_id" : "addon_id";
      const itemId = form.value[idField] || form.value.id;
      await api.put(`/packages/${route}/${itemId}`, formData);
      Swal.fire("Success", "Item updated successfully", "success");
    }

    closeModal();
    await loadItems();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.response?.data?.message || "Failed to save item", "error");
  }
};

// Initial load
onMounted(async () => {
  await loadBoats();
  await loadItems();
});
</script>
