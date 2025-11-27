<script setup lang='ts'>
// import * as echarts from 'echarts'
import * as echarts from 'echarts/core'
/* 引入图表类型 */
import { LineChart, BarChart, PieChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
import { debounce } from 'lodash-es'
import type { EChartsOption } from 'echarts';
const chartRef = useTemplateRef("chartRef")

interface EchartsOption {
  option: EChartsOption
}

const { option } = defineProps<EchartsOption>()


let chartInstance: echarts.ECharts | null = null;
const initChart = () => {
  if (!chartRef.value) {
    return;
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
}


watch(() => option, () => {
  if (chartInstance) {
    chartInstance.setOption(option)
  }
})

const handleResize = () => {
  chartInstance?.resize()
}
const debounceResize = debounce(handleResize, 80)

onMounted(() => {
  initChart()
  window.addEventListener('resize', debounceResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', debounceResize)
})


// const mockOption = {
//   grid: {
//     // show: true,
//     top: 20,
//     left: 0,
//     right: 0,
//     bottom: 20,
//     containLabel: true
//   },
//   xAxis: {
//     type: 'category',
//     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   },
//   yAxis: {
//     type: 'value'
//   },
//   series: [
//     {
//       name: '销量',
//       data: [150, 230, 224, 218, 135, 147, 260],
//       type: 'line'
//     }
//   ],
//   tooltip: {
//     trigger: 'axis',       // 'item'（单个数据项）| 'axis'（坐标轴触发，常用于折线/柱状图）
//     axisPointer: {         // 坐标轴指示器
//       type: 'shadow'       // 'line' | 'shadow' | 'cross'
//     },
//   },
//   legend: {
//     data: ['销量'],
//     orient: 'horizontal',  // 'horizontal' | 'vertical'
//     left: 'left',
//     top: 'bottom',
//     itemWidth: 20,         // 图例标记宽度
//     itemHeight: 14,        // 图例标记高度
//     textStyle: {
//       color: '#333'
//     }
//   },
//   // dataZoom: [{
//   //   type: 'slider',        // 滑块型
//   //   xAxisIndex: 0,
//   //   start: 0,
//   //   end: 50                // 显示前50%数据
//   // }, {
//   //   type: 'inside',        // 内置型（支持鼠标滚轮缩放）
//   //   xAxisIndex: 0
//   // }]
// }
</script>

<template>
  <div ref="chartRef" class="w-full h-full">
  </div>
</template>

<style scoped></style>