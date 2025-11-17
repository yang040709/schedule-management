    <!-- 编辑模式 -->
    <div v-else class="space-y-4">
      <!-- 标题 -->
      <div class="space-y-2">
        <Label for="title">标题</Label>
        <Input id="title" v-model="formData.title" placeholder="输入标题" class="w-full nodrag" />
      </div>

      <!-- 描述 -->
      <div class="space-y-2">
        <Label for="description">描述</Label>
        <Textarea
          id="description"
          v-model="formData.description"
          placeholder="输入描述"
          class="w-full nodrag"
          rows="3"
        />
      </div>
      <div class="space-y-2 no-drag">
        <Label for="description">日期</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="
                cn(
                  'w-[280px] justify-start text-left font-normal',
                  !formData.date && 'text-muted-foreground',
                )
              "
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ pickDateText }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="neededDate" initial-focus />
          </PopoverContent>
        </Popover>
      </div>
      <!-- 时间 -->
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-2">
          <Label for="startTime">开始时间</Label>
          <Input id="startTime" v-model="formData.timeOfDay.startTime" type="time" class="w-full" />
        </div>
        <div class="space-y-2">
          <Label for="endTime">结束时间</Label>
          <Input id="endTime" v-model="formData.timeOfDay.endTime" type="time" class="w-full" />
        </div>
      </div>

      <!-- 优先级 -->
      <div class="space-y-2">
        <Label>优先级</Label>
        <RadioGroup v-model="formData.priority" class="flex gap-4">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label for="high" class="text-red-600">高</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label for="medium" class="text-yellow-600">中</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label for="low" class="text-green-600">低</Label>
          </div>
        </RadioGroup>
      </div>

      <!-- 分类 -->
      <div class="space-y-2">
        <Label>分类标签</Label>
        <div class="flex gap-2">
          <Input
            v-model="categoryInput"
            placeholder="输入分类"
            class="flex-1 nodrag"
            @keyup.enter="addCategory"
          />
          <Button @click="addCategory" size="sm">添加</Button>
        </div>
        <div v-if="formData.category && formData.category.length > 0" class="flex flex-wrap gap-1">
          <span
            v-for="(cat, index) in formData.category"
            :key="index"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1"
          >
            {{ cat }}
            <button @click="removeCategory(index)" class="text-gray-400 hover:text-red-500">
              <X class="w-4" />
            </button>
          </span>
        </div>
      </div>

      <!-- 完成状态
      <div class="flex items-center space-x-2">
        <input id="completed" v-model="formData.completed" type="checkbox" class="rounded" />
        <Label for="completed">已完成</Label>
      </div> -->

      <!-- 操作按钮 -->
      <div class="flex gap-2 pt-2">
        <Button @click="toggleEdit" class="flex-1 nodrag">保存</Button>
        <Button @click="isEditing = false" variant="outline" class="flex-1 nodrag">取消</Button>
      </div>
    </div>
