<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue';
import { useBookingsStore } from '@/stores/booking';
import { getDateRange } from '@/utils/booking_data';

const bookingStore = useBookingsStore();
const { addBookings } = bookingStore;

const calendar_date = ref(new Date());
const range: any = ref([]);
const displayed_date = ref(calendar_date.value.toISOString());
const is_loading: Ref<boolean> = ref(false);
const booking_details = ref({
  command: '',
  fullname: '',
  phone_number: '',
  bl_number: '',
  container_number: '',
  invoice_number: '',
  date: displayed_date.value,
})

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleSubmitForm = async () => {
  is_loading.value = true;
  if (booking_details.value.command === '' || booking_details.value.fullname === '' || booking_details.value.phone_number === '' || booking_details.value.bl_number === '' || booking_details.value.container_number === '' || booking_details.value.invoice_number === '') {
    alert('Please fill all fields');
    is_loading.value = false;
    return;
  }
  try {
    addBookings({...booking_details.value, status: 'pending', createdAt: new Date()});
    is_loading.value = false;
    alert('Booking request submitted successfully');
    booking_details.value = {
      command: '',
      fullname: '',
      phone_number: '',
      bl_number: '',
      container_number: '',
      invoice_number: '',
      date: displayed_date.value,
    };
  } catch (error) {
    console.log(error);
  }
}

watch(calendar_date, (newVal, oldVal) => {
  booking_details.value.date = newVal.toISOString();
  displayed_date.value = newVal.toISOString();
});

onMounted(() => {
  // console.log('BookingRequestView mounted');
  range.value = getDateRange();
  // console.log(range.value);
})

</script>

<template>
  <main class="my-5">
    <h1 class="text-2xl mb-4 font-[600] text-center">EFL Terminal Booking System</h1>

    <div class="booking_system flex gap-8 flex-wrap justify-center mt-8">
    <div class="calender_container text-center">
      <VDatePicker v-model="calendar_date" :min-date="range[0]" :max-date="range[6]" />
      <p class="mt-2">Date picked: {{ formatDateTime(displayed_date) }}</p>
    </div>

      <form class="w-[400px]" @submit.prevent="handleSubmitForm">
        <div class="command flex flex-col gap-1 mb-4">
          <label for="select_command">Select Command</label>
          <select v-model="booking_details.command" class="w-full px-1 py-2 border rounded-md" name="select_command"
            id="select_command">
            <option value="">Select Command</option>
            <option value="tincan">Tincan</option>
            <option value="apapa">Apapa</option>
          </select>
        </div>

        <div class="fullname w-full flex flex-col gap-1 mb-4">
          <label for="fullname">Fullname</label>
          <input v-model="booking_details.fullname" class="w-full px-2 py-2 border rounded-md" type="text"
            name="fullname" id="fullname" placeholder="Full Name" required>
        </div>


        <div class="phone_number flex flex-col gap-1 mb-4">
          <label for="phone_number">Phone Number</label>
          <input v-model="booking_details.phone_number" class="w-full border px-2 py-2 rounded-md" type="tel"
            name="phone_number" id="phone_number" placeholder="Phone Number" required>
        </div>


        <div class="bl_number flex flex-col gap-1 mb-4">
          <label for="bl_number">BL Number</label>
          <input v-model="booking_details.bl_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="bl_number" id="bl_number" placeholder="BL Number" required>
        </div>

        <div class="container_number flex flex-col gap-1 mb-4">
          <label for="container_number">Container Number</label>
          <input v-model="booking_details.container_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="container_number" id="container_number" placeholder="Container Number" required>
        </div>

        <div class="invoice_number flex flex-col gap-1 mb-4">
          <label for="invoice_number">Invoice Number</label>
          <input v-model="booking_details.invoice_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="invoice_number" id="invoice_number" placeholder="Invoice Number" required>
        </div>

        <div class="form_button">
          <button class="bg-blue-400 w-full py-2 rounded-md text-gray-50 hover:bg-blue-500 transition-all duration-300"
            type="submit">Request for booking</button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
