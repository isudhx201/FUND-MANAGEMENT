<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header class="glass-header text-grey-9 q-py-xs" height-hint="64">
      <q-toolbar>
        <q-btn flat no-caps no-wrap dense to="/" class="q-mr-sm logo-btn">
          <q-avatar size="32px" class="q-mr-sm">
            <img src="~assets/images.png" alt="Logo" />
          </q-avatar>
          <q-toolbar-title class="text-weight-bold text-h6 font-inter brand-text">
            2023 BS Batch Fund
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
            to="/payment-details" 
            label="Payment Details"
          />
          <q-btn 
            flat 
            no-caps 
            rounded 
            class="nav-btn text-weight-medium"
            to="/history" 
            label="History"
          />
          <div class="q-mx-sm h-20 bg-grey-3" style="width: 1px;"></div>
          <q-btn 
            unelevated
            rounded
            no-caps 
            class="bg-black text-white btn-hover-effect"
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
      class="bg-white"
    >
      <div class="column full-height">
        <div class="q-pa-md row items-center justify-between">
           <div class="text-h6 text-weight-bold">Menu</div>
           <q-btn flat round dense icon="close" @click="toggleLeftDrawer" />
        </div>
        
        <q-separator />

        <q-list padding class="text-grey-9 q-mt-md">
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
        </q-list>

        <q-space />
        
        <div class="q-pa-md">
          <q-btn 
            unelevated 
            class="full-width bg-black text-white q-py-sm rounded-borders" 
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
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)


function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}

/* Glass Header */
.glass-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.brand-text {
  background: linear-gradient(135deg, #111827 0%, #4b5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
}

.nav-btn {
  color: #4b5563; /* Gray-700 */
  transition: all 0.2s ease;
}

.nav-btn:hover {
  color: #111827; /* Gray-900 */
  background: rgba(0, 0, 0, 0.03);
}

.nav-btn.q-router-link-active {
  color: #4f46e5; /* Primary Indigo */
  background: rgba(79, 70, 229, 0.08);
  font-weight: 600;
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
  background: #f3f4f6;
  color: #4f46e5;
  font-weight: 600;
}
</style>
