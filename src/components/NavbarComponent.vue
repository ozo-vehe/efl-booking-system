<template>
  <nav class="flex justify-center gap-8 items-center py-8 border-b border-gray-100">
    <RouterLink to="/booking-request" activeClass="bg-blue-400 text-gray-50"
      class="border border-blue-400 px-3 py-1 rounded-md min-w-[150px] text-center text-blue-600 transition-all duration-300">
      Booking system
    </RouterLink>
    <RouterLink to="/bookings" activeClass="bg-blue-400 text-gray-50"
      class="border border-blue-400 px-3 py-1 rounded-md min-w-[150px] text-center text-blue-600 transition-all duration-300">
      All bookings
    </RouterLink>
    <button @click="handleLogout" class="border border-blue-400 px-3 py-1 rounded-md text-center text-blue-600 transition-all duration-300">
      Log out
    </button>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useBookingsStore } from '@/stores/booking';

const bookingStore = useBookingsStore();
const { userLogout } = bookingStore;

const handleLogout = async() => {
  await userLogout();
  localStorage.removeItem('user');
  window.location.href = '/';
};
</script>

<style scoped></style>