<template>
  <q-page class="flex flex-center bg-login font-inter">
    <!-- Background overlay -->
    <div class="absolute-full" :class="$q.dark.isActive ? 'bg-gradient-overlay-dark' : 'bg-gradient-overlay-light'"></div>

    <q-card class="q-pa-lg shadow-soft animate-fade-up border-radius-lg" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white border-dark-mode' : 'glass-card text-black'" style="width: 400px; max-width: 90vw; z-index: 1;">
      <q-card-section class="text-center">
        <div class="q-mb-md">
           <div class="q-pa-md rounded-full inline-block" :class="$q.dark.isActive ? 'bg-white-10 text-white' : 'bg-indigo-1 text-indigo-7'">
             <q-icon name="admin_panel_settings" size="md" />
           </div>
        </div>
        <div class="text-h5 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">Admin Portal</div>
        <div class="text-caption q-mt-xs" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-6'">2023 BS Batch Fund Admin Access</div>
      </q-card-section>

      <q-card-section class="q-mt-sm">
        <q-input 
          outlined 
          v-model="username" 
          label="Username" 
          class="q-mb-md" 
          :color="$q.dark.isActive ? 'blue-3' : 'indigo'"
          :bg-color="$q.dark.isActive ? 'blue-grey-10' : 'white'"
          :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'"
          :input-class="$q.dark.isActive ? 'text-white' : ''"
        >
          <template v-slot:prepend>
            <q-icon name="person" :color="$q.dark.isActive ? 'grey-4' : 'grey-5'" />
          </template>
        </q-input>
        <q-input 
          outlined 
          v-model="password" 
          label="Password" 
          :type="isPwd ? 'password' : 'text'" 
          :color="$q.dark.isActive ? 'blue-3' : 'indigo'"
          :bg-color="$q.dark.isActive ? 'blue-grey-10' : 'white'"
          :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'"
          :input-class="$q.dark.isActive ? 'text-white' : ''"
          @keyup.enter="handleLogin"
        >
          <template v-slot:prepend>
            <q-icon name="lock" :color="$q.dark.isActive ? 'grey-4' : 'grey-5'" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              :color="$q.dark.isActive ? 'grey-4' : 'grey-5'"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        
        <div v-if="error" class="text-caption q-mt-md q-pa-sm rounded-borders text-center" :class="$q.dark.isActive ? 'bg-red-9 text-red-1' : 'bg-red-1 text-negative'">
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
        <q-btn flat no-caps label="Return to Home" to="/" :color="$q.dark.isActive ? 'white' : 'grey-7'" class="q-mt-sm" size="sm" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'

const username = ref('')
const password = ref('')
const isPwd = ref(true)
const error = ref('')
const router = useRouter()
const userStore = useUserStore()
const $q = useQuasar()

async function handleLogin() {
  if (await userStore.login(username.value, password.value)) {
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
.bg-gradient-overlay-light {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200, 200, 240, 0.8) 100%);
  backdrop-filter: blur(5px);
}
.bg-gradient-overlay-dark {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(5px);
}
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.border-dark-mode {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.shadow-soft {
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
}
.rounded-full {
  border-radius: 50%;
}
.inline-block { display: inline-block; }
</style>
