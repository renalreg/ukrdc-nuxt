<template>
  <div class="mt-4">
    <div v-if="activeMedications.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Active
      </h2>

      <ul
        class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <li
          v-for="(item, index) of activeMedications"
          :key="index"
          class="col-span-1"
        >
          <medicationsCard :item="item" />
        </li>
      </ul>
    </div>

    <div v-if="inactiveMedications.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Inactive
      </h2>

      <ul
        class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <li
          v-for="(item, index) of inactiveMedications"
          :key="index"
          class="col-span-1"
        >
          <medicationsCard :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

import { Medication } from '@/interfaces/medication'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  props: {
    apiPath: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      medications: [] as Medication[],
    }
  },
  async fetch() {
    const res: Medication[] = await this.$axios.$get(this.apiPath)
    this.medications = res
  },
  computed: {
    activeMedications(): Medication[] {
      return this.medications.filter(function (item: Medication) {
        return item.toTime === null
      })
    },
    inactiveMedications(): Medication[] {
      return this.medications.filter(function (item: Medication) {
        return item.toTime !== null
      })
    },
  },
})
</script>
