<script setup lang="ts">
import { Button } from '../ui/button'
// import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ref } from 'vue'

const userInput = ref('')
const handleSubmit = () => {
  console.log(userInput.value)
}
</script>

<template>
  <div class="bg-white rounded-md shadow-sm p-6 mb-6 border">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">智能任务输入</h2>
    <div class="space-y-4">
      <div class="flex flex-col space-y-4">
        <Textarea
          v-model="userInput"
          type="text"
          placeholder="输入任务，如：下周一上午10点和小王开会"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          @click="handleSubmit"
          class="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <i class="fas fa-magic mr-2"></i>智能解析
        </Button>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-blue-800 font-semibold mb-2 flex items-center">
          <i class="fas fa-lightbulb mr-2"></i>解析结果
        </h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">任务名称：</span>
            <span class="font-medium">和小王开会</span>
          </div>
          <div>
            <span class="text-gray-600">时间：</span>
            <span class="font-medium">下周一 10:00</span>
          </div>
          <div>
            <span class="text-gray-600">优先级：</span>
            <span class="font-medium text-warning">重要</span>
          </div>
          <div>
            <span class="text-gray-600">类别：</span>
            <span class="font-medium">会议</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
