import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'
import { getTodayDate } from '@/utils/date'
import { getTemplateId } from '@/utils'

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

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event: any, type: any) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
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
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getTemplateId()

    const newNode = {
      id: nodeId,
      type: draggedType.value || 'custom',
      position,
      data: {
        id: nodeId,
        title: '请添加标题',
        priority: 'low',
        completed: false,
        date: getTodayDate(),
      },
    }

    /**
     * 放置后对齐节点位置，使其以鼠标为中心
     *
     * 我们甚至可以在回调中挂钩事件，并且可以在调用事件侦听器后将其删除。
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }))

      off()
    })

    addNodes(newNode)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}
