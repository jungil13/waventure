<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">🏝️ Island Management</h1>
        <p class="text-xl opacity-90">Manage and showcase your island destinations</p>
      </div>
    </div>

    <!-- Enhanced Header with Add Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">Your Island Destinations</h2>
        <p class="text-gray-300">Create and manage island destinations for your boat tours</p>
      </div>
      <button
        @click="openAddModal"
        class="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
       
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Add New Island</span>
      </button>
    </div>

    <!-- Enhanced Islands Grid -->
    <div class="mt-6">
      <div v-if="islands.length === 0" class="text-center py-16">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
          <div class="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-4xl">🏝️</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">No Islands Added Yet!</h3>
          <p class="text-gray-300 mb-6">Start by adding your first island destination to showcase to customers.</p>
          <button @click="openAddModal" class="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            Add Your First Island
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="island in islands"
          :key="island.island_id"
          class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group"
        >
          <!-- Image with Overlay -->
          <div class="relative w-full h-48 overflow-hidden">
            <img
              :src="getImageUrl(island.images?.[0])"
              alt="Island Image"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <!-- Price Overlay -->
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-sm font-bold text-orange-600">₱{{ island.price }}</span>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute bottom-4 left-4">
              <span
                :class="island.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'"
                class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
              >
                {{ island.status }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-6 space-y-4">
            <div>
              <h2 class="text-xl font-bold text-white mb-2">{{ island.name }}</h2>
              <p class="text-sm text-gray-300 line-clamp-2">{{ island.description }}</p>
            </div>

            <!-- Features -->
            <div v-if="island.features" class="bg-white/5 rounded-xl p-3">
              <p class="text-xs text-gray-400 mb-1">Features:</p>
              <p class="text-sm text-gray-200">{{ island.features }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-2">
              <button
                @click="viewIsland(island)"
                class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>View</span>
              </button>
              <button
                @click="editIsland(island)"
                class="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Enhanced Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 overflow-y-auto max-h-[90vh] text-white">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-3xl font-bold mb-2">
                {{ modalMode === 'add' ? '🏝️ Add New Island' : modalMode === 'edit' ? '✏️ Edit Island' : '👁️ Island Details' }}
              </h2>
              <p class="text-gray-300">
                {{ modalMode === 'add' ? 'Create a new island destination' : modalMode === 'edit' ? 'Update island information' : 'View island details' }}
              </p>
            </div>
            <button @click="closeModal" class="text-gray-300 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Enhanced Form (Add/Edit) -->
          <div v-if="modalMode !== 'view'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-white font-semibold mb-2">🏝️ Island Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Enter island name"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label class="block text-white font-semibold mb-2">💰 Price</label>
                <input
                  v-model="form.price"
                  type="number"
                  placeholder="Enter price"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">📄 Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Describe the island"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">⭐ Features</label>
              <input
                v-model="form.features"
                type="text"
                placeholder="e.g. White sand, Snorkeling, Beach activities"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <!-- Enhanced Image Upload -->
            <div>
              <label class="block text-white font-semibold mb-2">📸 Upload Images (Max 5)</label>
              <div class="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                <input
                  ref="imageInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />
                <button @click="$refs.imageInput.click()" class="text-white hover:text-orange-400 transition-colors">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-sm">Click to upload island images</p>
                </button>
              </div>
              <div v-if="previewImages.length > 0" class="mt-4 grid grid-cols-3 gap-3">
                <div v-for="(img, index) in previewImages" :key="index" class="relative group">
                  <img :src="img" class="w-full h-24 object-cover rounded-xl" />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced View Mode -->
          <div v-else class="space-y-6">
            <div class="grid grid-cols-2 gap-3">
              <img v-for="(img, i) in form.images" :key="i" :src="getImageUrl(img)" class="w-full h-32 object-cover rounded-xl" />
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
                <span class="text-gray-400">Features:</span>
                <span class="text-white font-semibold">{{ form.features }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Price:</span>
                <span class="text-green-400 font-bold">₱{{ form.price }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Status:</span>
                <span :class="form.status === 'Approved' ? 'text-green-400' : 'text-yellow-400'" class="font-semibold">{{ form.status }}</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="flex justify-end space-x-4 mt-8">
            <button @click="closeModal" 
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200">
              Cancel
            </button>
            <button v-if="modalMode !== 'view'" @click="saveIsland" 
              class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              💾 Save Island
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

const showModal = ref(false);
const modalMode = ref("add"); // add | edit | view
const islands = ref([]);
const previewImages = ref([]);
const imageInput = ref(null);
const form = ref({
  island_id: null,
  name: "",
  description: "",
  features: "",
  price: "",
  images: [],
  status: "",
});

// Axios instance with token
const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "http://localhost:5000/api/islands",
  headers: { Authorization: `Bearer ${token}` },
});

// Fix image URL to load from server
const getImageUrl = (path) => path ? `http://localhost:5000${path}` : 'https://placehold.co/400x200/cccccc/333333?text=No+Image';

// Load islands by current user
const loadIslands = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("user")).user_id;
    const res = await api.get(`/user/${userId}`);
    islands.value = res.data;
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load islands", "error");
  }
};

// Modal controls
const openAddModal = () => {
  modalMode.value = "add";
  form.value = { island_id: null, name: "", description: "", features: "", price: "", images: [], status: "" };
  previewImages.value = [];
  showModal.value = true;
};

const editIsland = (island) => {
  modalMode.value = "edit";
  form.value = { ...island };
  previewImages.value = [...(island.images || [])];
  showModal.value = true;
};

const viewIsland = (island) => {
  modalMode.value = "view";
  form.value = { ...island };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  previewImages.value = [];
  if (imageInput.value) imageInput.value.value = "";
};

// Image upload
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => previewImages.value.push(URL.createObjectURL(file)));
  form.value.newImages = files; // keep files for upload
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  if (form.value.newImages) form.value.newImages.splice(index, 1);
  if (imageInput.value) imageInput.value.value = "";
};

// Save island (Add/Edit)
const saveIsland = async () => {
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("description", form.value.description);
    formData.append("features", form.value.features);
    formData.append("price", form.value.price);

    if (form.value.newImages?.length > 0) {
      form.value.newImages.forEach(file => formData.append("images", file));
    }

    if (modalMode.value === "add") {
      await api.post("/suggest", formData);
      Swal.fire("Success", "Island suggested successfully!", "success");
    } else if (modalMode.value === "edit") {
      await api.put(`/edit/${form.value.island_id}`, formData);
      Swal.fire("Success", "Island updated successfully!", "success");
    }

    closeModal();
    await loadIslands();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.response?.data?.message || "Failed to save island", "error");
  }
};

onMounted(() => {
  loadIslands();
});
</script>
