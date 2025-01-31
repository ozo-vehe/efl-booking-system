<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <form @submit.prevent="handleEmailVerification" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center">Email Verification</h2>
      <p class="mb-6 text-center">Enter the verification token below</p>
      <div class="mb-4">
        <label for="token" class="block mb-2 font-medium text-gray-700">Token</label>
        <input type="text" id="token" v-model="token" required placeholder="Enter the emailed token"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <button type="submit"
        class="w-full h-[45px] py-3 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
        <span v-if="is_loading" class="block w-5 h-5 border-x border-gray-50 rounded-full animate-spin"></span>
        <span v-else>Verify</span>
      </button>

      <div class="mt-4 text-center">
        <RouterLink to="/" class="text-blue-500 mr-2">Login</RouterLink>
        <RouterLink to="/signup" class="text-blue-500 ml-2">Signup</RouterLink>
        <button aria-label="resend code button" @click="resendVerificationCode" class="text-blue-500 ml-2">Resend code</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useBookingsStore } from '@/stores/booking';

const bookingsStore = useBookingsStore()
const {userEmailVerification, userResendEmailVerification} = bookingsStore

const token = ref('')
const is_loading = ref(false)

const router = useRouter()

const handleEmailVerification = async () => {
  if (!token.value) {
    alert('Please fill in all fields')
    return
  }

  try {
    is_loading.value = true
    const res = await userEmailVerification(token.value)
    console.log(res);
    if(res.statusCode >= 200 && res.statusCode <= 300) {
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

const resendVerificationCode = async () => {
  try {
    is_loading.value = true
    const res = await userResendEmailVerification()
    console.log(res);
    if(res.statusCode >= 200 && res.statusCode <= 300) {
      alert(res.message)
      is_loading.value = false;
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
