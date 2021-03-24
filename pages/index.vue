<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">New Today</h1>
    </div>

    <alertsWarning
      v-for="message in response.warnings"
      :key="message"
      :message="message"
    >
    </alertsWarning>

    <alertsInfo
      v-for="message in response.messages"
      :key="message"
      :message="message"
    >
    </alertsInfo>

    <div class="max-w-7xl mx-auto">
      <dashStats
        :workitems="response.workitems"
        :ukrdcrecords="response.ukrdcrecords"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { DashResponse } from 'interfaces/dash'

export default Vue.extend({
  data() {
    return {
      messages: [] as string[],
      warnings: [] as string[],
      error: '',
      response: {} as DashResponse,
    }
  },
  async fetch() {
    // Fetch the dashboard response from our API server
    const res: DashResponse = await this.$axios.$get('/api/dash')
    this.response = res
    this.messages = res.messages
    this.warnings = res.warnings
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
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
