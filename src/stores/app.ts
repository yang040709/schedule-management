import { defineStore } from 'pinia'
import { useTitle } from '@vueuse/core'
import { readonly } from 'vue'
import { APP_CONFIG } from '@/config/app'
export const useAppStore = defineStore('app', () => {
  const titleRef = useTitle(APP_CONFIG.baseTitle)
  const setTitle = (newTitle?: string) => {
    if (!newTitle) {
      titleRef.value = APP_CONFIG.baseTitle
    } else {
      titleRef.value = `${newTitle} | ${APP_CONFIG.baseTitle}`
    }
  }
  return {
    title: readonly(titleRef),
    setTitle,
  }
})
