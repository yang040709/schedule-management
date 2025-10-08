<script setup lang="ts">
const navList = [
  {
    text: '今日',
    path: '/',
  },
  {
    text: '日历',
    path: '/calendar',
  },
  {
    text: '日程列表',
    path: '/schedule-list',
  },
  {
    text: '添加日程',
    path: '/add-schedule',
  },
]
</script>

<template>
  <header class="flex justify-between items-center px-4 py-2 w-full border-b-1 border-b-gray-100">
    <h1 class="text-2xl text-gray-500 font-mono">简程</h1>
    <ul class="flex gap-4">
      <li v-for="item in navList" :key="item.path">
        <RouterLink :to="item.path" class="text-sm text-gray-500 hover:text-gray-700">
          {{ item.text }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>

<style scoped></style>
