/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import type { Directive, DirectiveBinding } from 'vue'
import { toast } from 'vue-sonner'

interface ElType extends HTMLElement {
  copyData: string | number
  toastMsg: string
  __handleClick__: any
}
const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value.value
    el.toastMsg = binding.value.msg
    el.addEventListener('click', handleClick)
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value.value
    el.toastMsg = binding.value.msg
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  },
}
function handleClick(this: any) {
  const input = document.createElement('input')
  input.value = this.copyData.toLocaleString()
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  if (this.toastMsg) {
    toast.success(this.toastMsg)
  } else {
    toast.success('复制成功')
  }
  console.log('复制成功', this.copyData)
}

export default copy
