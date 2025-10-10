<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

defineEmits<{
  confirm: []
}>()
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot>
        <Button variant="destructive"> 删除 </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>删除日程</DialogTitle>
        <DialogDescription> 确定要删除这个日程吗？ </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button @click="$emit('confirm')"> 确认 </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
