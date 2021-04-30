<template>
  <div class="mt-4">
    <TextP v-if="orders.length <= 0" class="text-center">
      No lab orders on record
    </TextP>
    <ul
      class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
            <TextH3 class="truncate">
              {{ item.id }}
            </TextH3>
            <TextP class="mb-2 truncate">
              Collected
              {{ formatDate(item.specimenCollectedTime, (t = false)) }}
            </TextP>
            <TextP>{{ item.resultItems.length }} results</TextP>
          </div>
          <div class="flex-shrink-0">
            <span class="sr-only">Open options</span>
            <IconChevronRight />
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
