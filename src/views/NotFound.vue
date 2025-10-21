<script setup lang="ts">
import imgSrc from '@/static/img/404.svg'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <div class="text-gray-500 flex flex-col items-center justify-center h-[60vh]">
    <img :src="imgSrc" alt="" class="w-[300px]" />
    <div class="mt-4 gap-4 flex flex-col items-center justify-center">
      <p>抱歉，你访问的页面不存在</p>
      <Button
        @click="
          $router.push({
            name: 'home',
          })
        "
        >返回首页</Button
      >
    </div>
  </div>
</template>

<style scoped></style>
