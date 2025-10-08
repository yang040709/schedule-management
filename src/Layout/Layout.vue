<script setup lang='ts'>
import Header from './Header.vue'
</script>

<template>
  <div>
    <Header/>
    <main class="p-4">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>
</style>