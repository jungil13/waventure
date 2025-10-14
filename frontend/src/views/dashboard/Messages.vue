<template>
  <div class="h-[85vh] bg-white text-gray-900 rounded-lg shadow-md border border-orange-200 overflow-hidden">
    <!-- Header -->
    <div class="p-6 bg-orange-50 border-b border-orange-200 flex justify-between items-center flex-wrap gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Boat Owner Contacts</h2>
        <p class="text-sm text-gray-600 mt-1">{{ boatOwners.length }} boat owners from your bookings</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p class="text-sm text-gray-600 mt-4">Loading boat owners...</p>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="boatOwners.length === 0" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="text-6xl mb-4">🚤</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Boat Owners Found</h3>
        <p class="text-gray-500">Make a booking first to see boat owner contacts!</p>
      </div>
    </div>
    
    <!-- Boat Owners Grid -->
    <div v-else class="p-4 overflow-y-auto h-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="owner in boatOwners"
          :key="`${owner.user_id}-${owner.booking_id}`"
          class="bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col justify-between"
        >
          <!-- Owner Header -->
          <div class="flex items-center space-x-4 mb-3">
            <div class="relative">
              <div v-if="owner.profile_pic && !owner.imageError" class="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  :src="`http://localhost:5000${owner.profile_pic}`" 
                  alt="avatar" 
                  class="w-full h-full object-cover" 
                  @error="handleImageError(owner)"
                />
              </div>
              <div v-else class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {{ getInitials(owner.full_name) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-gray-800 truncate">{{ owner.full_name }}</h3>
              <p class="text-sm text-orange-600 font-medium truncate">{{ owner.boat_name }}</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-2 text-sm text-gray-700 flex-1">
            <p v-if="owner.email"><strong>Email:</strong> {{ owner.email }}</p>
            <p v-if="owner.phone"><strong>Phone:</strong> {{ owner.phone }}</p>
            <p v-if="owner.location"><strong>Location:</strong> {{ owner.location }}</p>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex gap-2">
            <a 
              v-if="owner.email"
              :href="`mailto:${owner.email}`"
              class="flex-1 bg-orange-500 text-white text-sm py-2 rounded-lg hover:bg-orange-600 transition text-center"
            >
              Email
            </a>
            <a 
              v-if="owner.phone"
              :href="`tel:${owner.phone}`"
              class="flex-1 bg-green-500 text-white text-sm py-2 rounded-lg hover:bg-green-600 transition text-center"
            >
              Call
            </a>
            <button
              @click="deleteOwner(owner)"
              class="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 transition text-sm"
              title="Delete"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MessageService from "@/services/messageService";
import Swal from "sweetalert2";

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const getUserId = () => user.value.user_id || user.value.userId || user.value.id;

const boatOwners = ref([]);
const loading = ref(true);
let recentlyDeleted = null;

// Load boat owners (from localStorage first)
const loadBoatOwners = async () => {
  const storedOwners = JSON.parse(localStorage.getItem("boatOwners") || "[]");
  if (storedOwners.length > 0) {
    boatOwners.value = storedOwners;
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const response = await MessageService.getBoatOwners(getUserId());
    if (response.success) {
      boatOwners.value = response.data.map((o) => ({ ...o, imageError: false }));
      localStorage.setItem("boatOwners", JSON.stringify(boatOwners.value));
    }
  } catch (error) {
    console.error("Error loading boat owners:", error);
  } finally {
    loading.value = false;
  }
};

// Delete owner
const deleteOwner = async (owner) => {
  const confirm = await Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${owner.full_name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
  });

  if (confirm.isConfirmed) {
    recentlyDeleted = owner;
    boatOwners.value = boatOwners.value.filter((o) => o.user_id !== owner.user_id);
    localStorage.setItem("boatOwners", JSON.stringify(boatOwners.value));

    Swal.fire({
      title: "Deleted!",
      text: `${owner.full_name} has been removed.`,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });

    // Show Undo option
    setTimeout(() => {
      Swal.fire({
        title: "Undo delete?",
        text: "You can restore the contact.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Undo",
        cancelButtonText: "Dismiss",
        confirmButtonColor: "#f97316",
      }).then((result) => {
        if (result.isConfirmed && recentlyDeleted) {
          boatOwners.value.push(recentlyDeleted);
          localStorage.setItem("boatOwners", JSON.stringify(boatOwners.value));
          Swal.fire({
            title: "Restored!",
            text: `${recentlyDeleted.full_name} has been restored.`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          recentlyDeleted = null;
        }
      });
    }, 800);
  }
};

// Image & initials
const getInitials = (fullName) => {
  if (!fullName) return "?";
  const names = fullName.split(" ");
  return (names[0][0] + (names[1]?.[0] || "")).toUpperCase();
};
const handleImageError = (owner) => (owner.imageError = true);

onMounted(loadBoatOwners);
</script>

<style scoped>
/* Smooth scroll & responsive adjustments */
@media (max-width: 640px) {
  .h-\[85vh\] {
    height: auto;
  }
}
</style>
