<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Errors</h1>
    </div>

    <GenericDateRange v-model="range" />
    <GenericSearchableSelect
      v-model="selectedFacility"
      class="mb-4"
      :options="availableFacilities"
      hint="Select a facility..."
    />

    <GenericCard>
      <!-- Skeleton results -->
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <errorsListItem v-for="item in messages" :key="item.id" :item="item" />
      </ul>
      <GenericPaginator
        v-if="!$fetchState.pending"
        class="bg-white border-t border-gray-200"
        :page="page"
        :size="size"
        :total="total"
        @next="page++"
        @prev="page--"
      />
    </GenericCard>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  useRoute,
  useFetch,
  useContext,
} from '@nuxtjs/composition-api'

import usePagination from '@/mixins/usePagination'
import useDateRange from '@/mixins/useDateRange'

import { Message } from '@/interfaces/errors'
import useQuery from '~/mixins/useQuery'

interface MessagePage {
  items: Message[]
  total: number
  page: number
  size: number
}

export default defineComponent({
  setup() {
    const route = useRoute()

    const { $axios, $config } = useContext()
    const { page, total, size } = usePagination()
    const { range, since, until } = useDateRange()
    const { stringQuery } = useQuery()

    const messages = ref([] as Message[])

    const availableFacilities = ref([] as string[])
    const selectedFacility = stringQuery('facility', true)

    const { fetch } = useFetch(async () => {
      // Fetch the dashboard response from our API server
      let path = `${$config.apiBase}/errors/messages/?status=ERROR&page=${page.value}&size=${size.value}`
      // Filter by since if it exists
      if (since.value) {
        path = path + `&since=${since.value}`
      }
      // Pass `until` to API if it's given
      if (until.value) {
        path = path + `&until=${until.value}`
      } else if (since.value) {
        // If no `until` is given but a `since` is given, then a single date is selected
        // In this case we want to only show that one day, not a range
        path = path + `&until=${since.value}`
      }
      // Filter by facility if it exists
      if (selectedFacility.value) {
        path = path + `&facility=${selectedFacility.value}`
      }
      const res: MessagePage = await $axios.$get(path)
      messages.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size

      // If we don't already have a list of available facilties, fetch one
      if (availableFacilities.value.length === 0) {
        availableFacilities.value = await $axios.$get(
          `${$config.apiBase}/errors/messages/facilities/`
        )
      }
    })

    watch(route, () => {
      fetch()
    })

    return {
      page,
      total,
      size,
      range,
      since,
      until,
      messages,
      availableFacilities,
      selectedFacility,
    }
  },

  head: {
    title: 'Mirth Errors',
  },
})
</script>
