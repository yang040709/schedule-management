import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: () => import('@/views/Today.vue'),
      redirect: () => {
        return {
          name: 'calendar',
          params: {
            date: new Date().toISOString().slice(0, 10),
          },
        }
      },
    },
    {
      path: '/calendar',
      name: 'todayCalendar',
      redirect(to) {
        return {
          name: 'calendar',
          params: {
            date: new Date().toISOString().slice(0, 10),
          },
        }
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
      name: 'scheduleList',
      component: () => import('@/views/ScheduleList.vue'),
    },
    {
      path: '/add-schedule',
      name: 'addSchedule',
      component: () => import('@/views/AddSchedule.vue'),
      meta: {
        title: '添加日程',
      },
    },
    {
      path: '/edit/:date/:id',
      name: 'edit',
      props: true,
      component: () => import('@/views/EditSchedule.vue'),
      meta: {
        title: '编辑日程',
      },
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/Setting.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
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
