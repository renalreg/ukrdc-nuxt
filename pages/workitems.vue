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
        <!-- Activity list (smallest breakopoint only) -->
        <div class="shadow lg:hidden">
          <ul class="divide-y divide-gray-200 overflow-hidden shadow">
            <li v-for="item in workitems" :key="item.id">
              <a href="#" class="block px-4 py-4 bg-white hover:bg-gray-50">
                <span class="flex items-center space-x-4">
                  <span class="flex-1 flex space-x-2 truncate">
                    <span class="flex flex-col text-gray-500 text-sm truncate">
                      <span class="truncate"
                        >{{ item.id }} - {{ item.description }}</span
                      >
                      <span class="text-gray-900 font-medium"
                        >{{ item.personId }} → {{ item.masterId }}</span
                      >

                      <span>{{ formatDate(item.lastUpdated) }}</span>
                    </span>
                  </span>
                  <!-- Heroicon name: solid/chevron-right -->
                  <svg
                    class="flex-shrink-0 h-5 w-5 text-gray-400"
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
                </span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Activity table (small breakopoint and up) -->
        <table
          class="hidden table-auto lg:table w-full divide-y divide-gray-200"
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
            <tr v-for="item in workitems" :key="item.id">
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

<style></style>
