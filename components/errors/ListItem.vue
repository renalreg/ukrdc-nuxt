<template>
  <li>
    <NuxtLink
      :to="`/mirth/messages/${item.channelId}/${item.messageId}`"
      class="block hover:bg-gray-50"
    >
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div
            class="min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 w-full"
          >
            <!-- Heading -->
            <div class="col-span-2 lg:col-span-3">
              <TextL1c class="truncate">
                {{ item.filename }}
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
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import { Message } from '@/interfaces/errors'

export default Vue.extend({
  mixins: [dateUtilsMixin],
  props: {
    item: {
      type: Object as () => Message,
      required: true,
    },
  },
})
</script>
