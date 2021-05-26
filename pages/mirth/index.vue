<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Mirth Channels</h1>
    </div>

    <div class="max-w-7xl mx-auto mb-8">
      <div v-for="group in mirthGroups" :key="group.id" class="mb-6">
        <div class="mb-4">
          <TextH4>
            {{ group.name }}
          </TextH4>
          <TextL2>
            {{ group.description }}
          </TextL2>
        </div>

        <ul class="my-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="item in group.channels" :key="item.channelId" class="col-span-1">
            <GenericCardMini v-if="item.statistics" class="px-4 py-2">
              <TextH3 class="line-clamp-2">
                {{ item.name }}
              </TextH3>

              <TextP> {{ item.statistics.received }} received </TextP>
              <span
                v-if="item.statistics.error === 0"
                class="inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
                >No errors</span
              >
              <span v-else class="inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
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
import { defineComponent, ref, useFetch, useContext } from '@nuxtjs/composition-api'

import { ChannelStatistics } from '@/interfaces/dash'
import { ChannelGroup } from '@/interfaces/mirth'

export default defineComponent({
  setup() {
    const { $axios, $config } = useContext()

    const mirthStatistics = ref([] as ChannelStatistics[])
    const mirthGroups = ref([] as ChannelGroup[])

    const error = ref('')

    useFetch(async () => {
      mirthGroups.value = await $axios.$get(`${$config.apiBase}/mirth/groups/`)
    })

    return {
      mirthStatistics,
      mirthGroups,
      error,
    }
  },

  head: {
    title: 'Mirth Channels',
  },
})
</script>
