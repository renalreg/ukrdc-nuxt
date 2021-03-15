<template>
  <div class="bg-white shadow overflow-hidden rounded-md">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Work Item {{ item.id }}
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        {{ item.description }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ item.lastUpdated ? formatDate(item.lastUpdated) : 'Never' }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Last Updated By</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ item.updatedBy ? item.updatedBy : 'N/A' }}
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm font-medium text-gray-500">Comments</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ item.updateDescription ? item.updateDescription : 'None' }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { WorkItem } from '@/interfaces/workitems'

import dateUtilsMixin from '@/mixins/dateutils'

export default Vue.extend({
  mixins: [dateUtilsMixin],
  props: {
    item: {
      type: Object as () => WorkItem,
      required: true,
    },
  },
})
</script>
