<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
import { useAppStore } from './stores/app'
useAppStore()
</script>

<template>
  <Toaster position="top-center" :rich-colors="true" />
  <RouterView />
</template>

<style scoped></style>
