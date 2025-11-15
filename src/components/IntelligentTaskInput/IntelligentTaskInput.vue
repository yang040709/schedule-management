<script setup lang="ts">
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ref } from 'vue'
import type { ScheduleForm } from '@/types/schedule'
import { getTodayDate } from '@/utils/date'
import { getId } from '@/utils'
import { toast } from 'vue-sonner'

// 定义解析状态类型
type ParseStatus = 'unparsed' | 'parsing' | 'success' | 'error'

const userInput = ref('')
const parseStatus = ref<ParseStatus>('unparsed') // 默认未解析状态

const parseResult = ref<ScheduleForm>({
  title: '',
  description: '',
  priority: 'high',
  completed: false,
  date: getTodayDate(),
})
const errorMessage = ref('')

// 模拟解析任务的函数
const parseTask = (input: string): Promise<typeof parseResult.value> => {
  return new Promise((resolve, reject) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      // 简单的解析逻辑，实际项目中会替换为真实的解析服务
      const trimmedInput = input.trim()

      // 模拟解析失败场景（空输入或无效格式）
      if (!trimmedInput) {
        reject(new Error('请输入任务内容后再进行解析'))
        return
      }

      if (!trimmedInput.includes('和') || !trimmedInput.includes('点')) {
        reject(new Error('无法识别任务格式，请尝试输入类似"下周一上午10点和小王开会"的内容'))
        return
      }

      // 模拟解析成功的结果
      resolve({
        title: trimmedInput.includes('开会') ? '和小王开会' : '与相关人员会面',
        // : trimmedInput.match(/下周一.*?\d+点/)?.[0] || '下周一 10:00',
        description: '描述',
        date: getTodayDate(),
        priority: 'high',
        category: ['会议'],
        completed: false,
      })
    }, 800)
  })
}

const handleSubmit = async () => {
  if (!userInput.value.trim()) {
    parseStatus.value = 'error'
    errorMessage.value = '请输入任务内容'
    return
  }

  // 开始解析，显示加载状态
  parseStatus.value = 'parsing'

  try {
    // 调用解析函数
    const result = await parseTask(userInput.value)
    parseResult.value = result
    parseStatus.value = 'success'
  } catch (err) {
    // 解析失败处理
    parseStatus.value = 'error'
    errorMessage.value = err instanceof Error ? err.message : '解析任务时发生错误'
  }
}

// 重置解析状态
const resetParse = () => {
  parseStatus.value = 'unparsed'
  errorMessage.value = ''
}

const confirmAdd = () => {
  toast.success('任务添加成功')
}

const cancelAdd = () => {
  resetParse()
}
</script>

<template>
  <div class="bg-white rounded-md shadow-sm p-6 mb-6 border">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">快速添加任务</h2>
    <div class="space-y-4">
      <div class="flex flex-col space-y-4">
        <Textarea
          v-model="userInput"
          type="text"
          placeholder="输入任务，如：下周一上午10点和小王开会。我们将使用大模型帮你添加任务。"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          :class="{ 'border-error': parseStatus === 'error' && userInput.trim() }"
          @input="resetParse"
        />
        <Button
          @click="handleSubmit"
          class="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          :disabled="parseStatus === 'parsing'"
        >
          <i class="fas fa-magic mr-2"></i>
          <span v-if="parseStatus !== 'parsing'">智能解析</span>
          <span v-else> <i class="fas fa-spinner fa-spin mr-2"></i>解析中... </span>
        </Button>
      </div>

      <!-- 未解析状态 -->
      <div
        v-if="parseStatus === 'unparsed' && userInput.trim()"
        class="bg-gray-50 border border-gray-200 rounded-lg p-4"
      >
        <h3 class="text-gray-800 font-semibold mb-2 flex items-center">
          <i class="fas fa-info-circle mr-2"></i>提示
        </h3>
        <p class="text-sm text-gray-600">点击"智能解析"按钮，系统将自动识别任务中的关键信息</p>
      </div>

      <!-- 解析成功状态 -->
      <div
        v-if="parseStatus === 'success'"
        class="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 class="text-blue-800 font-semibold mb-2 flex items-center">
          <i class="fas fa-check-circle mr-2"></i>解析结果
        </h3>
        <div class="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span class="text-gray-600">任务名称：</span>
            <span class="font-medium">{{ parseResult.title }}</span>
          </div>
          <div>
            <span class="text-gray-600">描述：</span>
            <span class="font-medium">{{ parseResult.description }}</span>
          </div>
          <div>
            <span class="text-gray-600">时间：</span>
            <span class="font-medium">{{ parseResult.date }}</span>
          </div>
          <div>
            <span class="text-gray-600">优先级：</span>
            <span class="font-medium text-warning">{{ parseResult.priority }}</span>
          </div>
          <div v-if="parseResult.category?.length">
            <span class="text-gray-600">类别：</span>
            <span class="font-medium">{{ parseResult.category }}</span>
          </div>
          <div v-if="parseResult.startTime">
            <span class="text-gray-600">开始时间：</span>
            <span class="font-medium">{{ parseResult.startTime }}</span>
          </div>
          <div v-if="parseResult.endTime">
            <span class="text-gray-600">结束时间：</span>
            <span class="font-medium">{{ parseResult.endTime }}</span>
          </div>
        </div>
        <div class="button flex gap-x-4 mt-5 justify-between">
          <Button class="flex-1" @click="confirmAdd">确实添加</Button>
          <Button class="flex-1" @click="cancelAdd" variant="outline">取消</Button>
        </div>
      </div>

      <!-- 解析失败状态 -->
      <div v-if="parseStatus === 'error'" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="text-red-800 font-semibold mb-2 flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>解析失败
        </h3>
        <p class="text-sm text-red-700 mb-3">
          {{ errorMessage }}
        </p>
        <Button @click="handleSubmit" variant="secondary" class="text-sm px-4 py-1 h-auto">
          <i class="fas fa-sync-alt mr-1"></i>重试解析
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 补充必要的样式定义 */
.border-error {
  border-color: #ef4444 !important;
}

.text-warning {
  color: #f59e0b;
}
</style>
