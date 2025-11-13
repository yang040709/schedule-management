<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
        <span>设置</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>
        <span>项目信息</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <span>GitHub</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="useStore.logout()">
        <span>登出</span>
        <!-- <DropdownMenuShortcut @>⇧⌘Q</DropdownMenuShortcut> -->
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
