<script setup lang="ts">
import { onBeforeMount, type Ref, ref, watch } from 'vue';
import { useBookingsStore } from '@/stores/booking';
import { getDateRange } from '@/utils/booking_data';
// import { v4 } from "uuid";
import { storeToRefs } from 'pinia';
import NavbarComponent from '@/components/NavbarComponent.vue';

interface Booking {
  day: string,
  agency_name: string,
  phone: string,
  bl_number: string,
  container_number: string,
  invoice_number: string,
  command: string
}


const bookingStore = useBookingsStore();
const { addBookings, getAvailableSlots } = bookingStore;
const { available_slots, user } = storeToRefs(bookingStore);

const calendar_date = ref(new Date());
const range: any = ref([]);
const displayed_date = ref(calendar_date.value.toISOString());
const is_loading: Ref<boolean> = ref(false);
const is_slot_loading: Ref<boolean> = ref(false);
const booking_details: Ref<Booking> = ref({
  day: '',
  agency_name: user.value.name,
  phone: user.value.phone,
  bl_number: '',
  container_number: '',
  invoice_number: '',
  command: '',
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
  if (booking_details.value.command === '' || booking_details.value.agency_name === '' || booking_details.value.phone === '' || booking_details.value.bl_number === '' || booking_details.value.container_number === '' || booking_details.value.invoice_number === '') {
    alert('Please fill all fields');
    is_loading.value = false;
    return;
  }
  try {
    booking_details.value.day = displayed_date.value;
    const res = await addBookings({ ...booking_details.value });
    if(res.statusCode >= 200 && res.statusCode < 300) {
      is_loading.value = false;
    alert('Booking request submitted successfully');
    booking_details.value = {
      command: '',
      agency_name: user.value.name,
      phone: user.value.phone,
      bl_number: '',
      container_number: '',
      invoice_number: '',
      day: displayed_date.value,
    };
    } else {
      is_loading.value = false;
      new Error(res.message);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

const attributes = ref([
  {
    highlight: true,
    dates: new Date(range.value[0])
  }
])

watch(calendar_date, async (newVal, oldVal) => {
  if (newVal == oldVal) return;
  booking_details.value.day = newVal.toISOString();
  displayed_date.value = newVal.toISOString();
  is_slot_loading.value = true;
  const date = new Date(displayed_date.value);
  const available_day: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  await getAvailableSlots(available_day);
  is_slot_loading.value = false;
  console.log(available_day);
});


onBeforeMount(async () => {
  range.value = getDateRange();
  await getAvailableSlots(range.value[0]);
  calendar_date.value = range.value[0];
})
</script>

<template>
  <NavbarComponent />
  <main class="my-5">
    <h1 class="text-2xl mb-4 font-[600] text-center">EFL Terminal Booking System</h1>

    <div class="booking_system flex gap-8 flex-wrap justify-center mt-8">
      <div class="calender_container text-center">
        <VDatePicker v-model="calendar_date" :min-date="range[0]" :max-date="range[6]" />
        <p class="my-2 text-left"><span class="font-[600]">Date picked:</span> {{ formatDateTime(displayed_date) }}</p>
        <p class="flex items-start gap-4 font-[600]">Slots available: <span v-if="is_slot_loading"
            class="w-4 h-4 mt-1 rounded-full border-x border-gray-700 animate-spin block"></span>
        <ul v-else class="font-[400]">
          <li>Apapa {{ available_slots.apapa }}</li>
          <li>Tincan {{ available_slots.apapa }}</li>
        </ul>
        </p>
      </div>

      <form class="w-[400px]" @submit.prevent="handleSubmitForm">
        <div class="command flex flex-col gap-1 mb-4">
          <label for="select_command">Select Command</label>
          <select v-model="booking_details.command" class="w-full px-1 py-2 border rounded-md" name="select_command"
            id="select_command" required>
            <option value="">Select Command</option>
            <option value="tincan">Tincan</option>
            <option value="apapa">Apapa</option>
          </select>
        </div>

        <div class="fullname w-full flex flex-col gap-1 mb-4">
          <label for="fullname">Name</label>
          <input v-model="user.name" class="w-full px-2 py-2 border rounded-md" type="text"
            name="fullname" id="fullname" placeholder="Full Name" required>
        </div>


        <div class="phone_number flex flex-col gap-1 mb-4">
          <label for="phone_number">Phone Number</label>
          <input v-model="user.phone" class="w-full border px-2 py-2 rounded-md" type="tel"
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
          <button
            class="bg-blue-400 w-full py-2 h-10 rounded-md text-gray-50 hover:bg-blue-500 transition-all duration-300 flex items-center justify-center"
            type="submit">
            <span v-if="is_loading" class="block w-5 h-5 rounded-full animate-spin border-x border-gray-50"></span>
            <span v-else>Request for booking</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
