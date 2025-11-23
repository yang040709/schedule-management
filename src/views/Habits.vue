<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Calendar, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type {
  Habit,
  HabitForm,
  CheckInForm,
  Achievement,
  ModifyHabitForm,
  TodayHabit,
  AllStats,
} from '@/types/habit'
import {
  getTodayHabitsApi,
  getHabitsApi,
  addHabitApi,
  checkInHabitApi,
  getAchievementsApi,
  modifyHabitApi,
  deleteHabitApi,
  cancelCheckInHabitApi,
  getAllStatsApi,
} from '@/api/habit'

import { habitFormSchema, type HabitFormInput } from '@/utils/validation'

// 导入组件
import HabitCard from '@/components/habit/HabitCard.vue'
import StatsCards from '@/components/habit/StatsCards.vue'
import AchievementsList from '@/components/habit/AchievementsList.vue'
import HabitsList from '@/components/habit/HabitsList.vue'
import { toast } from 'vue-sonner'

// 响应式数据
const achievements = ref<Achievement[]>([])
const loading = ref(false)
const formErrors = ref<Record<string, string>>({})

const allStats = ref<AllStats>({
  totalCheckedIn: 0,
  avgSuccessRate: 0,
})

// 消息提示管理
const showMessage = (message: string, type: 'success' | 'error') => {
  if (type === 'success') {
    toast.success(message)
  } else {
    toast.error(message)
  }
}

// 统一数据刷新策略
const fetchData = async () => {
  loading.value = true
  try {
    // 并行获取所有必要数据，避免重复请求
    const [todayRes, habitsRes, achievementsRes, statsRes] = await Promise.all([
      getTodayHabitsApi(),
      getHabitsApi({ page: listPageInfo.value.page, pageSize: listPageInfo.value.pageSize }),
      getAchievementsApi(),
      getAllStatsApi(),
    ])

    todayHabits.value = todayRes.habits
    habitsList.value = habitsRes.data
    listPageInfo.value.total = habitsRes.total
    achievements.value = achievementsRes.achievements
    allStats.value = {
      totalCheckedIn: statsRes.totalCheckedIn,
      avgSuccessRate: statsRes.avgSuccessRate,
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    showMessage('获取数据失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

// 验证表单
const validateForm = (formData: HabitFormInput) => {
  formErrors.value = {}
  try {
    const result = habitFormSchema.parse(formData)
    console.log(result)
    return true
  } catch (error: any) {
    const messageList = JSON.parse(error.message)
    if (messageList.length > 0) {
      messageList.forEach((message: any) => {
        formErrors.value[message.path.join('.')] = message.message
      })
    }
    return false
  }
}

/* 
新增习惯的相关逻辑
*/
function useAddHabit() {
  const showAddDialog = ref(false)
  // 添加新的习惯的表单
  const newHabit = ref<HabitForm>({
    title: '',
    description: '',
    goal: {
      targetDays: 30,
      durationMinutes: 30,
    },
    frequency: 'daily',
    category: [],
  })
  // 添加新习惯
  const addHabit = async () => {
    if (!validateForm(newHabit.value as HabitFormInput)) return
    try {
      await addHabitApi(newHabit.value)
      showAddDialog.value = false
      // 重置表单
      newHabit.value = {
        title: '',
        description: '',
        goal: {
          targetDays: 30,
          durationMinutes: 30,
        },
        frequency: 'daily',
        category: [],
      }
      formErrors.value = {}
      // 重新获取数据
      await fetchData()
      showMessage('习惯添加成功', 'success')
    } catch (error) {
      console.error('添加习惯失败:', error)
      showMessage('添加习惯失败，请稍后重试', 'error')
    }
  }
  return { showAddDialog, newHabit, addHabit }
}

const { showAddDialog, newHabit, addHabit } = useAddHabit()

/* 
今日逻辑，及其打卡，取消打卡
*/
function useTodayHabit() {
  const todayHabits = ref<TodayHabit[]>([])
  // 打卡习惯
  const checkInHabitWithForm = async (form: CheckInForm) => {
    try {
      await checkInHabitApi(form)
      // 重新获取今日习惯
      const todayRes = await getTodayHabitsApi()
      todayHabits.value = todayRes.habits
      // 重新获取所有习惯统计信息
      await fetchAllStats()
    } catch (error) {
      console.error('打卡失败:', error)
    }
  }

  const cancelCheckInHabit = async (habitId: string) => {
    try {
      await cancelCheckInHabitApi(habitId)
      // 重新获取今日习惯
      const todayRes = await getTodayHabitsApi()
      todayHabits.value = todayRes.habits
      // 重新获取所有习惯统计信息
      await fetchAllStats()
    } catch (error) {
      console.error('取消打卡失败:', error)
    }
  }
  return {
    todayHabits,
    checkInHabitWithForm,
    cancelCheckInHabit,
  }
}

const { todayHabits, checkInHabitWithForm, cancelCheckInHabit } = useTodayHabit()

/* 
  编辑习惯
*/
function useEditHabit() {
  const showEditDialog = ref(false)
  // 当前编辑的习惯
  const editingHabit = ref<Habit | null>(null)

  // 编辑习惯表单
  const editHabit = ref<ModifyHabitForm>({
    title: '',
    description: '',
    goal: {
      targetDays: 30,
      durationMinutes: 30,
    },
    frequency: 'daily',
    category: [],
  })

  // 编辑习惯
  const editHabitAction = (habit: Habit) => {
    editingHabit.value = habit
    editHabit.value = {
      title: habit.title,
      description: habit.description,
      goal: {
        targetDays: habit.goal.targetDays,
        durationMinutes: habit.goal.durationMinutes,
      },
      frequency: habit.frequency,
      category: habit.category || [],
    }
    showEditDialog.value = true
  }

  // 更新习惯
  const updateHabit = async () => {
    if (!editingHabit.value) return
    if (!validateForm(editHabit.value as HabitFormInput)) return

    try {
      await modifyHabitApi(editingHabit.value.id, editHabit.value)
      showEditDialog.value = false
      editingHabit.value = null
      formErrors.value = {}
      // 重新获取数据
      await fetchData()
    } catch (error) {
      console.error('更新习惯失败:', error)
    }
  }
  return {
    editHabitAction,
    updateHabit,
    showEditDialog,
    editHabit,
    editingHabit,
  }
}
const { updateHabit, showEditDialog, editHabit, editingHabit, editHabitAction } = useEditHabit()

/* 
删除习惯
 */
function useDeleteHabit() {
  // 删除习惯确认对话框状态
  const showDeleteDialog = ref(false)
  const deletingHabitId = ref<string | null>(null)

  // 打开删除确认对话框
  const openDeleteDialog = (habitId: string) => {
    deletingHabitId.value = habitId
    showDeleteDialog.value = true
  }

  // 删除习惯
  const deleteHabit = async () => {
    if (!deletingHabitId.value) return

    try {
      await deleteHabitApi(deletingHabitId.value)
      showDeleteDialog.value = false
      deletingHabitId.value = null
      // 重新获取数据
      await fetchData()
    } catch (error) {
      console.error('删除习惯失败:', error)
    } finally {
      showDeleteDialog.value = false
      deletingHabitId.value = null
    }
  }
  return { deleteHabit, showDeleteDialog, deletingHabitId, openDeleteDialog }
}
const { deleteHabit, showDeleteDialog, deletingHabitId, openDeleteDialog } = useDeleteHabit()

/* 
获取习惯的列表数据
*/
function useHabitList() {
  const habitsList = ref<Habit[]>([])
  const listPageInfo = ref({
    page: 1,
    pageSize: 3,
    total: 0,
  })

  const onPageChange = async (page: number) => {
    listPageInfo.value.page = page
    try {
      const habitsRes = await getHabitsApi({
        page: listPageInfo.value.page,
        pageSize: listPageInfo.value.pageSize,
      })
      habitsList.value = habitsRes.data
      listPageInfo.value.total = habitsRes.total
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }
  return { habitsList, listPageInfo, onPageChange }
}

const { habitsList, listPageInfo, onPageChange } = useHabitList()

/* 
获取统计信息
*/
function useStates() {
  const fetchAllStats = async () => {
    try {
      const { totalCheckedIn, avgSuccessRate } = await getAllStatsApi()
      allStats.value = { totalCheckedIn, avgSuccessRate }
    } catch (error) {
      console.error('获取所有习惯统计信息失败:', error)
      return
    }
  }

  // 计算统计信息
  const stats = computed(() => {
    const completedTodayHabits = todayHabits.value.filter((h) => h.completed).length
    return {
      todayHabits: todayHabits.value.length,
      completedTodayHabits,
      totalCheckedIn: allStats.value.totalCheckedIn,
      avgSuccessRate: allStats.value.avgSuccessRate,
    }
  })
  return { stats, fetchAllStats }
}

const { stats, fetchAllStats } = useStates()

fetchData()
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <!-- 页面标题
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">习惯追踪</h1>
      <p class="text-gray-600 mt-2">培养好习惯，成就更好的自己</p>
    </div> -->

    <!-- 统计卡片 -->
    <StatsCards :stats="stats" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：今日习惯 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">今日习惯</h2>
              <Button @click="showAddDialog = true" class="bg-blue-600 hover:bg-blue-700">
                <Plus class="mr-2" />
                添加习惯
              </Button>
            </div>
          </div>

          <div class="p-6">
            <div v-if="loading" class="text-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
              ></div>
              <p class="text-gray-500 mt-2">加载中...</p>
            </div>

            <div v-else-if="todayHabits.length === 0" class="text-center py-8">
              <!-- <div class="i-lucide-calendar text-4xl text-gray-300 mx-auto mb-4"></div> -->
              <Calendar />
              <p class="text-gray-500">今日没有需要完成的习惯</p>
              <Button @click="showAddDialog = true" variant="outline" class="mt-4">
                开始添加第一个习惯
              </Button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HabitCard
                v-for="habit in todayHabits"
                :key="habit.id"
                :habit="habit"
                :on-edit="editHabitAction"
                :on-delete="openDeleteDialog"
                :on-cancel-check-in="cancelCheckInHabit"
                @check-in="checkInHabitWithForm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：成就和所有习惯 -->
      <div class="space-y-6">
        <!-- 成就展示 -->
        <AchievementsList :achievements="achievements" />
        <!-- 所有习惯 -->
        <HabitsList @page-change="onPageChange" :habits="habitsList" :pagination="listPageInfo" />
      </div>
    </div>

    <!-- 添加习惯对话框 -->
    <Dialog v-model:open="showAddDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新习惯</DialogTitle>
        </DialogHeader>
        <DialogDescription class="sr-only"> 添加新习惯 </DialogDescription>

        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="habits-add-title">习惯名称</Label>
            <Input
              id="habits-add-title"
              v-model="newHabit.title"
              placeholder="例如：晨跑、阅读、冥想..."
              :class="formErrors.title ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.title" class="text-sm text-red-500">{{ formErrors.title }}</p>
          </div>

          <div class="space-y-2">
            <Label for="habits-add-description">习惯描述</Label>
            <Textarea
              id="habits-add-description"
              v-model="newHabit.description"
              placeholder="描述这个习惯..."
              rows="3"
              :class="formErrors.description ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.description" class="text-sm text-red-500">
              {{ formErrors.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="habits-add-frequency">频率</Label>
              <Select v-model="newHabit.frequency">
                <SelectTrigger :class="formErrors.frequency ? 'border-red-500' : ''">
                  <SelectValue placeholder="选择频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="formErrors.frequency" class="text-sm text-red-500">
                {{ formErrors.frequency }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="habits-add-duration">每次时长(分钟)</Label>
              <Input
                id="habits-add-duration"
                v-model.number="newHabit.goal.durationMinutes"
                type="number"
                min="1"
                :class="formErrors['goal.durationMinutes'] ? 'border-red-500' : ''"
              />
              <p v-if="formErrors['goal.durationMinutes']" class="text-sm text-red-500">
                {{ formErrors['goal.durationMinutes'] }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="habits-add-targetDays">目标天数</Label>
            <Input
              id="habits-add-targetDays"
              v-model.number="newHabit.goal.targetDays"
              type="number"
              min="1"
              :class="formErrors['goal.targetDays'] ? 'border-red-500' : ''"
            />
            <p v-if="formErrors['goal.targetDays']" class="text-sm text-red-500">
              {{ formErrors['goal.targetDays'] }}
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showAddDialog = false">取消</Button>
          <Button @click="addHabit">添加</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 编辑习惯对话框 -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑习惯</DialogTitle>
        </DialogHeader>
        <DialogDescription class="sr-only"> 请修改习惯的相关信息 </DialogDescription>

        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="habits-edit-title">习惯名称</Label>
            <Input
              id="habits-edit-title"
              v-model="editHabit.title"
              placeholder="例如：晨跑、阅读、冥想..."
              :class="formErrors.title ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.title" class="text-sm text-red-500">{{ formErrors.title }}</p>
          </div>

          <div class="space-y-2">
            <Label for="habits-edit-description">习惯描述</Label>
            <Textarea
              id="habits-edit-description"
              v-model="editHabit.description"
              placeholder="描述这个习惯..."
              rows="3"
              :class="formErrors.description ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.description" class="text-sm text-red-500">
              {{ formErrors.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="habits-edit-frequency">频率</Label>
              <Select v-model="editHabit.frequency">
                <SelectTrigger :class="formErrors.frequency ? 'border-red-500' : ''">
                  <SelectValue placeholder="选择频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="formErrors.frequency" class="text-sm text-red-500">
                {{ formErrors.frequency }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="habits-edit-duration">每次时长(分钟)</Label>
              <Input
                id="habits-edit-duration"
                v-model.number="editHabit.goal.durationMinutes"
                type="number"
                min="1"
                :class="formErrors['goal.durationMinutes'] ? 'border-red-500' : ''"
              />
              <p v-if="formErrors['goal.durationMinutes']" class="text-sm text-red-500">
                {{ formErrors['goal.durationMinutes'] }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="habits-edit-targetDays">目标天数</Label>
            <Input
              id="habits-edit-targetDays"
              v-model.number="editHabit.goal.targetDays"
              type="number"
              min="1"
              :class="formErrors['goal.targetDays'] ? 'border-red-500' : ''"
            />
            <p v-if="formErrors['goal.targetDays']" class="text-sm text-red-500">
              {{ formErrors['goal.targetDays'] }}
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showEditDialog = false">取消</Button>
          <Button @click="updateHabit">更新</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 删除习惯确认对话框 -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>删除习惯</DialogTitle>
        </DialogHeader>
        <DialogDescription class="sr-only"> 删除习惯 </DialogDescription>

        <div class="py-4">
          <p class="text-gray-700">确定要删除这个习惯吗？此操作不可撤销。</p>
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showDeleteDialog = false">取消</Button>
          <Button @click="deleteHabit" variant="destructive">删除</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

/* 自定义图标样式 */
.i-lucide-plus::before {
  content: '+';
}
</style>
