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
const handleClick = () => {
  console.log('click')
}
const useStore = useUserStore()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <FallbackImage src="/avatar.png" class="w-10 h-10 rounded-full" alt="avatar" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuItem @click="handleClick">
        <RouterLink
          :to="{
            name: 'setting',
          }"
          >设置</RouterLink
        >
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
      <DropdownMenuItem @click="useStore.logout()">
        <button @click="useStore.logout()" class="cursor-pointer">登出</button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
