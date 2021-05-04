<template>
  <div class="mt-4">
    <GenericSelect v-model="selectedCode" class="mb-4">
      <option :value="null">All Observations</option>
      <option v-for="item in availableCodes" :key="item">
        {{ item }}
      </option>
    </GenericSelect>

    <!-- Small data card display -->
    <div class="lg:hidden">
      <GenericCardFlat
        v-for="item in observations"
        :key="
          item.observationDesc +
          item.observationTime +
          item.observationValue +
          '-card'
        "
        class="grid grid-cols-3 gap-2 mb-4 px-4 py-4"
      >
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Type
        </div>
        <TextP class="col-span-2 font-medium text-gray-900"
          >{{ item.observationDesc }} {{ item.prePost }}</TextP
        >
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Value
        </div>
        <TextP class="col-span-2"
          >{{ item.observationValue }} {{ item.observationUnits }}</TextP
        >
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Entered At
        </div>
        <div class="col-span-2">
          <TextP>{{ item.enteredAt }}</TextP>
          <TextP>{{ item.enteredAtDescription }}</TextP>
        </div>
        <div
          class="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1"
        >
          Entered On
        </div>
        <TextP class="col-span-2">{{ formatDate(item.observationTime) }}</TextP>
      </GenericCardFlat>
    </div>
    <!-- Large table display -->
    <div class="-my-2 -mx-4 sm:-mx-6 md:-mx-8 overflow-x-auto hidden lg:block">
      <div
        class="py-2 px-4 sm:px-6 md:px-8 align-middle inline-block min-w-full overflow-hidden"
      >
        <GenericCard>
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
                v-for="item in observations"
                :key="
                  item.observationDesc +
                  item.observationTime +
                  item.observationValue
                "
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
        </GenericCard>
      </div>
    </div>

    <div v-if="observations.length > 0" class="mt-4">
      <GenericCard>
        <GenericPaginator
          v-if="!$fetchState.pending"
          :page="page"
          :size="size"
          :total="total"
          @next="changePage(page + 1)"
          @prev="changePage(page - 1)"
        />
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'

import { arrayQuery } from '@/utilities/queryUtils'

import dateUtilsMixin from '@/mixins/dateUtilsClass'
import codeUtilsMixin from '@/mixins/codeUtilsClass'
import pagionationMixin from '@/mixins/paginationClass'

import { Observation } from '@/interfaces/observation'
import { PatientRecord } from '@/interfaces/patientrecord'

interface ObservationPage {
  items: Observation[]
  total: number
  page: number
  size: number
}

@Component
export default class ObservationsNuxtPage extends mixins(
  dateUtilsMixin, // Date parsing methods
  codeUtilsMixin, // Result coding methods
  pagionationMixin // Pagination data and methods
) {
  // Props
  @Prop(Object) readonly record!: PatientRecord

  // Data
  observations: Observation[] = []

  availableCodes: string[] = []
  selectedCodes = (arrayQuery(this.$route.query.code) || [null]) as string[]

  // Lifecycle
  async fetch() {
    let path = `${this.apiPath}?page=${this.page}&size=${this.size}`

    for (const code of this.selectedCodes) {
      if (code) {
        path = path + `&code=${code}`
      }
    }

    const res: ObservationPage = await this.$axios.$get(path)
    this.observations = res.items
    this.total = res.total
    this.page = res.page
    this.size = res.size

    if (this.availableCodes.length === 0) {
      const availableCodes: string[] = await this.$axios.$get(
        `${this.apiPath}codes`
      )
      this.availableCodes = availableCodes
    }
  }

  // Computed
  get apiPath(): string {
    return this.record.links.observations
  }

  get selectedCode(): string {
    return this.selectedCodes[0]
  }

  set selectedCode(newCode: string) {
    this.selectedCodes = [newCode]

    const newQuery = Object.assign({}, this.$route.query, {
      code: this.selectedCodes,
    })
    this.$router.push({
      path: this.$route.path,
      query: newQuery,
    })
  }

  @Watch('$route.query')
  queryChanged() {
    this.$fetch()
  }
}
</script>
