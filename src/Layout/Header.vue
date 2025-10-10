<script setup lang="ts">
import { useRoute } from 'vue-router'
const navList = [
  {
    text: '今日',
    path: '/',
  },
  {
    text: '日程',
    path: '/calendar/2025-10-09',
  },
]

const route = useRoute()
const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  if (path.startsWith('/calendar')) return route.path.startsWith('/calendar')
  return route.path === path
}

const todayLabel = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
}).format(new Date())
</script>

<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b border-gray-100">
    <div class="mx-auto max-w-[1200px] px-4">
      <div class="flex h-14 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <!-- logo的位置，以后如果添加logo，可以放在这里 -->
          <!-- <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-500 to-indigo-600 text-white shadow-sm"
            >简</span
          > -->
          <h1 class="text-xl font-semibold tracking-tight text-gray-900">简程</h1>
        </RouterLink>

        <!-- 导航栏的位置，以后如果添加导航栏，可以放在这里 -->
        <!-- <nav
          class="hidden sm:flex items-center gap-1 rounded-xl p-1 bg-gray-50 border border-gray-100"
        >
          <RouterLink
            v-for="item in navList"
            :key="item.path"
            :to="item.path"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            :class="
              isActive(item.path)
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            "
          >
            {{ item.text }}
          </RouterLink>
        </nav> -->

        <div class="flex items-center gap-3">
          <span
            class="hidden sm:inline-flex items-center rounded-full bg-gray-50 text-black border border-gray-200 px-3 py-1 text-xs font-medium"
          >
            {{ todayLabel }}
          </span>
          <RouterLink
            :to="{
              name: 'addSchedule',
              query: {
                from: $route.fullPath,
              },
            }"
            class="inline-flex items-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            新增日程
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
