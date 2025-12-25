import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getTodayDate } from '@/utils/date'
import { setupRouteMeta } from '@/utils/meta'
import { useUserStore } from '@/stores/user'
import Layout from '@/Layout/Layout.vue'
import { NO_LOGIN_CAN_ACCESS, ANY_CAN_ACCESS } from '@/constant'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/home',
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
          path: '/stat',
          name: 'stat',
          component: () => import('@/views/Stat.vue'),
          meta: {
            title: '统计',
            layout: 'full',
          },
        },
      ],
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      meta: {
        layout: 'full',
        title: '登录',
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

router.beforeEach(async (to, from, next) => {
  const routeName = to.name?.toString()
  const userStore = useUserStore()
  console.log(routeName, '<==routeName')

  try {
    await userStore.ensureUserInfo()
  } catch (error) {
    console.log('获取用户信息失败', error)
  }
  console.log(routeName, ANY_CAN_ACCESS.includes(routeName as string))

  console.log(routeName && ANY_CAN_ACCESS.includes(routeName), '<==Any')
  if (routeName && ANY_CAN_ACCESS.includes(routeName)) {
    next()
    return
  }
  if (!userStore.isLogin) {
    /* || !NO_LOGIN_CAN_ACCESS.includes(to.name as string) */
    if (routeName && NO_LOGIN_CAN_ACCESS.includes(routeName)) {
      next()
      return
    }
    next({
      name: 'login',
    })
    return
  }
  if (routeName && NO_LOGIN_CAN_ACCESS.includes(routeName)) {
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
  // setupRouteMeta(to, from)
  console.log('暂时不设置这些玩意')
})

export default router
