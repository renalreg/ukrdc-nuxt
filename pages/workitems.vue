<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
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
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                <tr v-for="item in workitems" :key="item.id">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ item.id }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-sm truncate"
                  >
                    {{ item.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.personId }} → {{ item.masterId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(item.lastUpdated) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <a href="#" class="text-indigo-600 hover:text-indigo-900"
                      >Edit</a
                    >
                  </td>
                </tr>
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { WorkItemShort } from 'interfaces/workitems'

interface WorkItemPage {
  items: WorkItemShort[]
  total: number
  page: number
  size: number
}

export default Vue.extend({
  data() {
    return {
      workitems: [] as WorkItemShort[],
      total: 0,
      page: 0,
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
    },
    formatDate(rawDate: string): string {
      const d: number = Date.parse(rawDate)
      const newDate = new Date(d)
      return newDate.toLocaleString()
    },
  },
})
</script>

<style></style>
