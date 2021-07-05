<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="mb-4">
      <div class="mb-2 flex items-center">
        <FormCheckbox v-model="statuses" label="Open" :value="1" />
        <FormCheckbox v-model="statuses" label="WIP" :value="2" />
        <FormCheckbox v-model="statuses" label="Closed" :value="3" />
      </div>
      <GenericDateRange v-model="dateRange" />
      <GenericSearchableSelect
        v-model="selectedFacility"
        class="mb-4"
        :options="facilityIds"
        :labels="facilityLabels"
        hint="Select a facility..."
      />
    </div>

    <GenericCard>
      <!-- Skeleton results -->
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in workitems" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
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

import { WorkItemShort } from '@/interfaces/workitem'
import useQuery from '~/mixins/useQuery'
import useFacilities from '~/mixins/useFacilities'
import { nowString } from '~/utilities/dateUtils'

interface WorkItemPage {
  items: WorkItemShort[]
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
    const { arrayQuery } = useQuery()
    const { facilities, facilityIds, facilityLabels, selectedFacility, fetchFacilities } = useFacilities()

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-365), nowString(0), true)

    const workitems = ref([] as WorkItemShort[])
    const statuses = arrayQuery('status', ['1'], true)

    const { fetch } = useFetch(async () => {
      console.log('Fetchign workitems')
      // Fetch the dashboard response from our API server
      let path = `${$config.apiBase}/workitems/?page=${page.value}&size=${size.value}`
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
      // Pass selected statuses to the API
      for (const status of statuses.value) {
        path = path + `&status=${status}`
      }
      // Filter by facility if it exists
      if (selectedFacility.value) {
        path = path + `&facility=${selectedFacility.value}`
      }
      const res: WorkItemPage = await $axios.$get(path)
      workitems.value = res.items
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
      workitems,
      statuses,
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
    }
  },
  head: {
    title: 'Work Items',
  },
})
</script>

<style></style>
