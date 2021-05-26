<template>
  <li>
    <NuxtLink :to="`/errors/${item.id}`" class="block hover:bg-gray-50">
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div class="min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 w-full">
            <!-- Heading -->
            <div class="col-span-2 lg:col-span-3">
              <TextL1c class="truncate">
                {{ item.filename || 'No filename found' }}
              </TextL1c>
              <TextP class="mt-2 line-clamp-2">
                {{ item.error ? item.error : 'No error message recorded' }}
              </TextP>
            </div>
            <!-- Recieved  -->
            <div class="col-span-2 sm:col-span-1 mt-2 sm:mt-0">
              <TextP>From {{ item.facility }}</TextP>
              <TextP class="mt-2">
                {{ formatDate(item.received) }}
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
import { Message } from '@/interfaces/errors'

export default defineComponent({
  props: {
    item: {
      type: Object as () => Message,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>
