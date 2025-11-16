<script setup lang="ts">
import TagList from '@/components/Tag/TagList.vue'
import Tags from '@/components/Tag/Tags.vue'
import Header from './Header.vue'
import AddSchedule from '@/components/Model/AddSchedule.vue'
import EditSchedule from '@/components/Model/EditSchedule.vue'
import ScheduleDetail from '@/components/Model/ScheduleDetail.vue'
import FooterNav from './FooterNav.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <ScheduleDetail />
    <AddSchedule />
    <EditSchedule />
    <RouterView #default="{ Component, route }">
      <main v-if="route?.meta?.layout === 'full'">
        <component :is="Component" />
      </main>
      <main v-else class="p-4 flex m-auto max-w-[1200px] flex-1 w-full">
        <component :is="Component" />
      </main>
      <!-- <p>{{ route.meta }}</p> -->
    </RouterView>
    <FooterNav />
    <!-- <TagList /> -->
  </div>
</template>

<style scoped></style>
