<template>
  <div class="mt-4">
    <div v-if="orders.length <= 0" class="text-sm text-gray-500 text-center">
      No lab orders on record
    </div>
    <ul
      class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <li
        v-for="item in orders"
        :key="item.id"
        class="col-span-1 flex shadow-sm rounded-md"
      >
        <GenericCardMini
          class="w-full px-4 py-2 flex items-center justify-between"
        >
          <div class="flex-1 truncate">
            <p class="text-gray-900 font-medium hover:text-gray-600 truncate">
              {{ item.id }}
            </p>
            <p class="text-gray-500 mb-2">
              Collected
              {{ formatDate(item.specimenCollectedTime, (t = false)) }}
            </p>
            <p class="text-gray-500">{{ item.resultItems.length }} results</p>
          </div>
          <div class="flex-shrink-0">
            <span class="sr-only">Open options</span>
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
        </GenericCardMini>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

import { LabOrder } from '@/interfaces/laborder'
import { PatientRecord } from '@/interfaces/patientrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  data() {
    return {
      orders: [] as LabOrder[],
    }
  },
  async fetch() {
    const res: LabOrder[] = await this.$axios.$get(this.apiPath)
    this.orders = res
  },
  computed: {
    apiPath(): string {
      return this.record.links.laborders
    },
  },
})
</script>
