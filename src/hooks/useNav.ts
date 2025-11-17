import { useRoute } from 'vue-router'
import type { RouteLocationAsRelativeGeneric } from 'vue-router'
import {
  Component,
  House,
  ListTodo,
  Flame,
  ChartBar,
  List,
  ArrowDownUp,
  Settings,
} from 'lucide-vue-next'

import { UAParser } from 'ua-parser-js'
interface MyRouteLocationAsRelativeGeneric extends RouteLocationAsRelativeGeneric {
  name: string
}

interface NavList {
  text: string
  route: MyRouteLocationAsRelativeGeneric
  icon: typeof Component
}
export const useNav = () => {
  const parser = new UAParser()
  // console.log(parser.getDevice().type)
  const device = parser.getDevice().type

  let navList: NavList[] = []
  if (device === 'mobile' || device === 'tablet') {
    navList = [
      {
        text: '日程',
        route: {
          name: 'todayCalendar',
        },
        icon: ListTodo,
      },
      {
        text: '列表',
        route: {
          name: 'schedule-list',
        },
        icon: List,
      },
      {
        text: '设置',
        route: {
          name: 'setting',
        },
        icon: Settings,
      },
    ]
  } else {
    navList = [
      {
        text: '日程',
        route: {
          name: 'todayCalendar',
        },
        icon: ListTodo,
      },
      {
        text: '流程',
        route: {
          name: 'flow',
        },
        icon: ArrowDownUp,
      },
      {
        text: '列表',
        route: {
          name: 'schedule-list',
        },
        icon: List,
      },
      {
        text: '设置',
        route: {
          name: 'setting',
        },
        icon: Settings,
      },
    ]
  }

  // const

  const route = useRoute()
  const isActive = (name: string) => {
    if (name === 'todayCalendar' && route.name === 'calendar') {
      return true
    }
    return route.name === name
  }
  return {
    navList,
    isActive,
  }
}
