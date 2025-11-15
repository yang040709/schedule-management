<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar'
// import { useDateStore } from '@/stores/date'
import { useRoute } from 'vue-router'
import { parseDate } from '@internationalized/date'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const hanldeUpdate = (date: any) => {
  /* 
  防止date为未定义，从而报错
  */
  if (!date) {
    return
  }
  router.push({
    name: 'calendar',
    params: {
      date: date.toString(),
    },
  })
}

const modelValue = computed(() => {
  return parseDate(route.params.date as string)
})
</script>

<template>
  <Calendar
    id="app-calendar"
    :model-value="modelValue"
    @update:model-value="hanldeUpdate"
    :weekday-format="'short'"
    class="bg-white rounded-md border shadow-sm"
  />
</template>
