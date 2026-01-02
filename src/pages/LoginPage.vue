<template>
  <q-page class="flex flex-center bg-login font-inter">
    <!-- Background overlay -->
    <div class="absolute-full bg-gradient-overlay"></div>

    <q-card class="glass-card q-pa-lg shadow-soft animate-fade-up" style="width: 400px; max-width: 90vw; z-index: 1;">
      <q-card-section class="text-center">
        <div class="q-mb-md">
           <div class="bg-indigo-1 text-indigo-7 q-pa-md rounded-full inline-block">
             <q-icon name="admin_panel_settings" size="md" />
           </div>
        </div>
        <div class="text-h5 text-weight-bold text-gray-900">Admin Portal</div>
        <div class="text-caption text-grey-6 q-mt-xs">2023 BS Batch Fund Admin Access</div>
      </q-card-section>

      <q-card-section class="q-mt-sm">
        <q-input 
          outlined 
          v-model="username" 
          label="Username" 
          class="q-mb-md" 
          color="indigo"
          bg-color="white"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="grey-5" />
          </template>
        </q-input>
        <q-input 
          outlined 
          v-model="password" 
          label="Password" 
          type="password" 
          color="indigo"
          bg-color="white"
          @keyup.enter="handleLogin"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-5" />
          </template>
        </q-input>
        
        <div v-if="error" class="bg-red-1 text-negative text-caption q-mt-md q-pa-sm rounded-borders text-center">
           <q-icon name="error" /> {{ error }}
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-md">
        <q-btn 
          color="primary" 
          class="full-width shadow-lg" 
          size="lg" 
          unelevated
          no-caps
          @click="handleLogin" 
        >
          <div class="row items-center">
             <span>Login</span>
             <q-icon name="arrow_forward" size="xs" class="q-ml-sm" />
          </div>
        </q-btn>
        <q-btn flat no-caps label="Return to Home" to="/" color="grey-7" class="q-mt-sm" size="sm" />
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

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}
.bg-login {
  background: url('~assets/hero-bg.png') no-repeat center center;
  background-size: cover;
}
.bg-gradient-overlay {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200, 200, 240, 0.8) 100%);
  backdrop-filter: blur(5px);
}
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 20px;
}
.shadow-soft {
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
}
.rounded-full {
  border-radius: 50%;
}
.inline-block { display: inline-block; }
</style>
