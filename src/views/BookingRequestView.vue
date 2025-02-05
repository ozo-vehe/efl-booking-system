<script setup lang="ts">
import { onBeforeMount, type Ref, ref, watch } from 'vue';
import { useBookingsStore } from '@/stores/booking';
import { getDateRange } from '@/utils/date';
// import { v4 } from "uuid";
import { storeToRefs } from 'pinia';
import NavbarComponent from '@/components/NavbarComponent.vue';
import { useContainerStore } from '@/stores/container';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

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

const containerStore = useContainerStore();
const { getContainer } = containerStore;
const { containers } = storeToRefs(containerStore);

const range: any = ref([]);
const displayed_date = ref('');
const disabled_days_arr: any = ref([]);
const is_loading = ref(false);
const is_container_loading = ref(false);
const is_slot_loading = ref(false);
const show_dropdown = ref(false);
const booking_details = ref({
  day: '',
  agency_name: '',
  phone: '',
  bl_number: '',
  container_number: '',
  invoice_number: '',
  command: '',
})

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const edited_date = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return edited_date === 'Invalid Date' ? 
    { is_available: false, message: 'Invalid date' } : 
    { is_available: true, message: edited_date };
};

const handleSubmitForm = async () => {
  if (!booking_details.value.command || !booking_details.value.bl_number || 
      !booking_details.value.container_number || !booking_details.value.invoice_number) {
    alert('Please fill all fields');
    return;
  }

  if (!displayed_date.value) {
    alert('Invalid date');
    return;
  }

  try {
    is_loading.value = true;
    booking_details.value.day = displayed_date.value;
    booking_details.value.agency_name = user.value.name;
    booking_details.value.phone = user.value.phone;

    const res = await addBookings({ ...booking_details.value });
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      alert('Booking request submitted successfully');
      booking_details.value = {
        command: '',
        agency_name: '',
        phone: '',
        bl_number: '',
        container_number: '',
        invoice_number: '',
        day: displayed_date.value,
      };
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error(error);
  } finally {
    is_loading.value = false;
  }
}

const handleDayClick = async (e: any) => {
  const { message } = formatDateTime(e);
  displayed_date.value = message;
  const edited_date = new Date(message).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const [month, day, year] = edited_date.split('/');
  const formatted_date = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  await getAvailableSlots(formatted_date);
}

const fetchContainers = async (e: FocusEvent) => {
  const bl_number = (e.target as HTMLInputElement)?.value;
  if (bl_number.length >= 9) {
    try {
      is_container_loading.value = true;
      await getContainer(bl_number);
    } catch (error) {
      console.error(error);
    } finally {
      is_container_loading.value = false;
    }
  }
}

onBeforeMount(async () => {
  const { range: range_days, disabled_days } = getDateRange();
  range.value = range_days;

  const formattedRangeDays = range_days.map(date => {
    const [month, day, year] = date.split('/');
    return `${year},${month},${day}`;
  });
  const formattedDisabledDays = disabled_days.map(date => {
    const [month, day, year] = date.split('/');
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  });

  disabled_days_arr.value = formattedDisabledDays;
})</script>

<template>
  <NavbarComponent />
  <main class="my-5">
    <h1 class="text-2xl mb-4 font-[600] text-center">EFL Terminal Booking System</h1>

    <div class="booking_system flex gap-8 flex-wrap justify-center mt-8">
      <div class="vue_cal h-[350px] w-[300px]">
        <vue-cal class="vuecal--date-picker" xsmall hide-view-selector :time="false" active-view="month"
          :disable-views="['week']" :disable-days="[...disabled_days_arr]" :min-date="range[0]" :max-date="range[range.length - 1]" @cell-click="handleDayClick">
        </vue-cal>
        <p class="my-2 text-left">
          <span class="font-[600]">Date picked: </span>
          <span>{{ displayed_date }}</span>
        </p>
        <p class="flex items-start gap-4 font-[600]">Slots available: <span v-if="is_slot_loading"
            class="w-4 h-4 mt-1 rounded-full border-x border-gray-700 animate-spin block"></span>
        <ul v-else class="font-[400]">
          <li class="flex items-center justify-center gap-2">Apapa {{ available_slots.apapa }}</li>
          <li class="flex items-center justify-center gap-2">Tincan {{ available_slots.tincan }}</li>
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
          <input :value="user.name" class="w-full px-2 py-2 border rounded-md" type="text" name="fullname" id="fullname"
            placeholder="Full Name" disabled>
        </div>


        <div class="phone_number flex flex-col gap-1 mb-4">
          <label for="phone_number">Phone Number</label>
          <input :value="user.phone" class="w-full border px-2 py-2 rounded-md" type="tel" name="phone_number"
            id="phone_number" placeholder="Phone Number" disabled>
        </div>


        <div class="bl_number flex flex-col gap-1 mb-4">
          <label for="bl_number">BL Number</label>
          <input v-model="booking_details.bl_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="bl_number" id="bl_number" placeholder="BL Number" @focusout="fetchContainers" required>
        </div>

        <span v-if="is_container_loading"
          class="block mx-auto mb-2 w-4 h-4 rounded-full border-x border-gray-900 animate-spin"></span>

        <div v-if="containers.length >= 1 && booking_details.bl_number.length > 8" class="container_number_dropdown flex flex-col gap-1 mb-4">
          <button type="button" class="w-fit bg-gray-200 px-2 py-1 rounded-[4px] hover:bg-gray-300 transition-all duration-300" @click="show_dropdown = !show_dropdown" >Select container(s)</button>
          <div v-if="show_dropdown" class="bg-white border w-fit px-3 border-gray-300 rounded-[4px]">
            <label class="block mb-1" v-for="(container, index) in containers" :for="container.container_number" :key="index">
              <input type="checkbox" :id="container.container_number">
              {{ container.container_number }}
            </label>
          </div>
        </div>

        <div v-if="containers.length >= 1" class="invoice_number flex flex-col gap-1 mb-4">
          <label for="invoice_number">Receipt Number</label>
          <input v-model="booking_details.invoice_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="invoice_number" id="invoice_number" placeholder="Invoice Number" required>
        </div>

        <div class="form_button">
          <button
            class="bg-blue-600 w-full py-2 h-10 rounded-md text-gray-50 hover:text-white hover:font-[500] disabled:font-[400] disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            :disabled="booking_details.invoice_number.length < 1 && !booking_details.container_number && !booking_details.command" type="submit">
            <span v-if="is_loading" class="block w-5 h-5 rounded-full animate-spin border-x border-gray-50"></span>
            <span v-else>Request for booking</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style>
.vuecal__cell--disabled {
  text-decoration: line-through;
}

.vuecal__cell--before-min {
  color: #b6d6c7;
}

.vuecal__cell--after-max {
  color: #b6d6c7;
}

.vuecal__cell:not(.vuecal__cell--disabled) .vuecal__flex {
  background-color: #0649c4;
  color: #fff;
  font-weight: 700;
}
</style>
