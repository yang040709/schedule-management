<script setup lang="ts">
import TagList from '@/components/Tag/TagList.vue'
import Tags from '@/components/Tag/Tags.vue'
import Header from './Header.vue'
import AddSchedule from '@/components/AddSchedule.vue'
import EditSchedule from '@/components/EditSchedule.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <AddSchedule />
    <EditSchedule />
    <RouterView #default="{ Component, route }">
      <main v-if="route?.meta?.layout === 'full'">
        <component :is="Component" />
      </main>
      <main v-else class="p-4 max-w-[1200px] m-auto flex-1 w-full">
        <component :is="Component" />
      </main>
      <!-- <p>{{ route.meta }}</p> -->
    </RouterView>
    <!-- <TagList /> -->
  </div>
</template>

<style scoped></style>
