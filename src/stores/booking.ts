import { defineStore } from "pinia";

const BASE_API_URL = "http://apitest.al-ibrabmemorialschool.com.ng/api";

interface UserSignupDetails {
  name: string;
  email: string;
  password: string;
  phone: string;
  password_confirmation: string;
}

interface UserLoginDetails {
  email: string;
  password: string;
}

export const useBookingsStore = defineStore("bookingsStore", {
  state: () => ({
    bookings: [] as any[],
    token: "" as string,
    available_slots: {} as any,
    user: {} as any,
  }),
  actions: {
    async getUser() {
      const req = await fetch(`${BASE_API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
      console.log(req);
      const res = await req.json();
      this.user = res;
      console.log(res);
    },
    async userSignup(user: UserSignupDetails) {
      try {
        const req = await fetch(`${BASE_API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const res = await req.json();

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async userLogin(user: UserLoginDetails) {
      try {
        const req = await fetch(`${BASE_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const res = await req.json();
        this.token = res.data.token;
        await this.getUser();
        localStorage.setItem("token", this.token);
        this.fetchBookings();

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async userLogout() {
      this.token = "";
      localStorage.clear();
    },
    async getAvailableSlots(calendar_day: string) {
      console.log(calendar_day);
      console.log("fetching slots");
      try {
        const req = await fetch(`${BASE_API_URL}/slot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ day: calendar_day }),
        });
        console.log(req);
        const res = await req.json();
        console.log(res);
        this.available_slots = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addBookings(booking: any) {
      console.log(booking);
      
      const formattedDate = new Date(booking.day).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      booking.day = formattedDate;
      console.log(booking);
      
      const req = await fetch(`${BASE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(booking),
      });
      console.log(req);
      const res = await req.json();
      await this.fetchBookings();
      return res;
    },
    async fetchBookings() {
      const getLocalToken = localStorage.getItem("token");
      if (getLocalToken) {
        this.token = getLocalToken;
        await this.getUser();
      }
      console.log("fetching bookings");
      try {
        const req = await fetch(`${BASE_API_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        console.log(req);
        const res = await req.json();
        console.log(res.data);
        this.bookings = res.data.filter((booking: any) => booking.agencyName === this.user.name);
        console.log(this.bookings)
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {},
});
