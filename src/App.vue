<script setup lang="ts">
import Button from './components/ui/button/Button.vue'
import AppCalendar from './components/AppCalendar.vue'
import Layout from './Layout/Layout.vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
import { useAppStore } from './stores/app'
useAppStore()
</script>

<template>
  <Toaster position="top-center" />
  <RouterView />
  <!-- <Layout></Layout> -->
</template>

<style scoped></style>
