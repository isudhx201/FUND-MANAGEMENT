<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-black text-white">
      <q-toolbar>
        <q-btn flat no-caps no-wrap dense to="/" class="q-mr-sm">
          <q-toolbar-title class="text-weight-bold">BatchFund</q-toolbar-title>
        </q-btn> 

        <q-space />

        <!-- Desktop Menu -->
        <div class="q-gutter-sm row items-center gt-xs">
          <q-btn flat round dense icon="home" to="/" class="q-mr-xs" />
          <q-btn flat no-caps label="Payment Details" to="/payment-details" />
          <q-btn flat no-caps label="History" to="/history" />
          <q-separator vertical dark spaced />
          <q-btn outline no-caps label="Admin Login" to="/login" />
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
      behavior="mobile"
      class="bg-grey-1"
    >
      <q-list padding class="text-grey-9">
        <q-item-label header class="text-weight-bold text-black">Menu</q-item-label>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/payment-details">
          <q-item-section avatar>
            <q-icon name="payments" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Payment Details</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-ripple to="/history">
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Fund History</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-ripple to="/documents">
          <q-item-section avatar>
            <q-icon name="folder" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Documents</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple to="/login">
          <q-item-section avatar>
            <q-icon name="admin_panel_settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Admin Login</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
