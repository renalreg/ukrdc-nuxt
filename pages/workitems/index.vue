<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="mb-4">
      <div class="mb-2 flex items-center">
        <GenericCheckbox v-model="statuses" label="Open" :value="1" />
        <GenericCheckbox v-model="statuses" label="WIP" :value="2" />
        <GenericCheckbox v-model="statuses" label="Closed" :value="3" />
      </div>
      <div>
        <client-only>
          <v-date-picker
            v-model="range"
            :model-config="modelConfig"
            color="indigo"
            is-range
          >
            <template #default="{ inputValue, inputEvents }">
              <div class="flex items-center">
                <input
                  type="text"
                  :value="inputValue.start"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  v-on="inputEvents.start"
                />
                <svg
                  class="w-4 h-4 mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <input
                  type="text"
                  :value="inputValue.end"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  v-on="inputEvents.end"
                />
              </div>
            </template>
          </v-date-picker>
        </client-only>
        <p v-if="!since" class="text-xs italic mt-1">Filter by date</p>
      </div>
    </div>

    <div v-if="workitems.length > 0">
      <GenericCard>
        <!-- Skeleton results -->
        <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
          <SkeleListItem v-for="n in 10" :key="n" />
        </ul>
        <!-- Real results -->
        <ul v-else class="divide-y divide-gray-200">
          <workitemsListItem
            v-for="item in workitems"
            :key="item.id"
            :item="item"
          />
        </ul>
        <GenericPaginator
          v-if="!$fetchState.pending"
          class="bg-white border-t border-gray-200"
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
import { Component, Watch, mixins } from 'nuxt-property-decorator'

import { singleQuery } from '@/utilities/queryUtils'
import { todayString, DateRange } from '@/utilities/dateUtils'

import dateUtilsMixin from '@/mixins/dateUtilsClass'
import pagionationMixin from '@/mixins/paginationClass'

import { WorkItemShort } from '@/interfaces/workitem'

interface WorkItemPage {
  items: WorkItemShort[]
  total: number
  page: number
  size: number
}

@Component
export default class WorkItemsNuxtPage extends mixins(
  dateUtilsMixin,
  pagionationMixin
) {
  // Data
  workitems: WorkItemShort[] = []

  since = (singleQuery(this.$route.query.since) || null) as string
  until = (singleQuery(this.$route.query.until) || todayString(0)) as string
  selectedStatuses: number[] = (this.$route.query.status || [1]) as number[]

  modelConfig = {
    start: {
      type: 'string',
      mask: 'YYYY-MM-DD',
    },
    end: {
      type: 'string',
      mask: 'YYYY-MM-DD',
    },
  }

  async fetch() {
    // Fetch the dashboard response from our API server
    let path = `${this.$config.apiBase}/empi/workitems/?page=${this.page}&size=${this.size}`
    if (this.since) {
      path = path + `&since=${this.since}`
    }
    // Pass `until` to API if it's given
    if (this.until) {
      path = path + `&until=${this.until}`
    } else if (this.since) {
      // If no `until` is given but a `since` is given, then a single date is selected
      // In this case we want to only show that one day, not a range
      path = path + `&until=${this.since}`
    }
    // Pass selected statuses to the API
    for (const status of this.selectedStatuses) {
      path = path + `&status=${status}`
    }
    const res: WorkItemPage = await this.$axios.$get(path)
    this.workitems = res.items
    this.total = res.total
    this.page = res.page
    this.size = res.size
  }

  head() {
    return {
      title: 'Work Items',
    }
  }

  get today(): string {
    return todayString(0)
  }

  get range(): DateRange {
    return {
      start: this.since,
      end: this.until,
    }
  }

  set range(newRange: DateRange) {
    this.since = newRange.start
    this.until = newRange.end

    const newQuery = Object.assign({}, this.$route.query, {
      since: this.since,
      until: this.until,
    })
    this.$router.push({
      path: this.$route.path,
      query: newQuery,
    })
  }

  get statuses(): number[] {
    return this.selectedStatuses
  }

  set statuses(newStatuses: number[]) {
    this.selectedStatuses = newStatuses

    const newQuery = Object.assign({}, this.$route.query, {
      status: this.selectedStatuses,
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

<style></style>
