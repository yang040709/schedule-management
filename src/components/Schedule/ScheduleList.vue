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
const scheduleStore = useScheduleStore()
const { scheduleData } = storeToRefs(scheduleStore)
const router = useRouter()
const route = useRoute()
// const dateStore = useDateStore()
// console.log(dateStore.selectDate)

const events = computed(() => {
  return scheduleData.value[route.params.date as string] || []
})
const totalCount = computed(() => events.value.length)
const completedCount = computed(() => events.value.filter((e) => e.completed).length)

const handleToggleComplete = (id: string) => {
  scheduleStore.toggleScheduleData(route.params.date as string, id)
}

const handleItemClick = (id: string) => {
  console.log('item click', id)
}

const handleEdit = (id: string) => {
  console.log('edit', id)
  router.push({
    name: 'edit',
    params: {
      date: route.params.date as string,
      id,
    },
  })
}
const handleDelete = (id: string) => {
  console.log('delete', id)
  scheduleStore.deleteScheduleData(route.params.date as string, id)
}

const handleAddNew = () => {
  router.push('/add-schedule')
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
          <!-- <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="handleAddNew"
          >
            新增日程
          </button> -->
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1"
            >共 {{ totalCount }} 个</span
          >
          <span class="inline-flex items-center rounded-md bg-green-100 text-green-700 px-2 py-1"
            >已完成 {{ completedCount }}</span
          >
          <span class="inline-flex items-center rounded-md bg-yellow-100 text-yellow-800 px-2 py-1"
            >未完成 {{ totalCount - completedCount }}</span
          >
        </div>
        <div class="pt-2">
          <TagList />
        </div>
      </div>
    </div>

    <div
      v-if="events.length === 0"
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

    <div v-else class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div class="divide-y divide-gray-100">
        <div class="p-4 sm:p-5" v-for="ev in events" :key="ev.id">
          <ScheduleItem
            :event="ev"
            @toggle-complete="handleToggleComplete"
            @click="handleItemClick"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
