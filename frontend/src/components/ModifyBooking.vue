<template>
  <div class="p-6 min-h-screen bg-white rounded-2xl shadow-lg">
    <h1 class="text-2xl font-bold text-orange-600 mb-4">Modify Booking #{{ booking.booking_id }}</h1>

    <form @submit.prevent="updateBooking" class="space-y-4">
      <label class="block">
        <span class="font-semibold">Date</span>
        <input type="date" v-model="booking.booking_date" class="border rounded-lg p-2 w-full" required />
      </label>

      <label class="block">
        <span class="font-semibold">Time</span>
        <input type="time" v-model="booking.booking_time" class="border rounded-lg p-2 w-full" required />
      </label>

      <label class="block">
        <span class="font-semibold">Meet-up Location</span>
        <input type="text" v-model="booking.meet_up_location" class="border rounded-lg p-2 w-full" required />
      </label>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Update Booking
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const bookingId = route.params.id;
const booking = ref({});

const fetchBooking = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
    booking.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const updateBooking = async () => {
  try {
    await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, booking.value);
    alert("Booking updated successfully!");
    router.push("/user/bookings");
  } catch (err) {
    console.error(err);
    alert("Failed to update booking.");
  }
};

onMounted(fetchBooking);
</script>
