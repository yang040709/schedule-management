import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getTodayDate } from '@/utils/date'
import { setupRouteMeta } from '@/utils/meta'
import { useUserStore } from '@/stores/user'
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

const noLoginCanAccessRoutes = ['login', 'register']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isTryGetUserInfo) {
    try {
      await userStore.getUserInfo()
    } catch (error) {
      console.log('获取用户信息失败')
    } finally {
      userStore.isTryGetUserInfo = true
    }
  }
  if (!userStore.isLogin) {
    if (!to.name || !noLoginCanAccessRoutes.includes(to.name as string)) {
      next({
        name: 'login',
      })
      return
    }
    /* 否则则放行 */
    next()
    return
  }
  if (to.name && noLoginCanAccessRoutes.includes(to.name as string)) {
    /* 
      如果用户已经登录，则跳转到首页，不能跳转到登录注册页
    */
    next({
      name: 'home',
    })
    return
  }
  next()
})
router.afterEach((to, from) => {
  setupRouteMeta(to, from)
  // const appStore = useAppStore()
  // if (to.meta.title) {
  //   appStore.setTitle(to.meta.title)
  // }
})

export default router
