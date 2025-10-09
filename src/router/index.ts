import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
    },
    {
      path: '/schedule-list',
      component: () => import('@/views/ScheduleList.vue'),
    },
    {
      path: '/add-schedule',
      component: () => import('@/views/AddSchedule.vue'),
    },
    {
      path: '/edit/:date/:id',
      name: 'edit',
      props: true,
      component: () => import('@/views/EditSchedule.vue'),
    },
  ],
})

export default router
