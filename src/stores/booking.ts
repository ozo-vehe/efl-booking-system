import { defineStore } from 'pinia'

export const useBookingsStore = defineStore('bookingsStore', {
  state: () => ({
    bookings: [] as any[],
  }),
  actions: {
    addBookings(booking: any) {
      console.log(booking)
      this.bookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      console.log(this.bookings)
    },
    fetchBookings() {
      const bookings = localStorage.getItem('bookings');
      if (bookings) {
        this.bookings = JSON.parse(bookings);
      }
    },
    approveBooking(bookingId: string) {
      const bookingIndex = this.bookings.findIndex((booking) => booking.id === bookingId);
      this.bookings[bookingIndex].status = 'approved';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
    }
  },
  getters: {}
})
