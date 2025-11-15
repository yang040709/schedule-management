import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { LoginFrom, User } from '@/types/user'
import { loginApi, registerApi, getUserInfoApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    userId: '',
    username: '',
    role: '',
  })
  const isLogin: Ref<boolean> = computed(() => {
    return user.value.userId !== '' || user.value.username !== '' || user.value.role !== ''
  })
  const token: Ref<string | undefined> = useLocalStorage('yang-customer-token', undefined)
  const isTryGetUserInfo = ref(false)
  const loading = ref(false)
  const login = async (loginFrom: LoginFrom) => {
    try {
      loading.value = true
      const res = await loginApi(loginFrom)
      token.value = res.token
      user.value.userId = res.userId
      user.value.username = res.username
      user.value.role = res.role
      return res
    } catch (err) {
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }
  const register = async (registerFrom: LoginFrom) => {
    try {
      loading.value = true
      const res = await registerApi(registerFrom)
      token.value = res.token
      user.value.userId = res.userId
      user.value.username = res.username
      user.value.role = res.role
      return res
    } catch (err) {
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }
  const getUserInfo = async () => {
    try {
      loading.value = true
      const res = await getUserInfoApi()
      user.value.userId = res.userId
      user.value.username = res.username
      user.value.role = res.role
      return res
    } catch (err) {
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    token.value = undefined
    user.value.userId = ''
    user.value.username = ''
    user.value.role = ''
    loading.value = false
  }
  return {
    user,
    token,
    isLogin,
    isTryGetUserInfo,
    login,
    register,
    getUserInfo,
    logout,
  }
})
