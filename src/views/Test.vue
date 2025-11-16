<script setup lang="ts"></script>

<template>
  <div class="flex flex-col">
    <div class="container">
      <div class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <!-- 状态圆点 -->
        <div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>

        <!-- 内容区 -->
        <div class="flex-1 mr-4">
          <div class="text-sm font-medium text-gray-800">客户提案演示</div>
          <div class="text-xs text-gray-600 mt-1">向ABC公司展示新产品方案</div>

          <!-- 标签组 -->
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">会议</span>
            <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">客户</span>
            <span class="px-2 py-1 text-xs rounded bg-green-100 text-green-700">高优优先级</span>
            <span class="px-2 py-1 text-xs rounded bg-green-200 text-green-800">14:00 - 15:30</span>
            <span class="px-2 py-1 text-xs rounded bg-green-50 text-green-600">已完成</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <button class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
          操作
        </button>
      </div>
    </div>
    <div class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>

      <div class="flex-1 mr-4">
        <div class="text-sm font-medium text-gray-800">客户提案演示</div>
        <div class="text-xs text-gray-600 mt-1">向ABC公司展示新产品方案</div>

        <div class="flex flex-wrap gap-2 mt-2">
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">会议</span>
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">客户</span>
          <span class="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">中优先级</span>
          <span class="px-2 py-1 text-xs rounded bg-yellow-200 text-yellow-800">14:00 - 15:30</span>
          <span class="px-2 py-1 text-xs rounded bg-yellow-50 text-yellow-600">待处理</span>
        </div>
      </div>

      <button class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
        操作
      </button>
    </div>
    <div class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="w-4 h-4 rounded-full bg-red-500 mr-3"></div>

      <div class="flex-1 mr-4">
        <div class="text-sm font-medium text-gray-800">客户提案演示</div>
        <div class="text-xs text-gray-600 mt-1">向ABC公司展示新产品方案</div>

        <div class="flex flex-wrap gap-2 mt-2">
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">会议</span>
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">客户</span>
          <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-700">高优优先级</span>
          <span class="px-2 py-1 text-xs rounded bg-red-200 text-red-800">14:00 - 15:30</span>
          <span class="px-2 py-1 text-xs rounded bg-red-50 text-red-600">已过期</span>
        </div>
      </div>

      <button class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
        操作
      </button>
    </div>
    <div class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="w-4 h-4 rounded-full bg-gray-400 mr-3"></div>

      <div class="flex-1 mr-4">
        <div class="text-sm font-medium text-gray-800">客户提案演示</div>
        <div class="text-xs text-gray-600 mt-1">向ABC公司展示新产品方案</div>

        <div class="flex flex-wrap gap-2 mt-2">
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">会议</span>
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">客户</span>
          <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">普通优先级</span>
          <span class="px-2 py-1 text-xs rounded bg-gray-200 text-gray-800">14:00 - 15:30</span>
          <span class="px-2 py-1 text-xs rounded bg-gray-50 text-gray-600">已取消</span>
        </div>
      </div>

      <button class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
        操作
      </button>
    </div>
    <div class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="w-4 h-4 rounded-full bg-orange-500 mr-3"></div>

      <div class="flex-1 mr-4">
        <div class="text-sm font-medium text-gray-800">客户提案演示</div>
        <div class="text-xs text-gray-600 mt-1">向ABC公司展示新产品方案</div>

        <div class="flex flex-wrap gap-2 mt-2">
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">会议</span>
          <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">客户</span>
          <span class="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700">高优优先级</span>
          <span class="px-2 py-1 text-xs rounded bg-orange-200 text-orange-800">14:00 - 15:30</span>
          <span class="px-2 py-1 text-xs rounded bg-orange-50 text-orange-600">进行中</span>
        </div>
      </div>

      <button class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
        操作
      </button>
    </div>
  </div>
</template>

<style scoped></style>
