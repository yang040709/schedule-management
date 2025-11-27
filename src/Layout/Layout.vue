<script setup lang="ts">
import TagList from '@/components/Tag/TagList.vue'
import Tags from '@/components/Tag/Tags.vue'
import Header from './Header.vue'
import AddSchedule from '@/components/Model/AddSchedule.vue'
import EditSchedule from '@/components/Model/EditSchedule.vue'
import ScheduleDetail from '@/components/Model/ScheduleDetail.vue'
import FooterNav from './FooterNav.vue'
import { cn } from '@/lib/utils'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 mt-[56px]">
    <Header />
    <ScheduleDetail />
    <AddSchedule />
    <EditSchedule />
    <main>
      <RouterView #default="{ Component, route }">
        <KeepAlive :max="10">
          <component :is="Component" :class="cn(
            {
              'p-4 m-auto max-w-[1200px] flex-1 w-full': route?.meta?.layout !== 'full'
            }
          )" />
        </KeepAlive>
      </RouterView>
      <FooterNav />
    </main>

  </div>
</template>

<style scoped></style>
