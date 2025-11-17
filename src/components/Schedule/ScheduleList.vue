<script setup lang="ts">
import ScheduleItem from './ScheduleItem.vue'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '../ui/button'
import { toast } from 'vue-sonner'
import type { PriorityLevel, ScheduleStatus } from '@/types/schedule'
import { useAddModelStore } from '@/stores/addModel'
import { cloneDeep } from 'lodash-es'
import type { ScheduleListQuery, ScheduleListResponse } from '@/types/schedule'
import { ref } from 'vue'
import {
  getScheduleListApi,
  deleteScheduleApi,
  getAISuggestApi,
  modifyScheduleApi,
} from '@/api/schedule'
import { useFetchData } from '@/hooks/useFetchData'
import { getTodayDate } from '@/utils/date'
import { useEditModelStore } from '@/stores/editModel'
import { getScheduleInitialData } from '@/constant'
import eventBus from '@/utils/eventBus'

const router = useRouter()
const route = useRoute()
const addModelStore = useAddModelStore()
const editModelStore = useEditModelStore()

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
  // interface
  const statusList: (ScheduleStatus | undefined)[] = ['done', 'pending', 'expired', 'canceled']
  let status: ScheduleStatus | undefined = undefined
  let index = statusList.indexOf(status)
  if (index !== -1 && statusList[index]) {
    status = statusList[index]
  }
  const priorityList: (PriorityLevel | undefined)[] = ['high', 'medium', 'low']
  let priority: PriorityLevel | undefined = undefined
  index = priorityList.indexOf(priority)
  if (index !== -1 && priorityList[index]) {
    priority = priorityList[index]
  }
  return {
    status,
    priority,
    date: route.params.date?.toString() || getTodayDate(),
  }
}

const query = ref<ScheduleListQuery>(makeQuery())

/* 
获取日程列表
*/
const { data, fetchData, loading } = useFetchData(getScheduleListApi, [query], initialVal)
fetchData()

/* 
监听路由参数变化，重新获取数据
*/
watch([() => route.params.date, () => route.query.status, () => route.query.priority], (params) => {
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

/*
处理各种事件
*/
const handleToggleComplete = async (id: string) => {
  const item = data.value.data.find((e) => e.id === id)

  if (!item) {
    console.error('未找到该日程')
    return
  }
  if (item.status === 'pending' || item.status === 'expired') {
    item.status = 'done'
  } else if (item.status === 'done') {
    item.status = 'pending'
  }
  /* 
    发送修改的请求
  */
  const { fetchData: modifyScheduleFetchData } = useFetchData(modifyScheduleApi, [id, item], {
    schedule: getScheduleInitialData(),
  })
  await modifyScheduleFetchData()
}

/* 
    处理编辑事件
*/
const handleEdit = (id: string) => {
  const item = data.value.data.find((e) => e.id === id)
  if (item) {
    editModelStore.editModelOpen = true
    editModelStore.editModelInfo = cloneDeep(item)
  } else {
    console.error('未找到该日程')
  }
}

/* 
    处理删除事件
*/
const handleDelete = async (id: string) => {
  const { fetchData: deleteScheduleFetchData } = useFetchData(deleteScheduleApi, [id], undefined)
  try {
    await deleteScheduleFetchData()
    toast.success('删除成功')
    fetchData()
  } catch (error) {
    toast.error('删除失败')
  }
}

/* 
  处理添加新日程事件
*/
const handleAddNew = () => {
  addModelStore.addModelOpen = true
  if (route.params.date) {
    addModelStore.addModelInfo.date = route.params.date.toString()
  }
}

/* 
  处理显示所有日程事件
*/
const showAllSchedule = () => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      completed: undefined,
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
  console.log(route)
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

/* 
  处理生成AI建议事件，就是生成行动建议
*/
const generateAISuggest = async (id: string) => {
  const item = data.value.data.find((e) => e.id === id)
  if (!item) {
    console.error('未找到该日程')
    return
  }
  const { data: suggest, fetchData: fetchSuggestion } = useFetchData(getAISuggestApi, [id], {
    suggestion: '',
  })
  const { data: modifiedSchedule, fetchData: modifySchedule } = useFetchData(
    modifyScheduleApi,
    [
      id,
      () => ({
        AIsuggestion: suggest.value.suggestion,
      }),
    ],
    {
      schedule: getScheduleInitialData(),
    },
  )
  await fetchSuggestion()
  await modifySchedule()
  // await fetchData()
  item.AIsuggestion = suggest.value.suggestion
}
/* 
  处理清除AI建议事件，就是清除行动建议
*/
const removeAISuggest = async (id: string) => {
  const item = data.value.data.find((e) => e.id === id)
  if (!item) {
    console.error('未找到该日程')
    return
  }
  const { fetchData: modifySchedule } = useFetchData(
    modifyScheduleApi,
    [
      id,
      {
        AIsuggestion: '',
      },
    ],
    undefined,
  )
  await modifySchedule()
  item.AIsuggestion = undefined
}
</script>

<template>
  <div class="w-full max-w-[800px]">
    <div class="mb-6 rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
      <div class="flex flex-col gap-3 p-5 sm:p-6">
        <div class="flex items-center justify-between">
          <div class="flex gap-3">
            <span class="text-2xl sm:text-3xl font-bold text-gray-900">日程</span>
            <div class="flex items-center">
              <a
                href="#app-calendar"
                class="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-black border border-gray-200"
              >
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
            @click="showAllSchedule"
            :class="!route.query.completed ? 'outline-1 outline-gray-300 bg-gray-200' : ''"
            >共 {{ totalCount }} 个</span
          >
          <span
            class="inline-flex items-center rounded-md bg-green-100 text-green-700 px-2 py-1 cursor-pointer hover:bg-green-200 transition-colors"
            @click="showCompletedSchedule"
            :class="
              route.query.completed === 'true' ? 'outline-1 outline-green-300 bg-green-200' : ''
            "
            >已完成 {{ completedCount }}</span
          >
          <span
            class="inline-flex items-center rounded-md bg-yellow-100 text-yellow-800 px-2 py-1 cursor-pointer hover:bg-yellow-200 transition-colors"
            @click="showUncompletedSchedule"
            :class="
              route.query.completed === 'false' ? 'outline-1 outline-yellow-300 bg-yellow-200' : ''
            "
            >未完成 {{ totalCount - completedCount }}</span
          >
          <!-- priority filters -->
          <!-- <span class="mx-1 h-4 w-px bg-gray-200"></span> -->
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span class="text-gray-500 w-12">优先级</span>
          <span
            class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
            @click="clearPriority"
            :class="!route.query.priority ? 'outline-1 outline-gray-300 bg-gray-200' : ''"
            >全部</span
          >
          <span
            class="inline-flex items-center rounded-md bg-red-100 text-red-700 px-2 py-1 cursor-pointer hover:bg-red-200 transition-colors"
            @click="setPriority('high')"
            :class="route.query.priority === 'high' ? 'outline-1 outline-red-300 bg-red-200' : ''"
            >高</span
          >
          <span
            class="inline-flex items-center rounded-md bg-amber-100 text-amber-700 px-2 py-1 cursor-pointer hover:bg-amber-200 transition-colors"
            @click="setPriority('medium')"
            :class="
              route.query.priority === 'medium' ? 'outline-1 outline-amber-300 bg-amber-200' : ''
            "
            >中</span
          >
          <span
            class="inline-flex items-center rounded-md bg-emerald-100 text-emerald-700 px-2 py-1 cursor-pointer hover:bg-emerald-200 transition-colors"
            @click="setPriority('low')"
            :class="
              route.query.priority === 'low' ? 'outline-1 outline-emerald-300 bg-emerald-200' : ''
            "
            >低</span
          >
        </div>
        <!-- <div class="pt-2">
          <TagList />
        </div> -->
      </div>
    </div>

    <div
      v-if="totalCount === 0"
      class="rounded-2xl bg-white py-14 border text-center shadow-sm ring-1 ring-gray-100"
    >
      <div class="mx-auto w-full max-w-sm px-6">
        <h3 class="text-lg font-semibold text-gray-900">今天还没有日程</h3>
        <p class="mt-2 text-sm text-gray-600">
          为 {{ route.params.date }} 添加你的第一个日程，开始高效的一天。
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 active:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            @click="handleAddNew"
          >
            新增日程
          </button>
        </div>
      </div>
    </div>
    <div
      v-else-if="totalCount !== 0 && data.data.length === 0"
      class="rounded-2xl bg-white border py-14 text-center shadow-sm ring-1 ring-gray-100"
    >
      <div class="mx-auto w-full max-w-sm px-6">
        <h3 class="text-lg font-semibold text-gray-900">当前筛选条件还没有日程</h3>
        <p class="mt-2 text-sm text-gray-600">
          为 {{ route.params.date }} 添加你的日程，开始高效的一天。
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 active:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            @click="handleAddNew"
          >
            新增日程
          </button>
        </div>
      </div>
    </div>

    <div v-else class="rounded-2xl bg-white shadow-sm border ring-1 ring-gray-100">
      <div class="divide-y divide-gray-100">
        <div class="p-4 sm:p-5" v-for="ev in data.data" :key="ev.id">
          <ScheduleItem
            :item="ev"
            @toggle-complete="handleToggleComplete"
            @edit="handleEdit"
            @delete="handleDelete"
            @generate-ai-suggest="generateAISuggest"
            @remove-ai-suggest="removeAISuggest"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
