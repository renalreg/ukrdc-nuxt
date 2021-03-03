<template>
  <li>
    <a href="#" class="block px-4 py-4 bg-white hover:bg-gray-50">
      <span class="flex items-center space-x-4">
        <span class="flex-1 flex space-x-2 truncate">
          <span class="flex flex-col text-gray-500 text-sm truncate">
            <span class="truncate">{{ item.id }} - {{ item.description }}</span>
            <span class="text-gray-900 font-medium"
              >{{ item.personId }} → {{ item.masterId }}</span
            >

            <span>{{ formatDate(item.lastUpdated) }}</span>
          </span>
        </span>
        <!-- Heroicon name: solid/chevron-right -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-gray-400"
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
      </span>
    </a>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

import { WorkItemShort } from '@/interfaces/workitems'
import dateUtilsMixin from '@/mixins/dateutils'

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
