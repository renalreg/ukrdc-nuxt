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

    <div class="max-w-7xl mx-auto mb-8">
      <dashStats
        :workitems="response.workitems"
        :ukrdcrecords="response.ukrdcrecords"
      />
    </div>

    <div>
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Mirth Channels
      </h3>
      <p class="text-xs font-medium text-gray-500 truncate mb-4">
        Key channel statistics. Some channels may be hidden.
      </p>
      <ul
        class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <li
          v-for="item in mirthStatistics"
          :key="item.channelId"
          class="col-span-1"
        >
          <div
            class="items-center justify-between px-4 py-2 text-sm shadow-sm border border-gray-200 bg-white rounded-md"
          >
            <p
              class="text-gray-900 font-medium hover:text-gray-600 line-clamp-2"
            >
              {{ item.name }}
            </p>

            <p class="text-gray-500">{{ item.received }} received</p>
            <span
              v-if="item.error === 0"
              class="inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
              >No errors</span
            >
            <span
              v-else
              class="inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
              >{{ item.error }} errors</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { DashResponse, ChannelStatistics } from 'interfaces/dash'

export default Vue.extend({
  data() {
    return {
      messages: [] as string[],
      warnings: [] as string[],
      error: '',
      response: {} as DashResponse,
      mirthStatistics: [] as ChannelStatistics[],
    }
  },
  async fetch() {
    const [res, mirthStatistics] = await Promise.all([
      this.$axios.$get('/api/dash'),
      this.$axios.$get('/api/dash/mirth'),
    ])
    // Fetch the dashboard response from our API server
    this.response = res
    this.messages = res.messages
    this.warnings = res.warnings
    this.mirthStatistics = mirthStatistics
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
