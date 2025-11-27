<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar'
import { useRoute } from 'vue-router'
import { fromDate, getLocalTimeZone, parseDate } from '@internationalized/date'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const handleUpdate = (date: any) => {
  if (!date) {
    return
  }
  router.push({
    name: 'calendar',
    params: {
      date: date.toString().substring(0, 10)
    },
  })
}

const modelValue = computed(() => {
  return fromDate(new Date(route.params.date as string), getLocalTimeZone())
})
</script>

<template>
  <div id="app-calendar">
    <Calendar :model-value="modelValue" @update:model-value="handleUpdate" :weekday-format="'short'"
      class="bg-white rounded-md border shadow-sm" />
  </div>
</template>
