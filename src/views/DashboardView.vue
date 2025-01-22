<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBookingsStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'


const activeTab = ref('all')
const activeFilter = ref('24h')

const bookingStore = useBookingsStore();
const { approveBooking } = bookingStore;
const { bookings } = storeToRefs(bookingStore);

const displayedRequests = ref<any[]>(bookings.value)

watch(bookings, (newBookings: any) => {
  displayedRequests.value = newBookings
})

const tabs = [
  { id: "all", label: 'All Requests' },
  { id: 'pending', label: 'Pending Requests' },
  { id: 'approved', label: 'Approved Requests' },
]

const filters = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
]

const setActiveFilter = (filter: any) => {
  activeFilter.value = filter
}

const setActiveTab = (tab: any) => {
  console.log(tab)
  activeTab.value = tab.id
  if (tab.id === 'all') {
    displayedRequests.value = bookings.value
    console.log(displayedRequests.value)
  } else if (tab.id === 'pending') {
    displayedRequests.value = bookings.value.filter((request: any) => request.status === 'pending')
    console.log(displayedRequests.value)
  } else if (tab.id === 'approved') {
    displayedRequests.value = bookings.value.filter((request: any) => request.status === 'approved')
    console.log(displayedRequests.value)
  }
}

const formatDateTime = (isoString: string | Date) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// const filterByDate = (requests: any) => {
//   const now = new Date()
//   return requests.filter((request: any) => {
//     const requestDate: any = new Date(request.createdAt)
//     const diffTime = Math.abs((now as any) - requestDate)
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     switch (activeFilter.value) {
//       case '24h':
//         return diffDays <= 1
//       case '1w':
//         return diffDays <= 7
//       case '1m':
//         return diffDays <= 30
//       default:
//         return true
//     }
//   })
// }

</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <div class="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
      <nav class="flex-1 p-4 space-y-2">
        <RouterLink to="#"
          class="block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300">
          Bookings</RouterLink>
      </nav>
    </div>

    <!-- Mobile Sidebar -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
      <nav class="flex justify-around p-4">
        <RouterLink to="#" class="text-gray-700 hover:text-blue-600">
          <span class="block text-center text-xs">Bookings</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-4 overflow-hidden">
      <!-- Filter Section -->
      <div class="mb-6 flex flex-wrap gap-3 border border-gray-400 max-w-[250px] pr-2 py-2 rounded-md">
        <select name="filter" id="filter" class="w-full pl-2 bg-gray-100 text-gray-800 outline-none">
          <option value="">Select filter</option>
          <option @change="setActiveFilter(filter.value)" v-for="filter in filters" :key="filter.value" value="">{{
            filter.label }}</option>
        </select>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex flex-wrap gap-4">
          <button v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab)" :class="[
            'py-2 px-1 -mb-px',
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          ]">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="requests_container min-h-[65vh] overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 rounded-[12px] bg-gray-50">
          <thead class="border">
            <tr class="h-16 bg-gray-200 rounded-[12px]">
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                S/No.
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Fullname
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Phone No
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Command
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                BL No
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Container No
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Invoice No
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                Status
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-gray-50 border">
            <tr v-for="(request, index) in displayedRequests" :key="request.id" class="hover:bg-gray-100">
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ request.fullname }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ request.phone_number }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ request.command }}
              </td>
              <td class="whitespace-nowrap truncate px-6 py-4 text-[14px] text-gray-900">
                {{ request.bl_number }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px]">
                {{ request.container_number }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px]">
                {{ request.invoice_number }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px]">
                {{ formatDateTime(request.date) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[request.status === 'pending' ? 'bg-yellow-100 text-yellow-900' : 'bg-green-100 text-green-900', 'px-2 py-1 rounded-full capitalize text-xs']">
                  {{ request.status }}
                </span>
              </td>
              <td v-if="request.status === 'pending'" class="whitespace-nowrap px-6 py-4">
                <button
                  @click="approveBooking(request.id)"
                  class='bg-green-100 text-green-900 px-2 py-1 rounded-full capitalize text-xs'>
                  approve
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
