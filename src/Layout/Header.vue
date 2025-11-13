<script setup lang="ts">
// import logoSrc from '@/static/img/logo.png'
import { useRoute } from 'vue-router'
import { APP_CONFIG } from '@/config/app'
import type { RouteLocationAsRelativeGeneric } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useModelStore } from '@/stores/model'
import Avatar from './Avatar.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
interface MyRouteLocationAsRelativeGeneric extends RouteLocationAsRelativeGeneric {
  name: string
}

interface NavList {
  text: string
  route: MyRouteLocationAsRelativeGeneric
}

const navList: NavList[] = [
  {
    text: '日程',
    route: {
      name: 'todayCalendar',
    },
  },
  {
    text: '流程',
    route: {
      name: 'flow',
    },
  },
  {
    text: '列表',
    route: {
      name: 'schedule-list',
    },
  },
  {
    text: '设置',
    route: {
      name: 'setting',
    },
  },
]

const route = useRoute()
const isActive = (name: string) => {
  if (name === 'todayCalendar' && route.name === 'calendar') {
    return true
  }
  return route.name === name
}

const modelStore = useModelStore()

const todayLabel = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
}).format(new Date())
</script>

<template>
  <header
    :style="{ height: APP_CONFIG.HeaderHeight }"
    class="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b border-gray-100"
  >
    <div class="mx-auto max-w-[1200px] px-4">
      <div class="flex h-14 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/logo.png" class="w-8 h-8" alt="logo" />
          <h1 class="text-xl font-semibold tracking-tight text-gray-900">简程</h1>
        </RouterLink>

        <!-- 导航栏的位置，以后如果添加导航栏，可以放在这里 -->
        <nav
          class="hidden sm:flex items-center gap-1 rounded-xl p-1 bg-gray-50 border border-gray-100"
        >
          <RouterLink
            v-for="item in navList"
            :key="item.route.name"
            :to="item.route"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            :class="
              isActive(item.route.name)
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            "
          >
            {{ item.text }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-3">
          <span
            class="hidden cursor-pointer sm:inline-flex items-center rounded-full bg-gray-50 text-black border border-gray-200 px-3 py-1 text-xs font-medium"
            @click="
              $router.push({
                name: 'todayCalendar',
              })
            "
          >
            {{ todayLabel }}
          </span>
          <!-- <Button @click="modelStore.addModelOpen = true">新增日程</Button> -->
          <!-- <span>欢迎用户：Yang</span> -->
          <Avatar v-if="userStore.isLogin" />
          <RouterLink v-else class="text-gray-600 hover:text-blue-500 transition-colors" to="/login"
            >未登录</RouterLink
          >
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
