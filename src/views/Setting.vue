<script setup lang="ts">
import { FolderInput, FolderOutput, BadgeInfo, Tags } from 'lucide-vue-next'
import { shallowRef, ref } from 'vue'
import ImportDataButton from '@/components/Setting/ImportDataButton.vue'
import ExportDataButton from '@/components/Setting/ExportDataButton.vue'
import TagsList from '@/components/Tag/Tags.vue'
import { useTagStore } from '@/stores/tag'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const dataItems = shallowRef([
  {
    text: '导出数据',
    desc: '导出成JSON格式的文件',
    path: '/setting/export',
    icon: FolderOutput,
    component: ExportDataButton,
  },
  {
    text: '导入数据',
    path: '/setting/import',
    desc: '导入JSON格式的文件',
    icon: FolderInput,
    component: ImportDataButton,
  },
])

const aboutItems = shallowRef([
  {
    text: '关于',
    desc: '关于本应用',
    icon: BadgeInfo,
    link: 'about',
  },
])

const tagStore = useTagStore()

const categoryInput = ref('')

const addCategory = () => {
  tagStore.addTag(categoryInput.value)
  categoryInput.value = ''
}
</script>

<template>
  <div class="mt-4 max-w-[760px] mx-auto">
    <p class="m-3 ml-4 text-gray-600">数据</p>
    <ul class="bg-white p-4 rounded-2xl w-full flex flex-col gap-2 mb-5 border-2 border-gray-100">
      <li
        class="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
        v-for="item in dataItems"
        :key="item.text"
      >
        <div>
          <component :is="item.icon"></component>
        </div>
        <div class="flex justify-between w-full">
          <div>
            <div>{{ item.text }}</div>
            <p class="text-sm text-gray-600">{{ item.desc }}</p>
          </div>
          <div>
            <component :is="item.component"></component>
          </div>
        </div>
      </li>
    </ul>
    <p class="m-3 ml-4 text-gray-600">关于</p>
    <ul class="bg-white rounded-2xl w-full flex flex-col gap-2 mb-5 border-2 border-gray-100">
      <li
        class="flex p-4 cursor-pointer transition-colors items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0"
        v-for="item in aboutItems"
        :key="item.text"
        @click="$router.push({ name: item.link })"
      >
        <div>
          <component :is="item.icon"></component>
        </div>
        <div class="flex justify-between w-full">
          <div>
            <router-link
              :to="{
                name: item.link,
              }"
              class="cursor-pointer hover:text-blue-700"
              >{{ item.text }}</router-link
            >
            <p class="text-sm text-gray-600">{{ item.desc }}</p>
          </div>
        </div>
      </li>
    </ul>
    <p class="m-3 ml-4 text-gray-600">分类</p>
    <ul class="bg-white rounded-2xl w-full flex flex-col gap-2 mb-5 border-2 border-gray-100">
      <li
        class="p-4 cursor-pointer transition-colors border-b border-gray-100 pb-4 last:border-b-0"
      >
        <div class="flex items-center gap-4">
          <div>
            <Tags />
          </div>
          <div class="flex justify-between w-full">
            <div>
              <!-- <router-link :to="{
              name: item.link,
            }" class="cursor-pointer hover:text-blue-700">{{ item.text }}</router-link> -->
              <p class="cursor-pointer hover:text-blue-700">分类</p>
              <p class="text-sm text-gray-600">分类</p>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <p class="text-gray-600 my-4 font-bold">管理您的推荐分类:</p>
          <div>
            <div class="flex gap-2">
              <Input v-model="categoryInput" placeholder="输入分类" class="flex-1" />
              <Button @click="addCategory">添加</Button>
            </div>
            <TagsList
              :tags="tagStore.tags"
              class="mt-4"
              :can-delete="true"
              @delete="tagStore.removeTag($event)"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
