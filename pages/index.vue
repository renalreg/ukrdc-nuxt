<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">New Today</h1>
    </div>

    <div v-if="response.message" class="rounded-md bg-blue-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <!-- Heroicon name: solid/information-circle -->
          <svg
            class="h-5 w-5 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm text-blue-700">
            {{ response.message }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <dashStats
        v-if="response.workitems && response.ukrdcrecords"
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
      message: 'Default message',
      error: '',
      response: {} as DashResponse,
    }
  },
  async fetch() {
    // Fetch the dashboard response from our API server
    const res: DashResponse = await this.$axios.$get('/api/dash')
    this.response = res
    this.message = res.message
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
