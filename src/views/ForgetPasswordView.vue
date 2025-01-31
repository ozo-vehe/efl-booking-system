<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <form v-if="show_password_reset" @submit.prevent="handlePasswordReset" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">

      <h2 class="text-2xl font-bold text-center">New Password</h2>
      <div class="mb-4">
        <label for="token" class="block mb-2 font-medium text-gray-700">Token</label>
        <input type="text" id="token" v-model="token" required placeholder="Enter the emailed token"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
        <input type="password" id="password" v-model="password" required placeholder="Enter your password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="mb-4">
        <label for="c_password" class="block mb-2 font-medium text-gray-700">Confirm Password</label>
        <input type="password" id="c_password" v-model="c_password" required placeholder="Confirm your password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <button type="submit"
        class="w-full h-[45px] py-3 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
        <span v-if="is_loading" class="block w-5 h-5 border-x border-gray-50 rounded-full animate-spin"></span>
        <span v-else>Reset</span>
      </button>

      <div class="mt-4 text-center">
        <RouterLink to="/" class="text-blue-500 mr-2">Login</RouterLink>
        <RouterLink to="/signup" class="text-blue-500 ml-2">Signup</RouterLink>
      </div>
    </form>

    <form v-else @submit.prevent="handleSendResetCode" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center">Password Reset</h2>

      <div class="mb-4">
        <label for="email" class="block mb-2 font-medium text-gray-700">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Enter your email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <button type="submit"
        class="w-full h-[45px] py-3 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
        <span v-if="is_loading" class="block w-5 h-5 border-x border-gray-50 rounded-full animate-spin"></span>
        <span v-else>Send Reset Code</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useBookingsStore } from '@/stores/booking';

const bookingsStore = useBookingsStore()
const { userInitiatePasswordReset, userResetPassword } = bookingsStore

const token = ref('')
const email = ref('')
const password = ref('')
const c_password = ref('')
const show_password_reset = ref(false)
const is_loading = ref(false)

const router = useRouter()

const handleSendResetCode = async () => {
  if (email.value === '') {
    alert('Please fill in all fields')
    return
  }
  localStorage.setItem('email', email.value);

  try {
    is_loading.value = true
    const res = await userInitiatePasswordReset(email.value)
    console.log(res);
    if (res.statusCode >= 200 && res.statusCode <= 300) {
      alert(res.message)
      is_loading.value = false;
      show_password_reset.value = true;
      return;
    } else {
      console.log(res.message);
      alert(res.message)
      is_loading.value = false;
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handlePasswordReset = async () => {
  const email = localStorage.getItem('email');
  if (token.value === '' || password.value === '' || c_password.value === '') {
    alert('Please fill in all fields')
    return
  }

  if (password.value !== c_password.value) {
    alert('Passwords do not match')
    return
  }

  const reset_details = {
    email: email as string,
    token: token.value,
    password: password.value,
    password_confirmation: c_password.value
  }

  try {
    is_loading.value = true
    const res = await userResetPassword(reset_details);
    console.log(res);
    if (res.statusCode >= 200 && res.statusCode <= 300) {
      alert(res.message)
      is_loading.value = false;
      router.push('/')
      return;
    } else {
      console.log(res.message);
      alert(res.message)
      is_loading.value = false;
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
