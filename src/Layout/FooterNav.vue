<script setup lang="ts">
import { useNav } from '@/hooks/useNav'
const { navList, isActive } = useNav()
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white z-10 sm:hidden border-t py-2 h-[65px]">
    <nav class="flex justify-around">
      <router-link
        v-for="item in navList"
        :key="item.route.name"
        :to="{ name: item.route.name }"
        class="flex flex-col items-center"
      >
        <div :class="isActive(item.route.name) ? 'text-blue-500' : 'text-gray-500'">
          <!-- <item.icon class="w-5 h-5" /> -->
          <component :is="item.icon"></component>
        </div>
        <div :class="isActive(item.route.name) ? 'text-blue-500' : 'text-gray-500'">
          {{ item.text }}
        </div>
      </router-link>
    </nav>
  </div>
</template>

<style scoped></style>
