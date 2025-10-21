<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useScheduleStore } from '@/stores/schedule'
import type { ScheduleEvent } from '@/types/schedule'
const scheduleStore = useScheduleStore()

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

/* 
export interface ScheduleEvent {
  id: string // 唯一标识符
  title: string // 标题
  description?: string // 可选字段，使用?
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  priority: PriorityLevel // 优先级
  category?: string[] // 分类支持多个标签
  completed: boolean // 完成状态
  date: string
}
*/

interface TableField {
  text: string
  value: keyof ScheduleEvent
}

const header: TableField[] = [
  { text: 'ID', value: 'id' },
  { text: '完成状态', value: 'completed' },
  { text: '标题', value: 'title' },
  { text: '日期', value: 'date' },
  { text: '优先级', value: 'priority' },
  { text: '分类', value: 'category' },
  { text: '开始时间', value: 'startTime' },
  { text: '结束时间', value: 'endTime' },
]
</script>

<template>
  <div class="bg-white px-8 py-2">
    <p class="my-2 font-bold text-gray-700">日程表格</p>
    <Table>
      <!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
      <TableHeader>
        <TableRow>
          <TableHead v-for="item in header" :key="item.text" class="w-[100px]">
            {{ item.text }}
          </TableHead>
          <!-- <TableHead class="w-[100px]"> ID </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right"> Amount </TableHead> -->
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in scheduleStore.scheduleData" :key="item.id">
          <TableCell class="font-medium" v-for="field in header" :key="field.value">
            {{ item[field.value] }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
