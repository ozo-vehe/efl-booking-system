import { createRouter, createWebHistory } from 'vue-router'
import BookingsView from '@/views/BookingsView.vue'
import BookingRequestView from '@/views/BookingRequestView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import EmailVerificationView from '@/views/EmailVerificationView.vue'
import ForgetPasswordView from '@/views/ForgetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: EmailVerificationView,
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: ForgetPasswordView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/booking-request',
      name: 'booking-request',
      component: BookingRequestView,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: BookingsView,
    },
  ],
})

export default router
