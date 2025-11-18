import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getTodayDate } from '@/utils/date'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: () => {
        return {
          name: 'calendar',
          params: {
            date: getTodayDate(),
          },
        }
      },
    },
    {
      path: '/calendar',
      name: 'todayCalendar',
      redirect() {
        return {
          name: 'calendar',
          params: {
            date: getTodayDate(),
          },
        }
      },
    },
    {
      path: '/flow',
      name: 'flow',
      component: () => import('@/views/Flow.vue'),
      meta: {
        title: '流程',
        layout: 'full',
      },
    },
    {
      path: '/calendar/:date',
      name: 'calendar',
      props: true,
      component: () => import('@/views/Calendar.vue'),
      meta: {
        title: '日程',
      },
    },
    {
      path: '/schedule-list',
      name: 'schedule-list',
      component: () => import('@/views/ScheduleList.vue'),
      meta: {
        title: '日程列表',
      },
    },
    {
      path: '/habit',
      name: 'habit',
      component: () => import('@/views/Habits.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/Test.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/Setting.vue'),
      meta: {
        title: '设置',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),

      meta: {
        title: '关于',
        layout: 'full',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        title: '登录',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        layout: 'full',
        title: '注册',
      },
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  next()
})
router.afterEach((to, from) => {
  const appStore = useAppStore()
  if (to.meta.title) {
    appStore.setTitle(to.meta.title)
  }
})

export default router
