import { computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import type { PriorityLevel, Schedule, ScheduleStatus } from '@/types/schedule'
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

// const router = useRouter()
// eventBus.on('add-schedule', () => {
//   fetchData()
// })

// eventBus.on('edit-schedule', () => {
//   fetchData()
// })

// const initialVal: ScheduleListResponse = {
//   total: 0,
//   data: [],
// }

// const makeQuery: () => ScheduleListQuery = () => {
//   // interface
//   const statusList: (ScheduleStatus | undefined)[] = ['done', 'pending', 'expired', 'canceled']
//   let status: ScheduleStatus | undefined = undefined
//   let index = statusList.indexOf(status)
//   if (index !== -1 && statusList[index]) {
//     status = statusList[index]
//   }
//   const priorityList: (PriorityLevel | undefined)[] = ['high', 'medium', 'low']
//   let priority: PriorityLevel | undefined = undefined
//   index = priorityList.indexOf(priority)
//   if (index !== -1 && priorityList[index]) {
//     priority = priorityList[index]
//   }
//   return {
//     status,
//     priority,
//     date: route.params.date?.toString() || getTodayDate(),
//   }
// }

// const query = ref<ScheduleListQuery>(makeQuery())

// const taskDependencies = ref<Map<string, Schedule[]>>(new Map())

// // 当获取到任务列表时，构建依赖关系
// const buildTaskDependencies = (tasks: Schedule[]) => {
//   // 初始化所有任务的子任务列表
//   tasks.forEach((task) => {
//     taskDependencies.value.set(task.id, [])
//   })

//   // 填充依赖关系
//   tasks.forEach((task) => {
//     if (task.dependentSchedule) {
//       const parentId = task.dependentSchedule.id
//       if (taskDependencies.value.has(parentId)) {
//         taskDependencies.value.get(parentId)!.push(task)
//       }
//     }
//   })
// }
// /*
// 获取日程列表
// */
// const { data, fetchData, loading } = useFetchData(getScheduleListApi, [query], initialVal, {
//   afterSuccessFetchData: () => {
//     /*
//       构建任务依赖关系
//     */
//     buildTaskDependencies(data.value.data)
//   },
// })
// fetchData()

// /*
// 监听路由参数变化，重新获取数据
// */
// watch([() => route.params.date, () => route.query.status, () => route.query.priority], (params) => {
//   query.value = makeQuery()
//   fetchData()
// })

// /*
// 计算日程总数
// */
// const totalCount = computed(() => data.value.data.length)
// const completedCount = computed(() => {
//   return data.value.data.filter((e) => e.status === 'done').length
// })

// /*
//   处理显示所有日程事件
// */
// const showAllSchedule = () => {
//   router.push({
//     name: route.name,
//     params: route.params,
//     query: {
//       ...route.query,
//       completed: undefined,
//     },
//   })
// }

// /*
//   处理显示已完成日程事件
// */
// const showCompletedSchedule = () => {
//   router.push({
//     name: route.name,
//     params: route.params,
//     query: {
//       ...route.query,
//       status: 'done',
//     },
//   })
// }

// /*
//   处理显示未完成日程事件
// */
// const showUncompletedSchedule = () => {
//   console.log(route)
//   router.push({
//     name: route.name,
//     params: route.params,
//     query: {
//       ...route.query,
//       status: 'pending',
//     },
//   })
// }

// /*
//   处理清除优先级筛选事件,就是展示全部
// */
// const clearPriority = () => {
//   router.push({
//     name: route.name,
//     params: route.params,
//     query: {
//       ...route.query,
//       priority: undefined,
//     },
//   })
// }
// /*
//   处理设置优先级筛选事件
// */
// const setPriority = (priority: PriorityLevel) => {
//   router.push({
//     name: route.name,
//     params: route.params,
//     query: {
//       ...route.query,
//       priority,
//     },
//   })
// }

/* 
组合式函数useScheduleList
*/
export const useScheduleList = (
  data: Ref<ScheduleListResponse>,
  fetchData: () => void,
  taskDependencies: Ref<Map<string, Schedule[]>>,
  date?: Ref<string>,
) => {
  const addModelStore = useAddModelStore()
  const editModelStore = useEditModelStore()
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
    if (item.status === 'done') {
      if (taskDependencies.value.has(id)) {
        const schedules = taskDependencies.value.get(id)
        if (!schedules) {
          return
        }
        schedules.forEach((e) => {
          // console.log(e, '<==e', e.status)
          if (e.status === 'locked') {
            /* 
          把子任务状态设为待办
        */
            e.status = 'pending'
          }
        })
      }
    } else if (item.status === 'pending') {
      if (taskDependencies.value.has(id)) {
        const schedules = taskDependencies.value.get(id)
        if (!schedules) {
          return
        }
        schedules.forEach((e) => {
          if (e.status === 'pending') {
            /* 
          把子任务状态设为待办
        */
            e.status = 'locked'
          }
        })
      }
    }
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
    if (!date || !date.value) {
      return
    }
    addModelStore.addModelInfo.date = date.value
  }

  /* 
  处理生成AI建议事件，就是生成行动建议
*/
  const generateAISuggest = async (id: string, cb: () => void) => {
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
    try {
      await fetchSuggestion()
      await modifySchedule()
    } catch (error) {
    } finally {
      cb()
    }
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

  const handleCancel = async (id: string) => {
    const item = data.value.data.find((e) => e.id === id)
    if (!item) {
      console.error('未找到该日程')
      return
    }
    const cancelStatus: ScheduleStatus = 'canceled'
    const { data: modifiedSchedule, fetchData: modifySchedule } = useFetchData(
      modifyScheduleApi,
      [
        id,
        () => ({
          status: cancelStatus,
        }),
      ],
      {
        schedule: getScheduleInitialData(),
      },
    )
    await modifySchedule()
    item.status = cancelStatus
  }
  return {
    handleToggleComplete,
    handleEdit,
    handleDelete,
    handleAddNew,
    generateAISuggest,
    removeAISuggest,
    handleCancel,
  }
}
