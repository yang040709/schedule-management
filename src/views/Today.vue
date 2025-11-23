<script setup lang="ts">
import { onMounted } from 'vue'
import { usePageMeta } from '@/utils/meta'

// 使用动态meta管理
usePageMeta({
  title: '今日日程 - 智能日程管理',
  description:
    '查看和管理今日的日程安排，合理安排您的一天。支持任务添加、编辑、完成状态跟踪等功能。',
  keywords: '今日日程,今日任务,日程安排,时间规划',
})

onMounted(() => {
  // 页面初始化逻辑
})
</script>

<template>
  <div class="today-page">
    <h1>今日日程</h1>
    <!-- 页面内容 -->
  </div>
</template>

<style scoped>
.today-page {
  padding: 20px;
}
</style>
