<template>
  <li>
    <NuxtLink :to="`/workitems/${item.id}`" class="block hover:bg-gray-50">
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div
            class="min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 w-full"
          >
            <!-- IDs and description -->
            <div class="col-span-2">
              <p class="text-sm font-medium text-indigo-600 truncate">
                {{ item.id }}: {{ item.personId }} → {{ item.masterId }}
              </p>
              <p class="mt-2 text-sm text-gray-500 truncate">
                {{ item.description }}
              </p>
            </div>
            <!-- Last updated (small breakpoint only) -->
            <div class="col-span-2 sm:hidden mt-2">
              <p class="text-sm text-gray-900">
                Last updated {{ formatDate(item.lastUpdated) }}
              </p>
            </div>
            <!-- Last updated (small and up) -->
            <div class="hidden sm:block">
              <p class="text-sm text-gray-500">Last updated</p>
              <p class="mt-2 text-sm text-gray-900">
                {{ formatDate(item.lastUpdated) }}
              </p>
            </div>
            <!-- Details (large and up) -->
            <div class="hidden lg:block">
              <p class="text-sm text-gray-500">Type:</p>
              <p class="mt-2 text-sm text-gray-500">
                {{ item.type }}
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
import { WorkItemShort } from '@/interfaces/workitem'

export default Vue.extend({
  mixins: [dateUtilsMixin],
  props: {
    item: {
      type: Object as () => WorkItemShort,
      required: true,
    },
  },
})
</script>
