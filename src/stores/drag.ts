import { defineStore } from 'pinia'
import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'
import type { Schedule } from '@/types/schedule'

export const useDragStore = defineStore('drag', () => {
  /**
   *在现实世界中，您希望避免在全局范围内创建引用，因为它们可能无法正确清理。
   * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
   */
  const state = {
    /**
     * 被拖动的节点的类型。
     */
    draggedType: ref(null),
    isDragOver: ref(false),
    isDragging: ref(false),
  }

  const { draggedType, isDragOver, isDragging } = state

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } =
    useVueFlow('yang-flow')

  // const schedule = ref<Schedule | null>(null)

  const scheduleList = ref<Schedule[]>([])

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event: any, type: any, data: Schedule) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.setData('application/json', JSON.stringify({ id: data.id }))
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  /**
   * 处理拖动事件。
   *
   * @param {DragEvent} event
   */
  function onDragOver(event: any) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function onDragEnd() {
    console.log('onDragEnd')
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  /**
   * 处理放置事件。
   *
   * @param {DragEvent} event
   */
  function onDrop(event: any) {
    console.log(event, '<===onDrop')
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    // const nodeId = getTemplateId()

    const nodeId = JSON.parse(event.dataTransfer.getData('application/json')).id

    const nodeData = scheduleList.value.find((item) => item.id === nodeId)
    if (!nodeData) {
      console.error('Node not found:', nodeId)
      return
    }

    const newNode = {
      id: nodeId,
      type: draggedType.value || 'custom',
      position,
      data: nodeData,
    }

    /**
     * 放置后对齐节点位置，使其以鼠标为中心
     *
     * 我们甚至可以在回调中挂钩事件，并且可以在调用事件侦听器后将其删除。
     */
    const { off } = onNodesInitialized(() => {
      updateNode(newNode.id, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }))

      off()
    })
    /* 
    把数组中id为nodeData.id的元素删除
    */
    scheduleList.value = scheduleList.value.filter((item) => item.id !== nodeData.id)
    addNodes(newNode)
  }

  return {
    scheduleList,
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
})
