<script setup lang="ts">
import ScheduleItem from './ScheduleItem.vue'
// import { useDateStore } from '@/stores/date'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import TagList from '../Tag/TagList.vue'
import { useRoute, useRouter } from 'vue-router'
import CalendarDrawer from '../CalendarDrawer.vue'
import { Button } from '../ui/button'
import { toast } from 'vue-sonner'
import type { PriorityLevel } from '@/types/schedule'
const router = useRouter()
const route = useRoute()

const scheduleStore = useScheduleStore()
const { scheduleData } = storeToRefs(scheduleStore)

const selectDateSchedule = computed(() => {
  return scheduleData.value || []
})

const events = computed(() => {
  let scheduleList = scheduleData.value
  // filter by date
  scheduleList = scheduleList.filter((e) => e.date === route.params.date)
  if (route.query.completed) {
    const isCompleted = route.query.completed === 'true'
    if (isCompleted) {
      scheduleList = scheduleList?.filter((e) => e.completed) || []
    } else {
      scheduleList = scheduleList?.filter((e) => !e.completed) || []
    }
  }
  // filter by priority
  if (route.query.priority) {
    const p = route.query.priority as 'high' | 'medium' | 'low'
    scheduleList = scheduleList?.filter((e) => e.priority === p) || []
  }
  // filter by tag
  if (route.query.tag) {
    const tag = route.query.tag
    scheduleList =
      scheduleList?.filter((e) => e.category && e.category.includes(tag as string)) || []
  }
  return scheduleList || []
})

const totalCount = computed(
  () => selectDateSchedule.value.filter((e) => e.date === route.params.date).length,
)
const completedCount = computed(
  () => selectDateSchedule.value.filter((e) => e.completed && e.date === route.params.date).length,
)

/* 
处理各种事件
*/

const handleToggleComplete = (id: string) => {
  scheduleStore.toggleScheduleData(route.params.date as string, id)
}

const handleEdit = (id: string) => {
  router.push({
    name: 'edit',
    params: {
      date: route.params.date as string,
      id,
    },
    query: {
      from: route.fullPath,
    },
  })
}
const handleDelete = (id: string) => {
  scheduleStore.deleteScheduleData(route.params.date as string, id)
  toast.success('删除成功')
}

const handleAddNew = () => {
  router.push({
    name: 'addSchedule',
    query: {
      date: route.params.date as string,
    },
  })
}

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

const showCompletedSchedule = () => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      completed: 'true',
    },
  })
}
const showUncompletedSchedule = () => {
  console.log(route)
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      completed: 'false',
    },
  })
}

// priority filter handlers
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
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="mb-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div class="flex flex-col gap-3 p-5 sm:p-6">
        <div class="flex items-center justify-between">
          <div class="flex gap-3">
            <span class="text-2xl sm:text-3xl font-bold text-gray-900">日程</span>
            <div class="md:hidden">
              <CalendarDrawer>
                <!-- <span>选择日期</span> -->
                <Button>{{ route.params.date }} </Button>
                <!-- <span
                  class="inline-flex cursor-pointer items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-black border border-gray-200"
                >
                </span> -->
              </CalendarDrawer>
            </div>
            <div class="hidden md:block">
              <span
                class="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-black border border-gray-200"
              >
                {{ route.params.date }}
              </span>
            </div>
            <!-- <span
              class="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-black border border-gray-200"
            >
              
                {{ route.params.date }}
              
            </span> -->
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
        <div class="pt-2">
          <TagList />
        </div>
      </div>
    </div>

    <div
      v-if="totalCount === 0"
      class="rounded-2xl bg-white py-14 text-center shadow-sm ring-1 ring-gray-100"
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
      v-else-if="totalCount !== 0 && events.length === 0"
      class="rounded-2xl bg-white py-14 text-center shadow-sm ring-1 ring-gray-100"
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

    <div v-else class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div class="divide-y divide-gray-100">
        <div class="p-4 sm:p-5" v-for="ev in events" :key="ev.id">
          <ScheduleItem
            :event="ev"
            @toggle-complete="handleToggleComplete"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
