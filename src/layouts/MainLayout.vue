<template>
  <q-layout view="lHh Lpr lFf" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-grey-1 text-black'">
    <q-header :class="$q.dark.isActive ? 'glass-header-dark text-white' : 'glass-header text-grey-9'" class="q-py-xs" height-hint="64">
      <q-toolbar>
        <q-btn flat no-caps no-wrap dense to="/" class="q-mr-xs logo-btn">
          <q-avatar :size="$q.screen.xs ? '38px' : '48px'" class="q-mr-sm q-mr-md-md">
            <img src="~assets/images.png" alt="Logo" />
          </q-avatar>
          <q-toolbar-title class="font-inter brand-text text-left">
            <div :class="$q.screen.xs ? 'text-subtitle2' : 'text-subtitle1'" class="text-weight-bolder" style="line-height:1.1;">Financial Transparency <span class="text-weight-regular">Portal</span></div>
            <div class="text-weight-medium opacity-70" :style="$q.screen.xs ? 'font-size: 0.65rem; margin-top: 0px;' : 'font-size: 0.75rem; margin-top:-2px;'">FBS 2023 Batch | University of Vavuniya</div>
          </q-toolbar-title>
        </q-btn> 

        <q-space />

        <!-- Desktop Menu -->
        <div class="q-gutter-sm row items-center gt-xs">
          <q-btn 
            flat 
            no-caps 
            rounded
            class="nav-btn text-weight-medium"
            to="/" 
            label="Home"
          />
          <q-btn 
            flat 
            no-caps 
            rounded 
            class="nav-btn text-weight-medium"
            to="/history" 
            label="History"
          />
          
          <!-- Theme Toggle -->
          <q-btn 
            flat 
            round 
            dense 
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" 
            class="q-mx-sm nav-btn"
            @click="toggleTheme"
          >
             <q-tooltip>{{ $q.dark.isActive ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</q-tooltip>
          </q-btn>

          <div class="q-mx-sm h-20" :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" style="width: 1px;"></div>
          <q-btn 
            unelevated
            rounded
            no-caps 
            :class="$q.dark.isActive ? 'bg-white text-dark' : 'bg-black text-white'"
            class="btn-hover-effect"
            label="Admin Login" 
            to="/login" 
          />
        </div>

        <!-- Mobile Menu Button -->
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="lt-sm" />
      </q-toolbar>
    </q-header>


    <!-- Mobile Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      overlay
      side="right"
      behavior="mobile"
      :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : 'bg-white text-dark'"
    >
      <div class="column full-height">
        <div class="q-pa-md row items-center justify-between">
           <div class="text-h6 text-weight-bold">Menu</div>
           <q-btn flat round dense icon="close" @click="toggleLeftDrawer" />
        </div>
        
        <q-separator :color="$q.dark.isActive ? 'grey-8' : 'grey-3'" />

        <q-list padding :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-9'" class="q-mt-md">
          <q-item clickable v-ripple to="/" class="rounded-borders q-mx-md q-mb-sm custom-active-item">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Home</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/payment-details" class="rounded-borders q-mx-md q-mb-sm custom-active-item">
            <q-item-section avatar>
              <q-icon name="payments" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Payment Details</q-item-label>
            </q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/history" class="rounded-borders q-mx-md q-mb-sm custom-active-item">
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Fund History</q-item-label>
            </q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/documents" class="rounded-borders q-mx-md q-mb-sm custom-active-item">
            <q-item-section avatar>
              <q-icon name="folder" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Documents</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator :color="$q.dark.isActive ? 'grey-8' : 'grey-3'" class="q-mx-md q-my-sm" />

          <!-- Mobile Theme Toggle -->
          <q-item clickable v-ripple @click="toggleTheme" class="rounded-borders q-mx-md q-mb-sm">
            <q-item-section avatar>
              <q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ $q.dark.isActive ? 'Light Mode' : 'Dark Mode' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-space />
        
        <div class="q-pa-md">
          <q-btn 
            unelevated 
            class="full-width q-py-sm rounded-borders" 
            :class="$q.dark.isActive ? 'bg-white text-dark' : 'bg-black text-white'"
            label="Admin Login" 
            to="/login" 
            icon="admin_panel_settings"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer 
       :class="$q.dark.isActive ? 'bg-blue-grey-10 text-grey-6 border-top-dark' : 'bg-grey-1 text-grey-7 border-top-light'" 
       class="q-py-sm"
    >
      <div class="container q-mx-auto row items-center justify-between q-px-lg">
        <div class="text-caption opacity-70">
          © 2026 FBS 2023 Batch | University of Vavuniya
        </div>
        <div>
          <q-btn 
            flat 
            no-caps 
            dense 
            label="Batch Fund Agreement & Policy" 
            size="sm" 
            class="policy-link"
            to="/agreement"
          />
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const leftDrawerOpen = ref(false)
const $q = useQuasar()

// Set default dark mode (optional, let's default to dark as requested 'fullsite ekama e theme ekata')
// But better to check storage or default to dark.
if ($q.dark.isActive === false) {
  $q.dark.set(true)
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleTheme() {
  $q.dark.toggle()
}
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}

/* Glass Header Dark */
.glass-header-dark {
  background: rgba(15, 23, 42, 0.85); /* Slate 900 with opacity */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.brand-text {
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

@media (max-width: 600px) {
  .brand-text {
    font-size: 1.1rem !important;
  }
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
}

.nav-btn {
  color: #94a3b8; /* Slate-400 */
  transition: all 0.2s ease;
}

.nav-btn:hover {
  color: inherit;
  opacity: 0.8;
  background: rgba(128, 128, 128, 0.1);
}

.nav-btn.q-router-link-active {
  color: #818cf8; /* Indigo-400 */
  background: rgba(99, 102, 241, 0.15);
  font-weight: 600;
}
/* Light mode specific override for active state contrast if needed */
.body--light .nav-btn.q-router-link-active {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.08);
}

.btn-hover-effect {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-hover-effect:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.h-20 { height: 20px; }

/* Mobile Menu Styles */
.custom-active-item {
  transition: all 0.2s;
}

.custom-active-item.q-router-link-active {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  font-weight: 600;
}

.border-top-dark {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.border-top-light {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.policy-link {
  transition: all 0.2s ease;
  opacity: 0.8;
}

.policy-link:hover {
  opacity: 1;
  color: #818cf8;
  text-decoration: underline;
}

.container {
  max-width: 1400px;
}
</style>
