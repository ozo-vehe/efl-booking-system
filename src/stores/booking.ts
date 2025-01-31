import { defineStore } from "pinia";

const BASE_API_URL = "https://apitest.al-ibrabmemorialschool.com.ng/api";

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

interface PasswordReset {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
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
      const res = await req.json();
      this.user = res;
    },
    async userSignup(user: UserSignupDetails) {
      try {
        const req = await fetch(`${BASE_API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(user),
        });
        const res = await req.json();
        console.log(res);
        localStorage.setItem("email", user.email);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async userEmailVerification(token: string) {
      const email = localStorage.getItem("email");
      console.log(email);
      try {
        const req = await fetch(`${BASE_API_URL}/auth/verify-mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            email,
          }),
        });
        const res = await req.json();
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    async userResendEmailVerification() {
      const email = localStorage.getItem("email");
      try {
        const req = await fetch(`${BASE_API_URL}/auth/resend-verification-mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        const res = await req.json();
        return res;
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
            Accept: "application/json",
          },
          body: JSON.stringify(user),
        });
        const res = await req.json();
        console.log(res);
        this.token = res.data.token;
        await this.getUser();
        localStorage.setItem("token", this.token);
        this.fetchBookings();

        return { message: "Login successful", status: "success" };
      } catch (error) {
        console.log(error);
        return { message: "Incorrect login details", status: "error" };
      }
    },
    async userLogout() {
      this.token = "";
      localStorage.removeItem("token");
    },
    async getAvailableSlots(calendar_day: string) {
      try {
        const req = await fetch(`${BASE_API_URL}/slot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ day: calendar_day }),
        });
        const res = await req.json();
        this.available_slots = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addBookings(booking: any) {
      console.log(booking);

      const formattedDate = new Date(booking.day).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
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
      console.log(res);
      await this.fetchBookings();
      return res;
    },
    async fetchBookings() {
      const getLocalToken = localStorage.getItem("token");
      if (getLocalToken) {
        this.token = getLocalToken;
        await this.getUser();
      }

      try {
        const req = await fetch(`${BASE_API_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        const res = await req.json();
        console.log(res);
        this.bookings = res.data.filter(
          (booking: any) => booking.agencyName === this.user.name
        );
      } catch (error) {
        console.log(error);
      }
    },
    async userInitiatePasswordReset(email: string) {
      try {
        const req = await fetch(`${BASE_API_URL}/auth/forget/mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        const res = await req.json();
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    async userResetPassword(reset_details: PasswordReset) {
      try {
        const req = await fetch(`${BASE_API_URL}/auth/forget/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(reset_details),
        });
        const res = await req.json();
        return res;
      } catch (error) {
        console.log(error);
      }
    }
  },
  getters: {},
});
