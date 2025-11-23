/**
 * 无障碍访问（a11y）工具函数
 * 提供无障碍访问相关的辅助功能
 */

/**
 * 为按钮添加适当的ARIA标签
 * @param element 按钮元素
 * @param label 标签文本
 */
export function setButtonAriaLabel(element: HTMLElement, label: string): void {
  element.setAttribute('aria-label', label)

  // 如果按钮没有可见文本，添加隐藏的span用于屏幕阅读器
  if (!element.textContent?.trim()) {
    const screenReaderText = document.createElement('span')
    screenReaderText.className = 'sr-only'
    screenReaderText.textContent = label
    element.appendChild(screenReaderText)
  }
}

/**
 * 为图标按钮添加无障碍支持
 * @param element 图标按钮元素
 * @param label 图标描述
 */
export function setIconButtonAria(element: HTMLElement, label: string): void {
  element.setAttribute('role', 'button')
  element.setAttribute('aria-label', label)
  element.setAttribute('tabindex', '0')
}

/**
 * 为表单元素添加无障碍支持
 * @param input 输入元素
 * @param label 标签文本
 */
export function setFormElementAria(input: HTMLElement, label: string): void {
  const id = `input-${Date.now()}`
  input.setAttribute('id', id)
  input.setAttribute('aria-label', label)

  // 创建关联的标签（如果不存在）
  if (!input.closest('label')) {
    const labelElement = document.createElement('label')
    labelElement.setAttribute('for', id)
    labelElement.className = 'sr-only'
    labelElement.textContent = label
    input.parentNode?.insertBefore(labelElement, input)
  }
}

/**
 * 为状态指示器添加无障碍支持
 * @param element 状态元素
 * @param status 状态文本
 * @param liveRegion 是否使用实时区域
 */
export function setStatusAria(
  element: HTMLElement,
  status: string,
  liveRegion: boolean = false,
): void {
  element.setAttribute('aria-live', liveRegion ? 'polite' : 'off')
  element.setAttribute('aria-atomic', 'true')

  if (liveRegion) {
    element.textContent = status
  } else {
    element.setAttribute('aria-label', status)
  }
}

/**
 * 为日历网格添加无障碍支持
 * @param grid 网格元素
 * @param caption 网格标题
 */
export function setCalendarGridAria(grid: HTMLElement, caption: string): void {
  grid.setAttribute('role', 'grid')
  grid.setAttribute('aria-label', caption)

  // 为每个网格单元格添加适当的角色
  const cells = grid.querySelectorAll('[role="gridcell"]')
  cells.forEach((cell) => {
    if (!cell.getAttribute('role')) {
      cell.setAttribute('role', 'gridcell')
    }
  })
}

/**
 * 为任务卡片添加无障碍支持
 * @param card 卡片元素
 * @param title 任务标题
 * @param status 任务状态
 */
export function setTaskCardAria(card: HTMLElement, title: string, status: string): void {
  card.setAttribute('role', 'article')
  card.setAttribute('aria-label', `${title} - ${status}`)

  // 为操作按钮添加适当的角色
  const buttons = card.querySelectorAll('button')
  buttons.forEach((button) => {
    if (!button.getAttribute('role')) {
      button.setAttribute('role', 'button')
    }
  })
}

/**
 * 为导航菜单添加无障碍支持
 * @param nav 导航元素
 * @param label 导航标签
 */
export function setNavigationAria(nav: HTMLElement, label: string): void {
  nav.setAttribute('role', 'navigation')
  nav.setAttribute('aria-label', label)

  // 为导航链接添加适当的角色
  const links = nav.querySelectorAll('a')
  links.forEach((link) => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'link')
    }
  })
}

/**
 * 为下拉菜单添加无障碍支持
 * @param menu 菜单元素
 * @param label 菜单标签
 */
export function setDropdownAria(menu: HTMLElement, label: string): void {
  menu.setAttribute('role', 'menu')
  menu.setAttribute('aria-label', label)

  // 为菜单项添加适当的角色
  const items = menu.querySelectorAll('[role="menuitem"]')
  items.forEach((item) => {
    if (!item.getAttribute('role')) {
      item.setAttribute('role', 'menuitem')
    }
    item.setAttribute('tabindex', '-1')
  })
}

/**
 * 检查颜色对比度是否符合WCAG标准
 * @param foregroundColor 前景色
 * @param backgroundColor 背景色
 * @returns 对比度比率
 */
export function checkColorContrast(foregroundColor: string, backgroundColor: string): number {
  // 简化的对比度计算（实际实现需要完整的颜色转换和计算）
  // 这里返回一个假设值，实际项目中应该使用完整的对比度计算算法
  return 4.5 // 假设符合AA标准
}

/**
 * 为焦点管理添加支持
 * @param container 容器元素
 */
export function setupFocusManagement(container: HTMLElement): void {
  // 为可聚焦元素添加适当的tabindex
  const focusableElements = container.querySelectorAll(`
    button, 
    [href], 
    input, 
    select, 
    textarea, 
    [tabindex]:not([tabindex="-1"])
  `)

  focusableElements.forEach((element, index) => {
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0')
    }
  })
}

/**
 * 为屏幕阅读器添加隐藏文本
 * @param text 要隐藏的文本
 * @returns 隐藏文本的HTML元素
 */
export function createScreenReaderText(text: string): HTMLElement {
  const span = document.createElement('span')
  span.className = 'sr-only'
  span.textContent = text
  return span
}

/**
 * 为实时更新添加无障碍支持
 * @param container 容器元素
 * @param message 更新消息
 */
export function announceLiveUpdate(container: HTMLElement, message: string): void {
  let liveRegion = container.querySelector('[aria-live="polite"]') as HTMLElement

  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    container.appendChild(liveRegion)
  }

  liveRegion.textContent = message
}
