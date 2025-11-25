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
import { type Ref, ref } from 'vue'
interface MyRouteLocationAsRelativeGeneric extends RouteLocationAsRelativeGeneric {
  name: string
}

interface NavList {
  text: string
  route: MyRouteLocationAsRelativeGeneric
  icon: typeof Component
  onlyPC?: boolean
  onlyMobile?: boolean
}

const defaultNavList: NavList[] = [
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
    onlyPC: true,
  },
  {
    text: '习惯',
    route: {
      name: 'habit',
    },
    icon: Flame,
  },
  {
    text: '统计',
    route: {
      name: 'stat',
    },
    icon: ChartBar,
  },
  {
    text: '设置',
    route: {
      name: 'setting',
    },
    icon: Settings,
  },
]

export const useNav = () => {
  const parser = new UAParser()
  // console.log(parser.getDevice().type)
  const device = parser.getDevice().type

  const navList: Ref<NavList[]> = ref([])
  if (device === 'mobile' || device === 'tablet') {
    navList.value = defaultNavList.filter((item) => !item.onlyPC)
  } else {
    navList.value = defaultNavList.filter((item) => !item.onlyMobile)
  }

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
