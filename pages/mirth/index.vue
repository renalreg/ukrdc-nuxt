<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1 class="text-2xl font-semibold text-gray-900">Mirth Channels</h1>
    </div>

    <LoadingIndicator v-if="!mirthGroups"></LoadingIndicator>
    <div v-else class="mx-auto mb-8 max-w-7xl">
      <div v-for="group in mirthGroups" :key="group.id" class="mb-6">
        <div class="mb-4">
          <TextH4>
            {{ group.name }}
          </TextH4>
          <TextL2>
            {{ group.description }}
          </TextL2>
        </div>

        <ul class="my-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <li v-for="item in group.channels" :key="item.channelId" class="col-span-1">
            <GenericCard class="px-4 py-2">
              <TextH3 class="truncate">
                {{ item.name }}
              </TextH3>
              <TextL1> Rev. {{ item.revision }} </TextL1>
              <TextP> {{ item.statistics ? item.statistics.received : 'Unknown' }} received </TextP>
              <span
                v-if="item.statistics && item.statistics.error === 0"
                class="mt-2 inline-block rounded-sm bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800"
                >No errors</span
              >
              <span
                v-else-if="item.statistics && item.statistics.error > 0"
                class="mt-2 inline-block rounded-sm bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800"
                >{{ item.statistics.error }} errors</span
              >
            </GenericCard>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import fetchMirth from '~/helpers/fetch/fetchMirth'

import { ChannelGroup } from '@/interfaces/mirth'

export default defineComponent({
  setup() {
    const { fetchMirthGroups } = fetchMirth()

    // Data refs
    const mirthGroups = ref<ChannelGroup[]>()

    // Data fetching
    onMounted(async () => {
      mirthGroups.value = await fetchMirthGroups()
    })

    return {
      mirthGroups,
    }
  },

  head: {
    title: 'Mirth Channels',
  },
})
</script>
