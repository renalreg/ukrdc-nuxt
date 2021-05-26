<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">New Today</h1>
    </div>

    <div class="mb-8">
      <genericAlertWarning v-for="message in response.warnings" :key="message" :message="message">
      </genericAlertWarning>

      <genericAlertInfo v-for="message in response.messages" :key="message" :message="message"> </genericAlertInfo>
    </div>

    <div class="max-w-7xl mx-auto mb-8">
      <dashStats :workitems="response.workitems" :ukrdcrecords="response.ukrdcrecords" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch, useContext } from '@nuxtjs/composition-api'

import { DashResponse } from '@/interfaces/dash'

export default defineComponent({
  setup() {
    const { $axios, $config } = useContext()

    const response = ref({} as DashResponse)
    const messages = ref([] as string[])
    const warnings = ref([] as string[])

    const error = ref('')

    useFetch(async () => {
      const dashResponse: DashResponse = await $axios.$get(`${$config.apiBase}/dash/`)
      // Fetch the dashboard response from our API server
      response.value = dashResponse
      messages.value = dashResponse.messages
      warnings.value = dashResponse.warnings
    })

    return {
      response,
      messages,
      warnings,
      error,
    }
  },

  head: {
    title: 'Dashboard',
  },
})
</script>
