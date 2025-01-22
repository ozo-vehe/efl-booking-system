<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useBookingsStore } from './stores/booking';

const bookingStore = useBookingsStore();
const { fetchBookings } = bookingStore;

onMounted(() => {
  fetchBookings();
})
</script>

<template>
    <nav class="flex items-center justify-center gap-4 py-5 capitalize">
      <RouterLink activeClass="text-blue-800 bg-blue-100 px-3 py-1 rounded-lg" class="text-gray-800 bg-white px-3 py-1 rounded-lg" to="/">Home</RouterLink>
      <RouterLink activeClass="text-blue-800 bg-blue-100 px-3 py-1 rounded-lg" class="text-gray-800 bg-white px-3 py-1 rounded-lg" to="/booking">Booking system</RouterLink>
      <RouterLink activeClass="text-blue-800 bg-blue-100 px-3 py-1 rounded-lg" class="text-gray-800 bg-white px-3 py-1 rounded-lg" to="/dashboard">Dashboard</RouterLink>
    </nav>

  <RouterView />
</template>

<style scoped>
</style>
