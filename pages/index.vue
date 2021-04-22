<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">New Today</h1>
    </div>

    <div class="mb-8">
      <genericAlertWarning
        v-for="message in response.warnings"
        :key="message"
        :message="message"
      >
      </genericAlertWarning>

      <genericAlertInfo
        v-for="message in response.messages"
        :key="message"
        :message="message"
      >
      </genericAlertInfo>
    </div>

    <div class="max-w-7xl mx-auto mb-8">
      <dashStats
        :workitems="response.workitems"
        :ukrdcrecords="response.ukrdcrecords"
      />
    </div>

    <div v-if="$auth.hasScope('read:mirth')" class="max-w-7xl mx-auto mb-8">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Mirth Channels
      </h3>
      <div v-for="group in mirthGroups" :key="group.id" class="mb-6">
        <div class="mb-4">
          <h2 class="text-gray-600 text-xs font-medium uppercase tracking-wide">
            {{ group.name }}
          </h2>
          <p class="text-gray-500 text-xs font-medium">
            {{ group.description }}
          </p>
        </div>

        <ul
          class="my-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <li
            v-for="item in group.channels"
            :key="item.channelId"
            class="col-span-1"
          >
            <GenericCardMini class="px-4 py-2">
              <p
                class="text-gray-900 font-medium hover:text-gray-600 line-clamp-2"
              >
                {{ item.name }}
              </p>

              <p class="text-gray-500">
                {{ item.statistics.received }} received
              </p>
              <span
                v-if="item.statistics.error === 0"
                class="inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
                >No errors</span
              >
              <span
                v-else
                class="inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
                >{{ item.statistics.error }} errors</span
              >
            </GenericCardMini>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { DashResponse, ChannelStatistics } from '@/interfaces/dash'
import { ChannelGroup } from '@/interfaces/mirth'

export default Vue.extend({
  data() {
    return {
      messages: [] as string[],
      warnings: [] as string[],
      error: '',
      response: {} as DashResponse,
      mirthStatistics: [] as ChannelStatistics[],
      mirthGroups: [] as ChannelGroup[],
    }
  },
  async fetch() {
    const [dash, mirthGroups] = await Promise.all([
      this.$axios.$get(`${this.$config.apiBase}/dash/`),
      // Only read Mirth stats if user has permission
      this.$auth.hasScope('read:mirth')
        ? this.$axios.$get(`${this.$config.apiBase}/mirth/groups/`)
        : null,
    ])
    // Fetch the dashboard response from our API server
    this.response = dash
    this.messages = dash.messages
    this.warnings = dash.warnings
    this.mirthGroups = mirthGroups
  },
  head() {
    return {
      title: 'Dashboard',
    }
  },
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
