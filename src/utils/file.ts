export function exportJson(data: unknown, filename = 'data.json'): void {
  // 1. 将数据转为 JSON 字符串（可美化）
  const jsonString = JSON.stringify(data, null, 2)

  // 2. 创建 Blob 对象（MIME 类型指定为 application/json）
  const blob = new Blob([jsonString], { type: 'application/json' })

  // 3. 创建临时 URL
  const url = URL.createObjectURL(blob)

  // 4. 创建 <a> 标签并触发下载
  const a = document.createElement('a')
  a.href = url
  a.download = filename // 指定文件名
  document.body.appendChild(a)
  a.click()

  // 5. 清理（移除元素 + 释放 URL）
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
