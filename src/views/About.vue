<script setup lang="ts">
import { APP_CONFIG } from '@/config/app';
const currentFeatures = [
  '优化界面细节：图标、标题动态变化，提升用户体验',
  '新增「全部任务」页面：分类查看已完成 / 未完成日程',
  '使用 Dexie.js 实现本地 IndexedDB 持久化存储',
  '重构数据结构，支持更灵活的分类与状态管理',
  '新增「设置」页面：支持日程数据的 <strong>导出</strong> 与 <strong>导入</strong>',
  '遵循 Git 提交规范，提升团队协作效率',
]

const futurePlans = [
  '<strong>成就可视化</strong>：通过饼图/柱状图展示任务完成率、时间分配等数据',
  '<strong>个性化报告</strong>：每周/每月自动生成时间管理复盘报告',
  '<strong>高级搜索与筛选</strong>：按日期、关键词、分类、优先级快速查找日程',
  '集成 <strong>Vue Flow</strong> 可视化每日任务流',
  '<strong>AI 智能助手</strong>：出行提醒（天气/通勤）、学习建议（官网链接）、任务优化推荐',
  '支持 <strong>云端同步</strong>：后端服务实现多设备数据同步',
]
</script>

<template>
  <div :style="{ height: `calc(100vh - ${APP_CONFIG.HeaderHeight + 5}px)` }" class="bg-gradient-to-br from-gray-50
     to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          关于 <span class="text-indigo-600">日程助手</span>
        </h1>
        <p class="mt-4 text-lg text-gray-600">一个专注效率与成长的智能日程管理工具</p>
      </div>

      <!-- 当前版本介绍 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          第二版本 · 当前功能
        </h2>
        <ul class="space-y-3 text-gray-700">
          <li v-for="(item, index) in currentFeatures" :key="`current-${index}`" class="flex items-start group">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span v-html="item"></span>
          </li>
        </ul>
      </div>

      <!-- 后续规划 -->
      <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm p-6 border border-indigo-100">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          未来规划 · 更智能的你
        </h2>
        <ul class="space-y-3 text-gray-700">
          <li v-for="(item, index) in futurePlans" :key="`future-${index}`" class="flex items-start group">
            <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
            <span v-html="item"></span>
          </li>
        </ul>
      </div>

      <!-- 底部提示 -->
      <div class="text-center mt-12 text-sm text-gray-500">
        <p>日程助手 · 专注让你的每一天更有意义</p>
        <p class="mt-1">当前版本：v2.0 | 本地存储 · 无网络依赖</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
li {
  transition: transform 0.2s;
}

li:hover {
  transform: translateX(4px);
}
</style>
