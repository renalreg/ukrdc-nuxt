<template>
  <div class="mt-4">
    <GenericSelect v-model="appliedFilter" class="mb-4">
      <option value="">All Observations</option>
      <option v-for="item in filterOptions" :key="item">{{ item }}</option>
    </GenericSelect>

    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="flex flex-col">
      <div class="-my-2 -mx-4 sm:-mx-6 md:-mx-8 overflow-x-auto">
        <div
          class="py-2 px-4 sm:px-6 md:px-8 align-middle inline-block min-w-full overflow-hidden"
        >
          <div
            class="shadow overflow-hidden border-b border-gray-200 rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Value
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Entered At
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Entered On
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="item in displayedObservations"
                  :key="item.observationDesc + item.observationTime"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ item.observationDesc }} {{ item.prePost }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.observationValue }} {{ item.observationUnits }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p>{{ item.enteredAt }}</p>
                    <p>{{ item.enteredAtDescription }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(item.observationTime) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

import { Observation } from '@/interfaces/observation'

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
      observations: [] as Observation[],
      appliedFilter: '' as string,
    }
  },
  async fetch() {
    const res: Observation[] = await this.$axios.$get(this.apiPath)
    this.observations = res
  },
  computed: {
    filterOptions(): string[] {
      const options: string[] = []
      for (const item of this.observations) {
        if (!options.includes(item.observationDesc)) {
          options.push(item.observationDesc)
        }
      }
      return options
    },
    displayedObservations(): Observation[] {
      let filteredObservations
      if (this.appliedFilter === '') {
        filteredObservations = this.observations
      } else {
        filteredObservations = this.observations.filter(
          (value: Observation) => {
            return value.observationDesc === this.appliedFilter
          }
        )
      }
      return filteredObservations.sort((a: Observation, b: Observation) =>
        a.observationTime < b.observationTime ? 1 : -1
      )
    },
  },
})
</script>
