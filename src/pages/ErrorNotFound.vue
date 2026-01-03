<template>
  <div class="fullscreen text-center q-pa-md flex flex-center" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-blue text-white'">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        :text-color="$q.dark.isActive ? 'blue-grey-10' : 'blue'"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
// Use global q.dark
</script>
