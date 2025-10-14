<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2"> Fleet Management</h1>
        <p class="text-xl opacity-90">Manage your boat fleet and showcase your vessels</p>
      </div>
    </div>

    <!-- Enhanced Header with Search and Add Button -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div class="mb-6 lg:mb-0">
        <h2 class="text-2xl font-bold text-white mb-2">Your Boat Fleet</h2>
        <p class="text-gray-300">Manage and organize your boat collection</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Enhanced Search -->
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search boats..."
            class="w-full sm:w-80 pl-12 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none shadow-lg" />
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-300 absolute left-4 top-3.5" />
        </div>
        
        <!-- Add Boat Button -->
      <button @click="openAddModal"
          class="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200">
        <PlusIcon class="w-5 h-5" />
          <span>Add New Boat</span>
      </button>
    </div>
    </div>

    <!-- Enhanced Boats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="boat in filteredBoats" :key="boat.id"
        class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group">
        
        <!-- Image with Overlay -->
        <div class="relative w-full h-48 overflow-hidden">
        <img :src="boat.images?.[0] || 'https://placehold.co/400x200/cccccc/333333?text=No+Image'" :alt="boat.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" @error="handleImageError($event)" />
          
          <!-- Price Overlay -->
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span class="text-sm font-bold text-orange-600">₱{{ boat.price }}</span>
          </div>
          
          <!-- Status Badge -->
          <div class="absolute bottom-4 left-4">
          <span :class="{
              'bg-green-500/20 text-green-400 border border-green-500/30': boat.status === 'Available',
              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': boat.status === 'Rented',
              'bg-red-500/20 text-red-400 border border-red-500/30': boat.status === 'UnderMaintenance',
            }" class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {{ boat.status }}
          </span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6 space-y-4">
          <div>
            <h3 class="text-xl font-bold text-white mb-2">{{ boat.name }}</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-300">
              <div class="flex items-center space-x-1">
                <span>👥</span>
                <span>{{ boat.capacity }} pax</span>
              </div>
              <div class="flex items-center space-x-1">
                <span>🚤</span>
                <span>{{ boat.boat_type || 'Boat' }}</span>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div v-if="formatFeatures(boat.features)" class="bg-white/5 rounded-xl p-3">
            <p class="text-xs text-gray-400 mb-1">Features:</p>
            <p class="text-sm text-gray-200 truncate">{{ formatFeatures(boat.features) }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center pt-2">
            <button @click="viewBoat(boat)"
              class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              <EyeIcon class="w-4 h-4" />
              <span>View</span>
            </button>
            <button @click="editBoat(boat)"
              class="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              <PencilSquareIcon class="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button @click="deleteBoat(boat.id)"
              class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              <TrashIcon class="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-4xl border border-white/20 overflow-y-auto max-h-[90vh] text-white">
        <div class="p-8">
          <!-- Enhanced Header -->
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-3xl font-bold mb-2">{{ isEditing ? '✏️ Edit Boat' : '🚤 Add New Boat' }}</h2>
              <p class="text-gray-300">{{ isEditing ? 'Update your boat information' : 'Add a new boat to your fleet' }}</p>
            </div>
            <button @click="closeModal" class="text-gray-300 hover:text-white transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

          <!-- Enhanced Form -->
          <form @submit.prevent="saveBoat" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="name" class="block text-white font-semibold mb-2">🚤 Boat Name</label>
                <input type="text" id="name" v-model="form.name" required placeholder="Enter boat name"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>

            <div>
                <label for="price" class="block text-white font-semibold mb-2">💰 Price</label>
                <input type="number" id="price" v-model="form.price" required placeholder="Enter rental price"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>

            <div>
                <label for="capacity" class="block text-white font-semibold mb-2">👥 Capacity</label>
                <input type="number" id="capacity" v-model="form.capacity" required placeholder="Enter passenger capacity"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>

            <div>
                <label for="status" class="block text-white font-semibold mb-2">⚙️ Status</label>
              <select id="status" v-model="form.status"
                  class="w-full bg-white  border border-/20 rounded-xl px-4 py-3 text-black font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="Available" class="font-bold"> Available</option>
                  <option value="Booked" class="font-bold">Booked</option>
                  <option value="UnderMaintenance" class="font-bold"> Under Maintenance</option>
              </select>
            </div>

            <div>
                <label class="block text-white font-semibold mb-2">🚤 Boat Type</label>
              <select v-model="form.boat_type"
                  class="w-full bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="" disabled>Select a boat type</option>
                  <option value="Speedboat" class="font-bold text-black">Speedboat</option>
                  <option value="Yacht" class="font-bold text-black"> Yacht</option>
                  <option value="Bangka" class="font-bold text-black"> Bangka</option>
                  <option value="Sailboat" class="font-bold text-black"> Sailboat</option>
                  <option value="Catamaran" class="font-bold text-black"> Catamaran</option>
              </select>
            </div>

            <div>
                <label class="block text-white font-semibold mb-2">⏰ Duration Options</label>
                <input type="text" v-model="form.duration_options" placeholder="e.g. 2hrs, 4hrs, 8hrs"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>

            <!-- Enhanced Features -->
          <div>
              <label class="block text-white font-semibold mb-2">⭐ Features</label>
              <div v-for="(feature, index) in form.features" :key="index" class="flex items-center gap-3 mb-3">
                <input type="text" v-model="form.features[index]" placeholder="e.g. Free WiFi, Life Jackets, Snorkeling Gear"
                  class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              <button type="button" @click="removeFeature(index)" v-if="form.features.length > 1"
                  class="p-3 text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
            <button type="button" @click="addFeature"
                class="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-4 py-2 rounded-xl transition-all duration-200 font-semibold">
              + Add Another Feature
            </button>
          </div>

            <!-- Enhanced Image Upload -->
          <div>
              <label class="block text-white font-semibold mb-2">📸 Upload Images (Max 10)</label>
              <div class="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                <input type="file" ref="imageInput" @change="handleImageUpload" multiple accept="image/*" class="hidden" />
                <button type="button" @click="$refs.imageInput.click()" class="text-white hover:text-orange-400 transition-colors">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-sm">Click to upload boat images</p>
                </button>
          </div>

              <!-- Enhanced Image Previews -->
              <div v-if="previewImages.length" class="grid grid-cols-4 gap-4 mt-6">
                <div v-for="(img, index) in previewImages" :key="index" class="relative group">
                  <img :src="img" class="w-full h-24 object-cover rounded-xl border border-white/20"
                :alt="`Image ${index + 1}`" @error="handleImageError" />
              <button type="button" @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <XMarkIcon class="h-4 w-4" />
              </button>
                </div>
            </div>
          </div>

            <!-- Enhanced Action Buttons -->
            <div class="flex justify-end gap-4 pt-6">
            <button type="button" @click="closeModal"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200">
              Cancel
            </button>
            <button type="submit"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                {{ isEditing ? '💾 Update Boat' : '🚤 Add Boat' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const API_BASE = "http://localhost:5000";

const searchQuery = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const boats = ref([]);

// Change features to an array of strings
const form = ref({ name: "", boat_type: "", duration_options: "", price: "", capacity: "", features: [""], status: "Available", images: [] });

const previewImages = ref([]);
const imageInput = ref(null);

const filteredBoats = computed(() =>
  boats.value.filter((b) => b.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
);

// Helper function to format features for display
const formatFeatures = (features) => {
  if (Array.isArray(features)) {
    return features.join(", ");
  }
  // Fallback for any old string data
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
    } catch (e) {
      // Do nothing, just fall through
    }
  }
  return features || "";
};

const token = localStorage.getItem("token");
const api = axios.create({ baseURL: `${API_BASE}/api/boats`, headers: { Authorization: `Bearer ${token}` } });

// --- API Calls ---
const loadMyBoats = async () => {
  try {
    const res = await api.get("/my");
    boats.value = res.data.map((b) => ({
      ...b,
      price: b.rental_price,
      // Ensure features is always an array
      features: b.features || [],
      images: b.images ? b.images.map(img => img.startsWith("http") ? img : `${API_BASE}${img}`) : [],
    }));
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.response?.data?.message || "Failed to load boats", "error");
  }
};

// --- Modal & Form ---
const openAddModal = () => { resetForm(); showModal.value = true; isEditing.value = false; };
const closeModal = () => { showModal.value = false; resetForm(); };

// Set initial features to a single empty string input
const resetForm = () => { form.value = { name: "", price: "", capacity: "", features: [""], status: "Available", images: [] }; clearImages(); };

// --- Image Handling ---
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  const newFiles = [...form.value.images, ...files].slice(0, 10);
  form.value.images = newFiles;

  previewImages.value.forEach(url => url.startsWith("blob:") && URL.revokeObjectURL(url));

  previewImages.value = newFiles.map(file =>
    file instanceof File ? URL.createObjectURL(file) : file
  );
  if (files.length > 10) { Swal.fire("Warning", "You can upload a maximum of 10 images.", "warning"); }
};

const removeImage = (index) => {
  if (previewImages.value[index]?.startsWith("blob:")) {
    URL.revokeObjectURL(previewImages.value[index]);
  }
  form.value.images.splice(index, 1);
  previewImages.value.splice(index, 1);
  if (imageInput.value) { imageInput.value.value = null; }
};

const clearImages = () => {
  previewImages.value.forEach(url => url.startsWith("blob:") && URL.revokeObjectURL(url));
  form.value.images = [];
  previewImages.value = [];
  if (imageInput.value) { imageInput.value.value = null; }
};

const handleImageError = (event) => { event.target.src = "https://placehold.co/400x200/cccccc/333333?text=Error"; };

// --- Dynamic Features Handling ---
const addFeature = () => {
  form.value.features.push("");
};

const removeFeature = (index) => {
  if (form.value.features.length > 1) {
    form.value.features.splice(index, 1);
  }
};

const saveBoat = async () => {
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("boat_type", form.value.boat_type);
    formData.append("duration_options", form.value.duration_options);
    formData.append("rental_price", form.value.price);
    formData.append("capacity", form.value.capacity);

    // Convert the array of features to a JSON string
    const cleanedFeatures = form.value.features.filter(f => f.trim() !== "");
    formData.append("features", JSON.stringify(cleanedFeatures));

    formData.append("status", form.value.status);
    form.value.images.forEach(file => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    if (isEditing.value) {
      await api.put(`/${editingId.value}`, formData);
      Swal.fire("Updated", "Boat updated successfully", "success");
    } else {
      await api.post("/", formData);
      Swal.fire("Added", "Boat created successfully", "success");
    }

    await loadMyBoats();
    closeModal();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.response?.data?.message || "Failed to save boat", "error");
  }
};

const editBoat = (boat) => {
  form.value = {
    ...boat,
    price: boat.price || boat.rental_price,
    images: [],
  };

  // Ensure features are handled as an array, even if they're coming as a string
  let featuresToDisplay = boat.features;
  if (typeof featuresToDisplay === 'string') {
    try {
      featuresToDisplay = JSON.parse(featuresToDisplay);
    } catch (e) {
      featuresToDisplay = [featuresToDisplay];
    }
  }
  form.value.features = Array.isArray(featuresToDisplay) ? featuresToDisplay : [featuresToDisplay || ""];

  editingId.value = boat.boat_id || boat.id;
  previewImages.value = [...(boat.images || [])];
  form.value.images = [...(boat.images || [])];

  showModal.value = true;
  isEditing.value = true;
};

const deleteBoat = async (id) => {
  const confirm = await Swal.fire({ title: "Are you sure?", text: "This will delete the boat permanently!", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!" });
  if (confirm.isConfirmed) {
    try { await api.delete(`/${id}`); Swal.fire("Deleted!", "Boat has been deleted.", "success"); await loadMyBoats(); }
    catch (err) { Swal.fire("Error", err.response?.data?.message || "Failed to delete boat", "error"); }
  }
};

const viewBoat = (boat) => {
  const formattedFeatures = formatFeatures(boat.features);
  const imageUrlsHtml = boat.images
    .map(
      (img) =>
        `<img src="${img}" class="mt-2 w-32 h-32 object-cover rounded-lg" onerror="this.onerror=null; this.src='https://placehold.co/100x100/cccccc/333333?text=Error';"/>`
    )
    .join("");

  Swal.fire({
    title: boat.name,
    html: `<p><strong>Price:</strong> ₱${boat.price}</p><p><strong>Capacity:</strong> ${boat.capacity} pax</p><p><strong>Features:</strong> ${formattedFeatures}</p><p><strong>Status:</strong> ${boat.status}</p><div class="flex flex-wrap gap-2 mt-2">${imageUrlsHtml}</div>`,
    width: "600px",
  });
};

onMounted(() => { AOS.init({ duration: 1000, once: true }); loadMyBoats(); });
</script>