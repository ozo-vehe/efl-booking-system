<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <form @submit.prevent="handleLogin" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <div class="mb-4">
        <label for="email" class="block mb-2 font-medium text-gray-700">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Enter your email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
        <input type="password" id="password" v-model="password" required placeholder="Enter your password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <button type="submit"
        class="w-full h-[45px] py-3 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
        <span v-if="is_loading" class="block w-5 h-5 border-x border-gray-50 rounded-full animate-spin"></span>
        <span v-else>Login</span>
      </button>

      <div class="mt-4 text-center">
        <p>Don't have an account? <RouterLink @click="handleClick" to="signup" class="text-blue-500">Signup</RouterLink></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useBookingsStore } from '@/stores/booking';

const handleClick = () => {
  console.log('clicked')
}

const bookingsStore = useBookingsStore()
const {userLogin} = bookingsStore

const email = ref('')
const password = ref('')
const is_loading = ref(false)

const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please fill in all fields')
    return
  }

  try {
    is_loading.value = true
    console.log('Login attempt with:', {
      email: email.value,
      password: password.value
    })
    const res = await userLogin({email: email.value, password: password.value})
    console.log(res);
    if(res.status == "error") {
      alert(res.message)
      is_loading.value = false
      return;
    }
    is_loading.value = false
    router.push('/booking-request')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
