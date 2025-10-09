<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'
import AppCalendar from '@/components/AppCalendar.vue'
</script>

<template>
  <Drawer direction="left">
    <DrawerTrigger>
      <slot></slot>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>请选择日程的日期</DrawerTitle>
        <DrawerDescription> 选择日期后，日程将显示在此日期的下方。 </DrawerDescription>
        <AppCalendar />
      </DrawerHeader>
      <DrawerFooter>
        <!-- <Button>Submit</Button> -->
        <!-- <DrawerClose>
          <Button variant="outline" class="w-full"> Cancel </Button>
        </DrawerClose> -->
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
