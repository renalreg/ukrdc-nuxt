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
              <p class="text-sm font-medium text-indigo-600 truncate">
                {{ item.filename }}
              </p>
              <p class="mt-2 text-sm text-gray-500 line-clamp-2">
                {{ item.error ? item.error : 'No error message recorded' }}
              </p>
            </div>
            <!-- Recieved  -->
            <div class="col-span-2 sm:col-span-1 mt-2 sm:mt-0">
              <p class="text-sm text-gray-500">From {{ item.facility }}</p>
              <p class="mt-2 text-sm text-gray-900">
                {{ formatDate(item.received) }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <!-- Heroicon name: solid/chevron-right -->
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
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
