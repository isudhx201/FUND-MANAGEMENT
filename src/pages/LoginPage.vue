<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2" style="width: 400px; max-width: 90vw;">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold">Admin Login</div>
        <div class="text-subtitle2 text-grey-7">Batch Fund Management</div>
      </q-card-section>

      <q-card-section>
        <q-input 
          filled 
          v-model="username" 
          label="Username" 
          class="q-mb-md" 
          color="black"
        />
        <q-input 
          filled 
          v-model="password" 
          label="Password" 
          type="password" 
          color="black"
          @keyup.enter="handleLogin"
        />
        <div v-if="error" class="text-negative text-caption q-mt-sm">{{ error }}</div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn 
          label="Login" 
          color="black" 
          class="full-width" 
          size="lg" 
          no-caps
          @click="handleLogin" 
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  if (userStore.login(username.value, password.value)) {
    router.push('/admin/dashboard')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>
