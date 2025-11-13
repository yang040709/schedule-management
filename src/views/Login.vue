<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Input } from '@/components/ui/input'
import * as z from 'zod'
import { useUserStore } from '@/stores/user'
import { cloneDeep } from 'lodash-es'
import { useRouter } from 'vue-router'
import { delay } from '@/utils'
import { toast } from 'vue-sonner'
import type { LoginFrom } from '@/types/user'

const initialParam: LoginFrom = {
  username: '',
  password: '',
}

const router = useRouter()

const useStore = useUserStore()

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string('用户名不能为空且必须为字符串')
      .min(3, '用户名不能少于3个字符')
      .max(20, '用户名不能超过20个字符'),
    password: z
      .string('密码不能为空且必须为字符串')
      .min(6, '密码不能少于6个字符')
      .max(20, '密码不能超过20个字符'),
  }),
)
const { handleSubmit, setFieldValue, values, isValidating } = useForm<LoginFrom>({
  validationSchema: formSchema,
  initialValues: initialParam,
})

const onSubmit = () => {
  const submitFn = handleSubmit(async () => {
    try {
      await useStore.login(cloneDeep(values))
      toast.success('登录成功, 1秒后跳转首页')
      await delay(1000)
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  })
  submitFn()
}
</script>

<template>
  <div class="bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo和标题 -->
      <div class="text-center">
        <!-- <div class="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="" class="w-10 h-10 mr-3" />
          <span class="text-3xl font-bold text-gray-900">简程</span>
        </div> -->
        <h2 class="mt-6 text-2xl font-bold text-gray-900">欢迎回来</h2>
        <p class="mt-2 text-sm text-gray-600">请登录您的账户</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-8">
        <form @submit.prevent="onSubmit" class="space-y-5">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">用户名</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入用户名"
                  v-bind="componentField"
                  autocomplete="username"
                  class="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  v-bind="componentField"
                  autocomplete="current-password"
                  class="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <div class="pt-4">
            <Button
              type="submit"
              class="w-full h-12 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >登录</Button
            >
          </div>
        </form>
        <div class="mt-6">
          <div class="text-center text-sm text-gray-600">
            还没有账号？<RouterLink to="/register" class="text-blue-500 font-medium hover:underline"
              >去注册</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
