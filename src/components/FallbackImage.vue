<script setup lang="ts">
import { ref, defineProps } from 'vue'

// 定义 props
interface Props {
  src: string
  alt?: string
  fallbackSrc?: string
}

const { src, alt = '', fallbackSrc = '/fallback.png' } = defineProps<Props>()

// 当前显示的图片源
const currentSrc = ref(src)

// 图片加载失败处理函数
const handleImageError = () => {
  if (currentSrc.value !== fallbackSrc) {
    currentSrc.value = fallbackSrc
  }
}
</script>

<template>
  <img :src="currentSrc" :alt="alt" @error="handleImageError" v-bind="$attrs" />
</template>
