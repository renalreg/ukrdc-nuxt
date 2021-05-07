<template>
  <li>
    <NuxtLink :to="`/workitems/${item.id}`" class="block hover:bg-gray-50">
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div class="min-w-0 grid grid-cols-2 lg:grid-cols-3 lg:gap-4 w-full">
            <!-- IDs and description -->
            <div class="col-span-2">
              <TextL1c class="truncate">
                {{ item.id }}: {{ item.personId }} → {{ item.masterId }}
              </TextL1c>
              <TextP class="mt-2 truncate">
                {{ item.description }}
              </TextP>
            </div>
            <!-- Last updated (small breakpoint only) -->
            <div class="col-span-2 lg:hidden mt-2">
              <TextP> Last updated {{ formatDate(item.lastUpdated) }} </TextP>
            </div>
            <!-- Last updated (small and up) -->
            <div class="hidden lg:block">
              <TextL1>Last updated</TextL1>
              <TextP class="mt-2">
                {{ formatDate(item.lastUpdated) }}
              </TextP>
            </div>
          </div>
        </div>
        <div>
          <IconChevronRight />
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { WorkItemShort } from '@/interfaces/workitem'

export default defineComponent({
  props: {
    item: {
      type: Object as () => WorkItemShort,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>
