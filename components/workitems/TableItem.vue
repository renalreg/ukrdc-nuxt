<template>
  <tr>
    <td class="px-6 py-4 text-sm font-medium text-gray-900">
      {{ item.id }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-500">
      {{ truncateString(item.description, 60) }}
    </td>
    <td class="px-2 py-4 text-sm text-gray-500">
      {{ item.personId }} → {{ item.masterId }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-500">
      {{ formatDate(item.lastUpdated) }}
    </td>
    <td class="px-6 py-4 text-right text-sm font-medium max-w-min">
      <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
    </td>
  </tr>
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
  methods: {
    truncateString(str: string, num: number): string {
      // If the length of str is less than or equal to num
      // just return str--don't truncate it.
      if (str.length <= num) {
        return str
      }
      // Return str truncated with '...' concatenated to the end of str.
      return str.slice(0, num) + '...'
    },
  },
})
</script>
