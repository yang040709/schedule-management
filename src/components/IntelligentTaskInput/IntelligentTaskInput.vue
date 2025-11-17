<script setup lang="ts">
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ref } from 'vue'
import { getTodayDate } from '@/utils/date'
import { toast } from 'vue-sonner'
import { generateScheduleApi, addScheduleApi } from '@/api/schedule'
import { useFetchData } from '@/hooks/useFetchData'
import { priorityMap } from '@/constant'
import { useAddModelStore } from '@/stores/addModel'
import { getScheduleInitialData } from '@/constant'

// 定义解析状态类型
type ParseStatus = 'unparsed' | 'parsing' | 'success' | 'error'

const userInput = ref({
  content: '',
})
const parseStatus = ref<ParseStatus>('unparsed') // 默认未解析状态
const addModelStore = useAddModelStore()

const { data, fetchData, loading } = useFetchData(generateScheduleApi, [userInput], {
  title: '',
  description: '',
  priority: 'high',
  date: getTodayDate(),
})

const errorMessage = ref('')

// 重置解析状态
const resetParse = () => {
  parseStatus.value = 'unparsed'
  errorMessage.value = ''
}

const {
  data: addResponseData,
  fetchData: fetchAddData,
  loading: addLoading,
} = useFetchData(addScheduleApi, [data.value], {
  schedule: getScheduleInitialData(),
})

const confirmAdd = async () => {
  await fetchAddData()
  addModelStore.addResponse = addResponseData.value.schedule
  toast.success('任务添加成功')
  resetParse()
}

const cancelAdd = () => {
  resetParse()
}

const handleSubmit = async () => {
  if (!userInput.value.content.trim()) {
    parseStatus.value = 'error'
    errorMessage.value = '请输入任务内容'
    return
  }
  parseStatus.value = 'parsing'
  try {
    await fetchData()
    parseStatus.value = 'success'
  } catch (error) {
    parseStatus.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : '解析任务时发生错误'
  }
}
</script>

<template>
  <div class="bg-white rounded-md shadow-sm p-6 mb-6 border">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">快速添加任务</h2>
    <div class="space-y-4">
      <div class="flex flex-col space-y-4">
        <Textarea
          v-model="userInput.content"
          type="text"
          placeholder="输入任务，如：下周一上午10点和小王开会。我们将使用大模型帮你添加任务。"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          :class="{ 'border-error': parseStatus === 'error' && userInput.content.trim() }"
          @input="resetParse"
        />
        <Button
          @click="handleSubmit"
          class="bg-primary text-white px-6 py-3 rounded-lg font-medium transition-colors"
          :disabled="parseStatus === 'parsing'"
        >
          <i class="fas fa-magic mr-2"></i>
          <span v-if="parseStatus !== 'parsing'">智能解析</span>
          <span v-else>解析中... </span>
        </Button>
      </div>

      <!-- 未解析状态 -->
      <div
        v-if="parseStatus === 'unparsed' && userInput.content.trim()"
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
            <span class="font-medium">{{ data.title }}</span>
          </div>
          <div>
            <span class="text-gray-600">描述：</span>
            <span class="font-medium">{{ data.description }}</span>
          </div>
          <div>
            <span class="text-gray-600">时间：</span>
            <span class="font-medium">{{ data.date }}</span>
          </div>
          <div>
            <span class="text-gray-600">优先级：</span>
            <span class="font-medium text-warning">{{ priorityMap[data.priority] }}</span>
          </div>
          <div v-if="data.category?.length">
            <span class="text-gray-600">类别：</span>

            <span class="font-medium mr-2" v-for="category in data.category">{{ category }}</span>
          </div>
        </div>
        <div class="button flex gap-4 mt-5 justify-between flex-wrap">
          <Button class="flex-1" @click="confirmAdd">确实添加</Button>
          <Button class="flex-1" @click="cancelAdd" variant="outline">取消</Button>
        </div>
      </div>

      <!-- 解析失败状态 -->
      <div v-if="parseStatus === 'error'" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="text-red-800 font-semibold mb-2 flex items-center">解析失败</h3>
        <p class="text-sm text-red-700 mb-3">
          {{ errorMessage }}
        </p>
        <Button @click="handleSubmit" variant="secondary" class="text-sm px-4 py-1 h-auto">
          重试解析
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
