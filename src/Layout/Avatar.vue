<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import FallbackImage from '@/components/FallbackImage.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const useStore = useUserStore()


const router = useRouter();
const handleLogout = () => {
  useStore.logout()
  router.push({
    name: "login"
  })
}

const navToSetting = () => {
  router.push({
    name: 'setting',
  })
}

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <FallbackImage src="/avatar.png" class="w-10 h-10 rounded-full mr-8" alt="avatar" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuItem @click="navToSetting">
        设置
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>
        <span>项目信息</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <!-- <Button variant="link">GitHub</Button> -->
        <a href="https://github.com/yang040709" target="_blank" class="hover:underline">GitHub</a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout">
        <button class="cursor-pointer">登出</button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
