<script setup lang="ts">
import { inject } from "@vercel/analytics"
import { RouterView } from "vue-router";
import { onMounted } from 'vue';
import { useBookingsStore } from '@/stores/booking';


const bookingStore = useBookingsStore();
const { fetchBookings } = bookingStore;

onMounted(async () => {
  await fetchBookings();
  inject()
})
</script>

<template>
  <main class="bookings_container max-w-[1440px] mx-auto lg:px-10 md:px-5 px-4">
    <RouterView />
  </main>
</template>
