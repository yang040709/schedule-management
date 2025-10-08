<script setup lang="ts">
import { Calendar } from "@/components/ui/calendar"
import { useDateStore } from '@/stores/date';

const dateStore = useDateStore();

</script>

<template>
  <Calendar v-model="dateStore.selectDate" :weekday-format="'short'" class="bg-white rounded-md border" />
</template>