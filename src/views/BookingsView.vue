<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue';
import { useBookingsStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'

const bookingStore = useBookingsStore();
const { bookings } = storeToRefs(bookingStore);
console.log(bookings.value);

const formatDateTime = (isoString: string | Date) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

</script>

<template>
  <NavbarComponent />
  <main class="bg-gray-100 flex my-5">
    <div class="flex-1 p-4 overflow-hidden">
      <div class="requests_container overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 rounded-[12px] bg-gray-50">
          <thead class="border">
            <tr class="h-16 bg-gray-200 rounded-[12px]">
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                S/No.
              </th>
              <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
                ID
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
            <tr v-for="(request, index) in bookings" :key="request.id" class="hover:bg-gray-100">
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ request.id }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
                {{ request.command }}
              </td>
              <td class="whitespace-nowrap truncate px-6 py-4 text-[14px] text-gray-900">
                {{ request.blNumber }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px]">
                <span class="block mb-1" v-for="(container, index) in request.containers" :key="index">{{ container.containerNumber }}</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px]">
                {{ request.invoiceNumber }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-[14px]">
                {{ formatDateTime(request.day) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[request.status === 'pending' ? 'bg-yellow-100 text-yellow-900' : 'bg-green-100 text-green-900', 'px-2 py-1 rounded-full capitalize text-xs']">
                  {{ request.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
