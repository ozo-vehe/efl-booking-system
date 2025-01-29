<script setup lang="ts">
import { onBeforeMount, type Ref, ref, watch } from 'vue';
import { useBookingsStore } from '@/stores/booking';
import { getDateRange } from '@/utils/date';
// import { v4 } from "uuid";
import { storeToRefs } from 'pinia';
import NavbarComponent from '@/components/NavbarComponent.vue';
import { useContainerStore } from '@/stores/container';

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
const calendar_displayed_dates: Ref<Date[]> = ref([]);
const displayed_date: Ref<string> = ref('');
const available_days: Ref<string[]> = ref([]);
const is_loading: Ref<boolean> = ref(false);
const is_container_loading: Ref<boolean> = ref(false);
const is_slot_loading: Ref<boolean> = ref(false);
const booking_details: Ref<Booking> = ref({
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
  if (edited_date === 'Invalid Date') return { is_available: false, message: 'Invalid date' };
  return { is_available: true, message: edited_date };
};

const handleSubmitForm = async () => {
  console.log(booking_details.value)
  is_loading.value = true;
  if (booking_details.value.command === '' || booking_details.value.bl_number === '' || booking_details.value.container_number === '' || booking_details.value.invoice_number === '') {
    alert('Please fill all fields');
    is_loading.value = false;
    return;
  }

  try {
    console.log(displayed_date.value)
    if(displayed_date.value === '') {
      alert('Invalid date');
      is_loading.value = false;
      return;
    }
    booking_details.value.day = displayed_date.value;
    booking_details.value.agency_name = user.value.name;
    booking_details.value.phone = user.value.phone;
    console.log(booking_details.value);
    const res = await addBookings({ ...booking_details.value });
    if (res.statusCode >= 200 && res.statusCode < 300) {
      is_loading.value = false;
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
      is_loading.value = false;
      new Error(res.message);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}


const handleDayClick = async(e: any) => {
  const month = e.month;
  const day = e.day;
  const year = e.year;

  const is_valid_day = range.value.includes(`${month}/${day}/${year}`);
  console.log(is_valid_day);
  is_slot_loading.value = true;
  if (is_valid_day) {
    displayed_date.value = `${month}/${day}/${year}`;
    console.log(range.value[0])
    await getAvailableSlots(`${month}/${day}/${year}`);

    is_slot_loading.value = false;
    return;
  } else {
    displayed_date.value = 'Cannot book on this day';
    console.log('Cannot book on this day');
    is_slot_loading.value = false;
  }

  // await getAvailableSlots(range.value[0]);

  console.log(`${month}/${day}/${year}`);
  console.log(range.value);
}

const fetchContainers = async (e: FocusEvent) => {
  const bl_number: string = (e.target as HTMLInputElement)?.value;
  if (bl_number.length >= 9) {
    try {
      is_container_loading.value = true;
      console.log("Fetching containers");
      await getContainer(bl_number);
      is_container_loading.value = false;
    } catch (error) {
      console.log(error);
    }
  }
}

const disabledDates = ref([
  {
    highlight: "red",
    repeat: {
      weekdays: [7, 1],
    },
  },
]);

const attributes: Ref<{ highlight: string, dates: Date[] }[]> = ref([
  {
    highlight: "blue",
    dates: [],
  }
])

onBeforeMount(async () => {
  const { range: range_days, } = getDateRange();
  range.value = range_days;
  const formattedRangeDays = range_days.map(date => {
    const [month, day, year] = date.split('/');
    return `${year},${month},${day}`;
  });
  available_days.value = formattedRangeDays;
  available_days.value.forEach(async (date) => {
    const new_date = new Date(date);
    calendar_displayed_dates.value.push(new_date)
  })
  attributes.value[0].dates = [...calendar_displayed_dates.value];
  // await getContainer("COSU6366375870");
})
</script>

<template>
  <NavbarComponent />
  <main class="my-5">
    <h1 class="text-2xl mb-4 font-[600] text-center">EFL Terminal Booking System</h1>

    <div class="booking_system flex gap-8 flex-wrap justify-center mt-8">
      <div class="calender_container text-center">
        <VDatePicker @dayclick="handleDayClick" :min-date="available_days[0]"
          :max-date="available_days[available_days.length - 1]" :disabled-dates="disabledDates" :attributes="attributes" />
        <p class="my-2 text-left">
          <span class="font-[600]">Date picked: </span>
          <span v-if="formatDateTime(displayed_date).is_available">{{ formatDateTime(displayed_date).message }}</span>
          <span v-else class="text-sm text-red-600 font-[500]">{{ displayed_date }}</span>
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

        <span v-if="is_container_loading" class="block mx-auto w-4 h-4 rounded-full border-x border-gray-900 animate-spin"></span>

        <div v-if="containers.length >= 1" class="container_number flex flex-col gap-1 mb-4">
          <label for="container_numbers">Container Number</label>
          <!-- <input v-model="booking_details.container_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="container_number" id="container_number" placeholder="Container Number" required> -->
          <select name="container_numbers" id="container_numbers" class="w-full border px-2 h-[45px] rounded-md" v-model="booking_details.container_number" required>
            <option value="">Pick your container number</option>
            <option v-for="container in containers" :key="container.id" :value="container.container_number">{{ container.container_number }}</option>
          </select>
        </div>

        <div class="invoice_number flex flex-col gap-1 mb-4">
          <label for="invoice_number">Receipt Number</label>
          <input v-model="booking_details.invoice_number" class="w-full border px-2 py-2 rounded-md" type="text"
            name="invoice_number" id="invoice_number" placeholder="Invoice Number" required>
        </div>

        <div class="form_button">
          <button
            class="bg-blue-500 w-full py-2 h-10 rounded-md text-gray-50 hover:text-white hover:font-[500] disabled:font-[400] disabled:border-2 disabled:border-red-500 transition-all duration-300 flex items-center justify-center" :disabled="containers.length < 1 || is_loading"
            type="submit">
            <span v-if="is_loading" class="block w-5 h-5 rounded-full animate-spin border-x border-gray-50"></span>
            <span v-else>Request for booking</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
