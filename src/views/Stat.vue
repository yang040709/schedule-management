<script setup lang='ts'>
import Echarts from '@/components/Echarts/Echarts.vue';
import type { EChartsOption } from 'echarts';
import "echarts-wordcloud"
import { computed, ref, type ComputedRef } from 'vue';
import type { DashboardStats } from '@/types/stat';
import { useFetchData } from '@/hooks/useFetchData';
import { getStatsApi } from '@/api/stats';

const { data, fetchData, loading } = useFetchData(getStatsApi, [], {
  overview: [],
  status: [],
  statusTrend: {
    all: [],
    uncompleted: [],
    completed: [],
    xAxis: [],
  },
  priority: [],
  category: [],
})

fetchData();

const scheduleStatusOption: ComputedRef<EChartsOption> = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      itemGap: 12,
      itemWidth: 12,
      itemHeight: 12
    },
    color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    series: [
      {
        name: '日程状态',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['60%', '50%'],
        data: data.value.status,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.15)'
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
          fontSize: 11,
          color: '#666',
          fontWeight: 'normal'
        },
        labelLine: {
          length: 15,
          length2: 10,
          smooth: true
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#333'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };
})

const scheduleStatusTrendOption: ComputedRef<EChartsOption> = computed(() => {
  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#5470c6',
          width: 1,
          type: 'dashed'
        }
      }
    },
    legend: {
      top: 0,
      data: ["全部", "未完成", "已完成"],
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      itemGap: 20
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.value.statusTrend.xAxis,
      axisLine: {
        lineStyle: {
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    color: ['#6366f1', '#ef4444', '#10b981'],
    series: [
      {
        name: '全部',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(99, 102, 241, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#6366f1',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(99, 102, 241, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(99, 102, 241, 0.05)'
            }]
          }
        },
        data: data.value.statusTrend.all
      },
      {
        name: '未完成',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(239, 68, 68, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#ef4444',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(239, 68, 68, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(239, 68, 68, 0.05)'
            }]
          }
        },
        data: data.value.statusTrend.uncompleted
      },
      {
        name: '已完成',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(16, 185, 129, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#10b981',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(16, 185, 129, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(16, 185, 129, 0.05)'
            }]
          }
        },
        data: data.value.statusTrend.completed
      },
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }
})


const schedulePriorityOption: ComputedRef<EChartsOption> = computed(() => {
  return {
    xAxis: {
      type: 'category',
      data: ["高优先级", "中优先级", "低优先级"],
      axisLine: {
        lineStyle: {
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: data.value.priority.map(item => item.value),
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#ee6666'
            }, {
              offset: 0.5,
              color: '#fac858'
            }, {
              offset: 1,
              color: '#91cc75'
            }]
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 4,
          shadowOffsetY: 2
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 4
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#333',
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: function (params: any) {
        return `${params[0].name}<br/>数量: ${params[0].value}`;
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(150, 150, 150, 0.1)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut'
  }
})

const scheduleCategoryOption: ComputedRef<EChartsOption> = computed(() => {
  const colorPalette = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#6e7074'
  ];

  return {
    tooltip: {
      show: true,
      formatter: function (params: any) {
        return `${params.name}: ${params.value}`;
      }
    },
    series: [{
      type: 'wordCloud',
      sizeRange: [20, 80],
      rotationRange: [-30, 30],
      rotationStep: 45,
      gridSize: 12,
      shape: 'circle',
      width: '100%',
      height: '100%',
      drawOutOfBound: false,
      textStyle: {
        color: function () {
          return colorPalette[Math.floor(Math.random() * colorPalette.length)];
        } as any,
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: data.value.category
    }] as any
  }
})



</script>

<template>
  <div class='w-screen max-w-[1200px] p-4 mx-auto'>
    <div class="w-full mb-8 grid grid-cols-2 gap-4 justify-between items-center md:grid-cols-4">
      <div
        class="bg-white p-6 flex justify-between flex-col border border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <span class="text-3xl font-bold text-blue-600">{{ data?.overview[0]?.count }}</span>
        <span class="text-sm text-blue-700 font-medium">{{ data?.overview[0]?.title }}</span>
      </div>
      <div
        class="bg-white p-6  flex justify-between flex-col border border-green-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <span class="text-3xl font-bold text-green-600">{{ data?.overview[1]?.count }}</span>
        <span class="text-sm text-green-700 font-medium">{{ data?.overview[1]?.title }}</span>
      </div>
      <div
        class="bg-white p-6  flex justify-between flex-col border border-red-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <span class="text-3xl font-bold text-red-500">{{ data?.overview[2]?.count }}</span>
        <span class="text-sm text-red-700 font-medium">{{ data?.overview[2]?.title }}</span>
      </div>
      <div
        class=" bg-white p-6  flex justify-between flex-col border border-purple-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <span class="text-3xl font-bold text-purple-600">{{ data?.overview[3]?.count }}</span>
        <span class="text-sm text-purple-700 font-medium">{{ data?.overview[3]?.title }}</span>
      </div>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">日程状态分布</h3>
        <div class="h-80">
          <Echarts :option="scheduleStatusOption" />
        </div>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">日程状态趋势</h3>
        <div class="h-80">
          <Echarts :option="scheduleStatusTrendOption" />
        </div>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">日程优先级分布</h3>
        <div class="h-80">
          <Echarts :option="schedulePriorityOption" />
        </div>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">日程分类分布</h3>
        <div class="h-80">
          <Echarts :option="scheduleCategoryOption" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-80 {
  height: 20rem;
}
</style>
