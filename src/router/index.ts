import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Today.vue'),
    },
    {
      path: '/calendar',
      component: () => import('@/views/Calendar.vue'),
    },
    {
      path: '/schedule-list',
      component: () => import('@/views/ScheduleList.vue'),
    },
    {
      path: '/add-schedule',
      component: () => import('@/views/AddSchedule.vue'),
    },
  ],
})

export default router
