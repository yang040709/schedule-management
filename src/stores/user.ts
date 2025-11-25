import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { LoginFrom, User } from '@/types/user'
import { loginApi, registerApi, getUserInfoApi, logoutApi } from '@/api/user'
import { ACCESS_TOKEN_KEY } from '@/constant'
export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    userId: '',
    username: '',
    role: '',
  })
  const isLogin: Ref<boolean> = computed(() => {
    return user.value.userId !== '' || user.value.username !== '' || user.value.role !== ''
  })
  /* 访问令牌 */
  const accessToken: Ref<string | undefined> = useLocalStorage(ACCESS_TOKEN_KEY, undefined)
  // const token: Ref<string | undefined> = useLocalStorage('yang-customer-token', undefined)
  const isTryGetUserInfo = ref(false)
  const loading = ref(false)
  const login = async (loginFrom: LoginFrom) => {
    try {
      loading.value = true
      const res = await loginApi(loginFrom)
      accessToken.value = res.accessToken
      user.value.userId = res.userId
      user.value.username = res.username
      user.value.role = res.role
      return res
    } catch (err) {
      logout()
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }
  const register = async (registerFrom: LoginFrom) => {
    try {
      loading.value = true
      const res = await registerApi(registerFrom)
      accessToken.value = res.accessToken
      user.value.userId = res.userId
      user.value.username = res.username
      user.value.role = res.role
      return res
    } catch (err) {
      logout()
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
      logout()
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    accessToken.value = undefined
    user.value.userId = ''
    user.value.username = ''
    user.value.role = ''
    try {
      await logoutApi()
    } catch (error) {
      console.log(error)
    }
    loading.value = false
  }
  return {
    user,
    accessToken,
    isLogin,
    isTryGetUserInfo,
    login,
    register,
    getUserInfo,
    logout,
  }
})
