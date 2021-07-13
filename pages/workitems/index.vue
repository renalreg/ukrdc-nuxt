<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="mb-4 flex flex-col">
      <div class="mb-2 flex items-center">
        <FormCheckbox v-model="statuses" label="Open" :value="1" />
        <FormCheckbox v-model="statuses" label="WIP" :value="2" />
        <FormCheckbox v-model="statuses" label="Closed" :value="3" />
      </div>
      <GenericSearchableSelect
        v-if="facilityIds.length > 1"
        v-model="selectedFacility"
        class="mb-4"
        :options="facilityIds"
        :labels="facilityLabels"
        hint="Select a facility..."
      />
      <div>
        <GenericButtonMini class="float-right" @click="toggleOrder">
          <div v-show="orderAscending" class="flex">
            <TextP>Oldest - Newest</TextP><IconMiniSortAscending class="ml-2" />
          </div>
          <div v-show="!orderAscending" class="flex">
            <TextP>Newest - Oldest</TextP><IconMiniSortDescending class="ml-2" />
          </div>
        </GenericButtonMini>
      </div>
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

import { WorkItemShort } from '@/interfaces/workitem'
import useQuery from '~/mixins/useQuery'
import useFacilities from '~/mixins/useFacilities'
import useSortBy from '~/mixins/useSortBy'

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
    const { arrayQuery } = useQuery()
    const { facilities, facilityIds, facilityLabels, selectedFacility, fetchFacilities } = useFacilities()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()

    const workitems = ref([] as WorkItemShort[])
    const statuses = arrayQuery('status', ['1'], true)

    const { fetch } = useFetch(async () => {
      // Fetch the dashboard response from our API server
      let path = `${$config.apiBase}/v1/workitems/?page=${page.value}&size=${size.value}&sort_by=last_updated&order_by=${orderBy.value}`
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
      workitems,
      statuses,
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
      orderAscending,
      orderBy,
      toggleOrder,
    }
  },
  head: {
    title: 'Work Items',
  },
})
</script>

<style></style>
