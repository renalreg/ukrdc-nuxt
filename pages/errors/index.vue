<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Errors</h1>
    </div>

    <div class="mb-4 flex flex-col">
      <GenericDateRange v-model="dateRange" />
      <GenericSearchableSelect
        v-if="facilityIds.length > 1"
        v-model="selectedFacility"
        class="mb-4"
        :options="facilityIds"
        :labels="facilityLabels"
        hint="Select a facility..."
      />
      <div class="flex gap-2 flex-row-reverse">
        <GenericButtonMini @click="toggleOrder">
          <div v-show="orderAscending" class="flex">
            <TextP>Oldest - Newest</TextP><IconMiniSortAscending class="ml-2" />
          </div>
          <div v-show="!orderAscending" class="flex">
            <TextP>Newest - Oldest</TextP><IconMiniSortDescending class="ml-2" />
          </div>
        </GenericButtonMini>

        <GenericButtonMini v-show="nationalId" @click="$router.push({ query: { nationalid: null } })"
          >Show Results From All Patients</GenericButtonMini
        >
      </div>
    </div>

    <GenericCard>
      <!-- Skeleton results -->
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in messages" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/errors/${item.id}`">
            <ErrorsListItem :item="item" />
          </NuxtLink>
        </div>
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
import { defineComponent, watch, ref, useRoute, useFetch, useContext } from '@nuxtjs/composition-api'

import usePagination from '@/mixins/usePagination'
import useDateRange from '@/mixins/useDateRange'
import { nowString } from '@/utilities/dateUtils'

import { Message } from '@/interfaces/errors'
import useFacilities from '~/mixins/useFacilities'
import useQuery from '~/mixins/useQuery'
import useSortBy from '~/mixins/useSortBy'

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
    const { makeDateRange } = useDateRange()
    const { stringQuery } = useQuery()
    const { facilities, facilityIds, facilityLabels, selectedFacility, fetchFacilities } = useFacilities()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()

    // Set up URL query params for additional filters
    const nationalId = stringQuery('nationalid', null, true, true)

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-365), nowString(0), true)

    const messages = ref([] as Message[])

    const { fetch } = useFetch(async () => {
      // Fetch the dashboard response from our API server
      let path = `${$config.apiBase}/v1/errors/messages/?status=ERROR&page=${page.value}&size=${size.value}&sort_by=received&order_by=${orderBy.value}`
      // Filter by since if it exists
      if (dateRange.value.start) {
        path = path + `&since=${dateRange.value.start}`
      }
      // Pass `until` to API if it's given
      if (dateRange.value.end) {
        path = path + `&until=${dateRange.value.end}`
      } else if (dateRange.value.start) {
        // If no `until` is given but a `since` is given, then a single date is selected
        // In this case we want to only show that one day, not a dateRange
        path = path + `&until=${dateRange.value.start}`
      }
      // Filter by facility if it exists
      if (selectedFacility.value) {
        path = path + `&facility=${selectedFacility.value}`
      }
      // Filter by national ID if it exists
      if (nationalId.value) {
        path = path + `&ni=${nationalId.value}`
      }
      const res: MessagePage = await $axios.$get(path)
      messages.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size

      await fetchFacilities()
    })

    watch(route, () => {
      fetch()
    })

    return {
      page,
      total,
      size,
      dateRange,
      messages,
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
      nationalId,
      orderAscending,
      orderBy,
      toggleOrder,
    }
  },

  head: {
    title: 'Mirth Errors',
  },
})
</script>
