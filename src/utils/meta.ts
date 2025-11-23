import { useTitle } from '@vueuse/core'

/**
 * 页面meta信息配置接口
 */
export interface PageMeta {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
}

/**
 * 默认meta配置
 */
const defaultMeta: PageMeta = {
  title: '智能日程管理 - 高效规划您的时间',
  description:
    '智能日程管理应用，帮助您高效规划时间、管理任务、培养习惯。支持日历视图、任务流程、习惯打卡等功能，让您的时间管理更轻松。',
  keywords: '日程管理,时间管理,任务规划,习惯打卡,日历应用,个人效率',
  image: '/logo-color.png',
  url: '/',
}

/**
 * 页面meta配置映射
 */
export const pageMetaConfig: Record<string, PageMeta> = {
  home: {
    title: '智能日程管理 - 高效规划您的时间',
    description:
      '智能日程管理应用，帮助您高效规划时间、管理任务、培养习惯。支持日历视图、任务流程、习惯打卡等功能，让您的时间管理更轻松。',
    keywords: '日程管理,时间管理,任务规划,习惯打卡,日历应用,个人效率',
  },
  todayCalendar: {
    title: '今日日程 - 智能日程管理',
    description:
      '查看和管理今日的日程安排，合理安排您的一天。支持任务添加、编辑、完成状态跟踪等功能。',
    keywords: '今日日程,今日任务,日程安排,时间规划',
  },
  calendar: {
    title: '日历视图 - 智能日程管理',
    description:
      '通过日历视图查看和管理您的长期日程安排，支持月视图、周视图，让您对时间规划一目了然。',
    keywords: '日历,月视图,周视图,长期规划,日程安排',
  },
  habit: {
    title: '习惯管理 - 智能日程管理',
    description: '培养和跟踪您的日常习惯，支持习惯打卡、成就统计、习惯分析，帮助您养成良好习惯。',
    keywords: '习惯管理,习惯打卡,成就统计,习惯养成,日常习惯',
  },
  flow: {
    title: '任务流程 - 智能日程管理',
    description: '通过流程图方式管理复杂任务流程，支持节点拖拽、流程优化，让任务管理更直观高效。',
    keywords: '任务流程,流程图,节点管理,流程优化,任务规划',
  },
  'schedule-list': {
    title: '日程列表 - 智能日程管理',
    description: '以列表形式查看和管理所有日程任务，支持筛选、排序、批量操作，让日程管理更高效。',
    keywords: '日程列表,任务管理,筛选排序,批量操作',
  },
  about: {
    title: '关于我们 - 智能日程管理',
    description: '了解智能日程管理应用的开发团队、产品理念和技术特点，为您提供更好的时间管理体验。',
    keywords: '关于我们,产品介绍,团队信息,技术特点',
  },
  login: {
    title: '登录 - 智能日程管理',
    description: '登录您的智能日程管理账户，开始高效规划您的时间。',
    keywords: '用户登录,账户登录,个人中心',
  },
  register: {
    title: '注册 - 智能日程管理',
    description: '注册智能日程管理账户，开启高效时间管理之旅。',
    keywords: '用户注册,创建账户,新用户',
  },
  setting: {
    title: '设置 - 智能日程管理',
    description: '个性化设置您的智能日程管理应用，包括主题、通知、数据管理等选项。',
    keywords: '应用设置,个性化,主题设置,数据管理',
  },
}

/**
 * 更新或创建meta标签
 * @param name meta标签的name或property属性
 * @param content meta标签的content属性
 * @param isProperty 是否是property属性（用于Open Graph）
 */
function updateMetaTag(name: string, content: string, isProperty: boolean = false): void {
  const attr = isProperty ? 'property' : 'name'
  let metaTag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement

  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute(attr, name)
    document.head.appendChild(metaTag)
  }

  metaTag.content = content
}

/**
 * 更新或创建link标签
 * @param rel link标签的rel属性
 * @param href link标签的href属性
 */
function updateLinkTag(rel: string, href: string): void {
  let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement

  if (!linkTag) {
    linkTag = document.createElement('link')
    linkTag.rel = rel
    document.head.appendChild(linkTag)
  }

  linkTag.href = href
}

/**
 * 使用动态meta管理
 * @param meta 页面meta配置
 */
export function usePageMeta(meta: Partial<PageMeta> = {}) {
  const fullMeta = { ...defaultMeta, ...meta }

  // 使用VueUse的useTitle设置页面标题
  useTitle(fullMeta.title)

  // 更新基础meta标签
  updateMetaTag('description', fullMeta.description)
  updateMetaTag('keywords', fullMeta.keywords || '')
  updateMetaTag('author', 'Schedule Management Team')

  // 更新Open Graph Meta Tags
  updateMetaTag('og:title', fullMeta.title, true)
  updateMetaTag('og:description', fullMeta.description, true)
  updateMetaTag('og:type', 'website', true)
  updateMetaTag('og:url', fullMeta.url || window.location.href, true)
  updateMetaTag('og:image', fullMeta.image || '/logo-color.png', true)

  // 更新Twitter Card Meta Tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', fullMeta.title)
  updateMetaTag('twitter:description', fullMeta.description)
  updateMetaTag('twitter:image', fullMeta.image || '/logo-color.png')

  // 更新其他meta信息
  updateMetaTag('theme-color', '#3b82f6')
  updateMetaTag('robots', 'index, follow')

  // 更新canonical链接
  updateLinkTag('canonical', window.location.href)
}

/**
 * 根据路由路径获取页面meta配置
 * @param path 路由路径
 * @returns 页面meta配置
 */
export function getPageMetaByPath(path: string): PageMeta {
  return pageMetaConfig[path] || defaultMeta
}

/**
 * 在路由守卫中使用meta管理
 * @param to 目标路由
 * @param from 来源路由
 */
export function setupRouteMeta(to: any, from: any) {
  const meta = getPageMetaByPath(to.name)
  usePageMeta(meta)
}
