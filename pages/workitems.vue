<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="py-2 align-middle inline-block w-full">
      <!-- Rounded container -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 rounded-md sm:rounded-lg max-w-7xl"
      >
        <!-- Activity list (up to large breakpoint) -->
        <div class="shadow lg:hidden">
          <ul class="divide-y divide-gray-200 overflow-hidden shadow">
            <workitemsListItem
              v-for="item in workitems"
              :key="item.id"
              :item="item"
            >
            </workitemsListItem>
          </ul>
        </div>

        <!-- Activity table (large breakopoint and up) -->
        <table
          class="hidden lg:table table-auto w-full divide-y divide-gray-200"
        >
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Records
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Updated
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <workitemsTableItem
              v-for="item in workitems"
              :key="item.id"
              :item="item"
            >
            </workitemsTableItem>
          </tbody>
        </table>

        <paginator
          class="bg-white border-t border-gray-200"
          :page="page"
          :size="size"
          :total="total"
          @next="changePage(page + 1)"
          @prev="changePage(page - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { WorkItemShort } from 'interfaces/workitems'
import dateUtilsMixin from '@/mixins/dateutils'

interface WorkItemPage {
  items: WorkItemShort[]
  total: number
  page: number
  size: number
}

export default Vue.extend({
  mixins: [dateUtilsMixin],
  data() {
    return {
      workitems: [] as WorkItemShort[],
      total: 0,
      page: (this.$route.query.page || 0) as Number,
      size: 20,
    }
  },
  async fetch() {
    // Fetch the dashboard response from our API server
    const res: WorkItemPage = await this.$axios.$get(
      `/empi/workitems?page=${this.page}&size=${this.size}`
    )
    console.log(res)
    this.workitems = res.items
    this.total = res.total
    this.page = res.page
    this.size = res.size
  },
  head() {
    return {
      title: 'Work Items',
    }
  },
  methods: {
    changePage(newPage: number): void {
      this.page = newPage
      this.$fetch()
      this.$router.push({
        path: this.$route.path,
        query: { page: newPage.toString() },
      })
    },
  },
})
</script>

<style></style>
