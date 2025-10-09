<script setup lang="ts">
import Header from './Header.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="p-4 max-w-[1200px] m-auto flex-1 w-full">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
