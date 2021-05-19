<template>
  <div>
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

    <div
      v-if="$hasPermission('ukrdc:mirth:read')"
      class="max-w-7xl mx-auto mb-8"
    >
      <TextH2> Mirth Channels </TextH2>
      <div v-for="group in mirthGroups" :key="group.id" class="mb-6">
        <div class="mb-4">
          <TextH4>
            {{ group.name }}
          </TextH4>
          <TextL2>
            {{ group.description }}
          </TextL2>
        </div>

        <ul
          class="
            my-3
            grid grid-cols-1
            gap-5
            sm:gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <li
            v-for="item in group.channels"
            :key="item.channelId"
            class="col-span-1"
          >
            <GenericCardMini v-if="item.statistics" class="px-4 py-2">
              <TextH3 class="line-clamp-2">
                {{ item.name }}
              </TextH3>

              <TextP> {{ item.statistics.received }} received </TextP>
              <span
                v-if="item.statistics.error === 0"
                class="
                  inline-block
                  px-2
                  py-0.5
                  text-green-800 text-xs
                  font-medium
                  bg-green-100
                  rounded-sm
                  mt-2
                "
                >No errors</span
              >
              <span
                v-else
                class="
                  inline-block
                  px-2
                  py-0.5
                  text-red-800 text-xs
                  font-medium
                  bg-red-100
                  rounded-sm
                  mt-2
                "
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
import {
  defineComponent,
  ref,
  useFetch,
  useContext,
} from '@nuxtjs/composition-api'

import { DashResponse, ChannelStatistics } from '@/interfaces/dash'
import { ChannelGroup } from '@/interfaces/mirth'

export default defineComponent({
  setup() {
    const { $axios, $config, $hasPermission } = useContext()

    const response = ref({} as DashResponse)
    const messages = ref([] as string[])
    const warnings = ref([] as string[])
    const mirthStatistics = ref([] as ChannelStatistics[])
    const mirthGroups = ref([] as ChannelGroup[])

    const error = ref('')

    useFetch(async () => {
      const [dashResponse, mirthResponse] = await Promise.all([
        $axios.$get(`${$config.apiBase}/dash/`),
        // Only read Mirth stats if user has permission
        $hasPermission('ukrdc:mirth:read')
          ? $axios.$get(`${$config.apiBase}/mirth/groups/`)
          : null,
      ])
      // Fetch the dashboard response from our API server
      response.value = dashResponse
      messages.value = dashResponse.messages
      warnings.value = dashResponse.warnings
      mirthGroups.value = mirthResponse
    })

    return {
      response,
      messages,
      warnings,
      mirthStatistics,
      mirthGroups,
      error,
    }
  },

  head: {
    title: 'Dashboard',
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
