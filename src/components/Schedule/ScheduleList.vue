<script setup lang="ts">
import ScheduleItem from './ScheduleItem.vue'
import { computed, TransitionGroup, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '../ui/button'
import type { PriorityLevel, Schedule, ScheduleStatus } from '@/types/schedule'
import type { ScheduleListQuery, ScheduleListResponse } from '@/types/schedule'
import { ref } from 'vue'
import {
  getScheduleListApi,
} from '@/api/schedule'
import { useFetchData } from '@/hooks/useFetchData'
import { getTodayDate } from '@/utils/date'
import eventBus from '@/utils/eventBus'
import { useScheduleList } from '@/hooks/useScheduleList'

const router = useRouter()
const route = useRoute()

/* 
  如果模态窗有事件，就重新获取数据
*/
eventBus.on('add-schedule', () => {
  fetchData()
})
eventBus.on('edit-schedule', () => {
  fetchData()
})

const initialVal: ScheduleListResponse = {
  total: 0,
  data: [],
}

const makeQuery: () => ScheduleListQuery = () => {
  return {
    date: route.params.date?.toString().substring(0, 10) || getTodayDate(),
  }
}

const query = ref<ScheduleListQuery>(makeQuery())

const taskDependencies = ref<Map<string, Schedule[]>>(new Map())

// 当获取到任务列表时，构建依赖关系
const buildTaskDependencies = (tasks: Schedule[]) => {
  // 初始化所有任务的子任务列表
  tasks.forEach((task) => {
    taskDependencies.value.set(task.id, [])
  })

  // 填充依赖关系
  tasks.forEach((task) => {
    if (task.dependentSchedule) {
      const parentId = task.dependentSchedule.id
      if (taskDependencies.value.has(parentId)) {
        taskDependencies.value.get(parentId)!.push(task)
      }
    }
  })
}


/* 
获取日程列表
*/
const { data, fetchData, loading } = useFetchData(getScheduleListApi, [query], initialVal, {
  afterSuccessFetchData: () => {
    /* 
      构建任务依赖关系
    */
    buildTaskDependencies(data.value.data)
  },
})

const date = ref(route.params.date?.toString() || getTodayDate())


const selectStatus = ref<ScheduleStatus | undefined>(route.query.status as ScheduleStatus | undefined)
const selectPriority = ref<PriorityLevel | undefined>(route.query.priority as PriorityLevel | undefined)


fetchData()

const {
  handleToggleComplete,
  handleEdit,
  handleDelete,
  handleAddNew,
  generateAISuggest,
  removeAISuggest,
  handleCancel,
} = useScheduleList(data, fetchData, taskDependencies, date)

/* 
监听路由参数变化，重新获取数据
*/
watch([() => route.query.status, () => route.query.priority], (params) => {
  selectStatus.value = route.query.status as ScheduleStatus | undefined || undefined
  selectPriority.value = route.query.priority as PriorityLevel | undefined || undefined
})


/* 
如果路由日期变化，就更新日期
*/
watch(() => route.params.date, (newDate) => {
  date.value = newDate?.toString() || getTodayDate()
  query.value = makeQuery()
  fetchData()
})

/* 
计算日程总数
*/
const totalCount = computed(() => data.value.data.length)
const completedCount = computed(() => {
  return data.value.data.filter((e) => e.status === 'done').length
})
const uncompletedCount = computed(() => {
  return data.value.data.filter((e) => e.status === 'pending').length
})

/* 
  处理显示所有日程事件
*/
const showAllSchedule = () => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      status: undefined,
    },
  })
}

/* 
  处理显示已完成日程事件
*/
const showCompletedSchedule = () => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      status: 'done',
    },
  })
}

/* 
  处理显示未完成日程事件
*/
const showUncompletedSchedule = () => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      status: 'pending',
    },
  })
}

/* 
  处理清除优先级筛选事件,就是展示全部
*/
const clearPriority = () => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      priority: undefined,
    },
  })
}
/* 
  处理设置优先级筛选事件
*/
const setPriority = (priority: PriorityLevel) => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      priority,
    },
  })
}


const finalList = computed(() => {
  /* 
    筛选出符合优先级和状态的日程
  */
  return data.value.data.filter((e) => {
    return (selectStatus.value === undefined || e.status === selectStatus.value) &&
      (selectPriority.value === undefined || e.priority === selectPriority.value)
  })
})

</script>

<template>
  <div class="w-full">
    <div class="mb-6 rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
      <div class="flex flex-col gap-3 p-5 sm:p-6">
        <div class="flex items-center justify-between">
          <div class="flex gap-3">
            <span class="text-2xl sm:text-3xl font-bold text-gray-900">日程</span>
            <div class="flex items-center">
              <a href="#app-calendar"
                class="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-black border border-gray-200">
                {{ route.params.date }}
              </a>
            </div>
          </div>

          <Button @click="handleAddNew" variant="outline"> 新增日程 </Button>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span class="text-gray-500 w-12">概况</span>
          <span
            class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
            @click="showAllSchedule" :class="!route.query.status ? 'outline-1 outline-gray-300 bg-gray-200' : ''">共
            {{ totalCount }} 个</span>
          <span
            class="inline-flex items-center rounded-md bg-green-100 text-green-700 px-2 py-1 cursor-pointer hover:bg-green-200 transition-colors"
            @click="showCompletedSchedule" :class="route.query.status === 'done' ? 'outline-1 outline-green-300 bg-green-200' : ''
              ">已完成 {{ completedCount }}</span>
          <span
            class="inline-flex items-center rounded-md bg-yellow-100 text-yellow-800 px-2 py-1 cursor-pointer hover:bg-yellow-200 transition-colors"
            @click="showUncompletedSchedule" :class="route.query.status === 'pending' ? 'outline-1 outline-yellow-300 bg-yellow-200' : ''
              ">未完成 {{ uncompletedCount }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span class="text-gray-500 w-12">优先级</span>
          <span
            class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
            @click="clearPriority"
            :class="!route.query.priority ? 'outline-1 outline-gray-300 bg-gray-200' : ''">全部</span>
          <span
            class="inline-flex items-center rounded-md bg-red-100 text-red-700 px-2 py-1 cursor-pointer hover:bg-red-200 transition-colors"
            @click="setPriority('high')"
            :class="route.query.priority === 'high' ? 'outline-1 outline-red-300 bg-red-200' : ''">高</span>
          <span
            class="inline-flex items-center rounded-md bg-amber-100 text-amber-700 px-2 py-1 cursor-pointer hover:bg-amber-200 transition-colors"
            @click="setPriority('medium')" :class="route.query.priority === 'medium' ? 'outline-1 outline-amber-300 bg-amber-200' : ''
              ">中</span>
          <span
            class="inline-flex items-center rounded-md bg-emerald-100 text-emerald-700 px-2 py-1 cursor-pointer hover:bg-emerald-200 transition-colors"
            @click="setPriority('low')" :class="route.query.priority === 'low' ? 'outline-1 outline-emerald-300 bg-emerald-200' : ''
              ">低</span>
        </div>
      </div>
    </div>
    <!-- <Transition name="page-fade" mode="out-in"> -->
    <!-- <div v-if="loading && data.data.length === 0">
      <Skeleton :count="5" height="h-8" />
    </div> -->
    <div v-if="finalList.length === 0">
      <div v-if="totalCount === 0" key="empty"
        class="rounded-2xl bg-white py-14 border text-center shadow-sm ring-1 ring-gray-100">
        <div class="mx-auto w-full max-w-sm px-6">
          <h3 class="text-lg font-semibold text-gray-900">今天还没有日程</h3>
          <p class="mt-2 text-sm text-gray-600">
            为 {{ route.params.date }} 添加你的第一个日程，开始高效的一天。
          </p>
          <div class="mt-6">
            <button type="button"
              class="inline-flex w-full justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 active:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
              @click="handleAddNew">
              新增日程
            </button>
          </div>
        </div>
      </div>
      <div v-else key="filtered-empty"
        class="rounded-2xl bg-white border py-14 text-center shadow-sm ring-1 ring-gray-100">
        <div class="mx-auto w-full max-w-sm px-6">
          <h3 class="text-lg font-semibold text-gray-900">当前筛选条件还没有日程</h3>
          <p class="mt-2 text-sm text-gray-600">
            为 {{ route.params.date }} 添加你的日程，开始高效的一天。
          </p>
          <div class="mt-6">
            <button type="button"
              class="inline-flex w-full justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 active:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
              @click="handleAddNew">
              新增日程
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else key="schedule-list" class="rounded-2xl bg-white shadow-sm border ring-1 ring-gray-100">
      <TransitionGroup name="list" tag="div">
        <div class="p-4 sm:p-5" v-for="ev in finalList" :key="ev.id">
          <ScheduleItem :item="ev" @toggle-complete="handleToggleComplete" @edit="handleEdit" @delete="handleDelete"
            @generate-ai-suggest="generateAISuggest" @remove-ai-suggest="removeAISuggest" @cancel="handleCancel" />
        </div>
      </TransitionGroup>
    </div>
    <!-- </Transition> -->
  </div>
</template>

<style scoped>
/* 确保容器有相对定位，为绝对定位的子元素提供参考 */
.rounded-2xl {
  position: relative;
}
</style>
