<script setup lang="ts">
interface Props {
  /** 骨架数量 */
  count?: number
  /** 单个骨架高度（Tailwind 类名，如 'h-4', 'h-6'） */
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  count: 1,
  height: 'h-4',
})

// 容器类：撑满父容器
const containerClass = 'w-full'

// 高度类处理：确保是合法的 Tailwind 类
const heightClass = props.height.startsWith('h-') ? props.height : `h-${props.height}`
</script>

<template>
  <div :class="containerClass">
    <div
      v-for="i in count"
      :key="i"
      :class="['animate-pulse bg-gray-300 rounded', heightClass, { 'mt-2': i !== 1 }]"
    ></div>
  </div>
</template>
