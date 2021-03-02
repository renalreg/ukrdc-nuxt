<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
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
      title: 'Dashboard',
    }
  },
  methods: {},
})
</script>

<style>
</style>
