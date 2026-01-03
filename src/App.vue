<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from 'stores/user-store'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.checkAuth()
})
</script>
