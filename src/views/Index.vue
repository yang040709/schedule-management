<script setup lang='ts'>
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

// 备忘录数据
interface MemoItem {
  id: number
  title: string
  content: string
  date: string
  tags: string[]
  completed: boolean
}

// 初始数据
const initialMemos: MemoItem[] = []

// 使用useLocalStorage进行本地持久化
const memos = useLocalStorage<MemoItem[]>('personal-memos', initialMemos, {
  serializer: {
    read: (v) => {
      try {
        return JSON.parse(v)
      } catch {
        return initialMemos
      }
    },
    write: (v) => JSON.stringify(v)
  }
})

// 切换完成状态
const toggleComplete = (id: number) => {
  const memo = memos.value.find(m => m.id === id)
  if (memo) {
    memo.completed = !memo.completed
  }
}

// 删除备忘录
const deleteMemo = (id: number) => {
  const index = memos.value.findIndex(m => m.id === id)
  if (index !== -1) {
    memos.value.splice(index, 1)
  }
}

// 添加新备忘录
interface NewMemo {
  title: string
  content: string
  tags: string
}

const newMemo = ref<NewMemo>({
  title: '',
  content: '',
  tags: ''
})

const addMemo = () => {
  if (!newMemo.value.title.trim()) return

  const tags = newMemo.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

  // 生成新的ID（找到最大ID加1）
  const maxId = memos.value.length > 0 ? Math.max(...memos.value.map(m => m.id)) : 0
  const newId = maxId + 1

  memos.value.unshift({
    id: newId,
    title: newMemo.value.title,
    content: newMemo.value.content,
    date: new Date().toISOString().split('T')[0] as string,
    tags: tags.length > 0 ? tags : ['未分类'],
    completed: false
  })

  // 清空表单
  newMemo.value.title = ''
  newMemo.value.content = ''
  newMemo.value.tags = ''
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center mt-5">个人备忘录</h1>
    <!-- 添加备忘录表单 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">添加新备忘录</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input v-model="newMemo.title" type="text" placeholder="请输入备忘录标题"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea v-model="newMemo.content" placeholder="请输入备忘录内容" rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标签（用逗号分隔）</label>
          <input v-model="newMemo.tags" type="text" placeholder="例如：工作,学习,生活"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        <button @click="addMemo"
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition">
          添加备忘录
        </button>
      </div>
    </div>

    <!-- 备忘录列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="memo in memos" :key="memo.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">{{ memo.title }}</h3>
            <button @click="toggleComplete(memo.id)" class="flex-shrink-0">
              <span :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                memo.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              ]">
                {{ memo.completed ? '已完成' : '未完成' }}
              </span>
            </button>
          </div>

          <p class="text-gray-600 mb-4">{{ memo.content }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in memo.tags" :key="tag"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ tag }}
            </span>
          </div>

          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div class="text-sm text-gray-500">
              <span>{{ memo.date }}</span>
              <span class="text-gray-400 ml-2">#{{ memo.id }}</span>
            </div>
            <button @click="deleteMemo(memo.id)"
              class="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
              title="删除备忘录">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">备忘录统计</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600">{{ memos.length }}</div>
          <div class="text-gray-600">总数量</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600">{{memos.filter(m => m.completed).length}}</div>
          <div class="text-gray-600">已完成</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-600">{{memos.filter(m => !m.completed).length}}</div>
          <div class="text-gray-600">未完成</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600">
            {{new Set(memos.flatMap(m => m.tags)).size}}
          </div>
          <div class="text-gray-600">标签种类</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ICP备案信息 -->
  <footer class="site-footer">
    <div class="container">
      <p>
        © {{ new Date().getFullYear() }} 个人备忘录<br />
        本网站为个人非经营性网站，仅用于本人记录日常事项，不对外提供服务。<br />
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"
          style="color: inherit; text-decoration: underline;">
          粤ICP备2025505073号-2
        </a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 20px 0;
  background-color: #f8f9fa;
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-top: auto;
  margin-top: 30px;
  border: 1px solid #ddd;
  /* position: fixed; */
  /* bottom: 0; */
  /* left: 0; */
  /* right: 0; */
  /* z-index: 100; */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
