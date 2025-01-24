<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <form @submit.prevent="handleLogin" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Signup</h2>

      <div class="mb-4">
        <label for="fullname" class="block mb-2 font-medium text-gray-700">Fullname</label>
        <input type="fullname" id="fullname" v-model="user_signup_details.name" required placeholder="Enter your fullname"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="mb-4">
        <label for="email" class="block mb-2 font-medium text-gray-700">Email</label>
        <input type="email" id="email" v-model="user_signup_details.email" required placeholder="Enter your email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="mb-4">
        <label for="phone" class="block mb-2 font-medium text-gray-700">Phone</label>
        <input type="tel" id="phone" v-model="user_signup_details.phone" required placeholder="Enter your phone"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
        <input type="password" id="password" v-model="user_signup_details.password" required placeholder="Enter your password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>


      <div class="mb-4">
        <label for="c_password" class="block mb-2 font-medium text-gray-700">Confirm password</label>
        <input type="password" id="c_password" v-model="user_signup_details.password_confirmation" required placeholder="Confirm password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <button type="submit"
        class="w-full h-[45px] py-3 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
        <span v-if="is_loading" class="block w-5 h-5 border-x border-gray-50 rounded-full animate-spin"></span>
        <span v-else>Signup</span>
      </button>
      <div class="mt-4 text-center">
        <p>Have an account? <RouterLink to="/" class="text-blue-500">Login</RouterLink></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useBookingsStore } from '@/stores/booking';

const bookingsStore = useBookingsStore()
const {userSignup} = bookingsStore
const is_loading = ref(false)
const router = useRouter()
const user_signup_details = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
})

const is_password_the_same = (password: string, confirm_password: string) => {
  if(password === confirm_password) {
    return true
  }
  return false
}

const handleLogin = async () => {
  console.log(user_signup_details.value);
  if(!user_signup_details.value.name || !user_signup_details.value.email || !user_signup_details.value.phone || !user_signup_details.value.password || !user_signup_details.value.password_confirmation) {
    alert('Please fill in all fields')
    return
  }

  if(!is_password_the_same(user_signup_details.value.password, user_signup_details.value.password_confirmation)) {
    alert('Password and confirm password does not match')
    return
  }

  try {
    is_loading.value = true
    await userSignup(user_signup_details.value)
    is_loading.value = false;
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
