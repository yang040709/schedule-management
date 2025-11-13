import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
// import { loginApi, registerApi, getUserInfoApi } from '@/api/user'
import type { RegisterFrom, LoginFrom } from '@/types/user'
import { delay } from '@/utils'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    user_id: '',
    name: '',
    role: '',
  })
  const isLogin: Ref<boolean> = computed(() => {
    return user.value.user_id !== '' || user.value.name !== '' || user.value.role !== ''
  })
  const token: Ref<string | undefined> = useLocalStorage('yang-customer-token', undefined)
  const isTryGetUserInfo = ref(false)
  const loading = ref(false)
  // const login = async (loginFrom: LoginFrom) => {
  //   try {
  //     const res = await loginApi(loginFrom)
  //     token.value = res.token
  //     user.value.user_id = res.user_id
  //     user.value.name = res.name
  //     user.value.role = res.role
  //     return res
  //   } catch (err) {
  //     return Promise.reject(err)
  //   }
  // }
  // const register = async (registerFrom: LoginFrom) => {
  //   try {
  //     const res = await registerApi(registerFrom)
  //     token.value = res.token
  //     user.value.user_id = res.user_id
  //     user.value.name = res.name
  //     user.value.role = res.role
  //     return res
  //   } catch (err) {
  //     return Promise.reject(err)
  //   }
  // }
  // const getUserInfo = async () => {
  //   try {
  //     const res = await getUserInfoApi()
  //     user.value.user_id = res.user_id
  //     user.value.name = res.name
  //     user.value.role = res.role
  //     return res
  //   } catch (err) {
  //     return Promise.reject(err)
  //   }
  // }

  const login = async (loginFrom: LoginFrom) => {
    loading.value = true
    await delay(1000)
    // return
    user.value = {
      user_id: '1',
      name: '张三',
      role: 'admin',
    }
    token.value = '123456'
    loading.value = false
  }
  const register = async (registerFrom: RegisterFrom) => {
    loading.value = true
    await delay(1000)
    // return
    user.value = {
      user_id: '2',
      name: '李四',
      role: 'user',
    }
    token.value = '654321'
    loading.value = false
  }
  const getUserInfo = async () => {
    loading.value = true
    await delay(1000)
    // return
    user.value = {
      user_id: '3',
      name: '王五',
      role: 'user',
    }
    token.value = '123456'
    loading.value = false
  }
  const logout = async () => {
    token.value = undefined
    user.value.user_id = ''
    user.value.name = ''
    user.value.role = ''
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
