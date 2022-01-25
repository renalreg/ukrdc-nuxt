<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="mb-4 flex flex-col">
      <GenericDateRange v-model="dateRange" class="mb-4" />
      <GenericSearchableSelect
        v-if="facilityIds.length > 1"
        v-model="selectedFacility"
        class="mb-4"
        :options="facilityIds"
        :labels="facilityLabels"
        hint="Select a facility..."
      />
      <div class="flex items-center">
        <div class="flex flex-grow items-center">
          <FormCheckbox v-model="statuses" label="Open" :value="1" />
          <FormCheckbox v-model="statuses" label="WIP" :value="2" />
          <FormCheckbox v-model="statuses" label="Closed" :value="3" />
        </div>
        <GenericButtonMini class="flex-shrink" @click="toggleOrder">
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
      <ul v-if="fetchInProgress" class="divide-y divide-gray-200">
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
        class="border-t border-gray-200 bg-white"
        :page="page"
        :size="size"
        :total="total"
        @next="page++"
        @prev="page--"
        @jump="page = $event"
      />
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'

import { WorkItem } from '@/interfaces/workitem'
import usePagination from '~/helpers/query/usePagination'

import useQuery from '~/helpers/query/useQuery'
import useFacilities from '~/helpers/useFacilities'
import useSortBy from '~/helpers/query/useSortBy'

import fetchWorkItems from '~/helpers/fetch/fetchWorkItems'
import useDateRange from '~/helpers/query/useDateRange'

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination()
    const { makeDateRange } = useDateRange()
    const { arrayQuery } = useQuery()
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()
    const { fetchWorkItemsPage } = fetchWorkItems()

    // Data refs

    const workitems = ref<WorkItem[]>()
    const statuses = arrayQuery('status', ['1'], true, true)

    const fetchInProgress = ref(false)

    // Set initial date dateRange
    const dateRange = makeDateRange(null, null, true, true)

    // Data fetching

    async function getWorkitems() {
      fetchInProgress.value = true

      const itemsPage = await fetchWorkItemsPage(
        page.value || 1,
        size.value,
        orderBy.value || 'desc',
        statuses.value,
        selectedFacility.value,
        dateRange.value.start,
        dateRange.value.end
      )

      workitems.value = itemsPage.items
      page.value = itemsPage.page
      total.value = itemsPage.total
      size.value = itemsPage.size

      fetchInProgress.value = false
    }

    onMounted(() => {
      getWorkitems()
    })

    watch(
      [
        page,
        selectedFacility,
        orderBy,
        () => JSON.stringify(dateRange.value), // Stringify to watch for actual value changes
        () => JSON.stringify(statuses.value), // Stringify to watch for actual value changes
      ],
      () => {
        getWorkitems()
      }
    )

    return {
      fetchInProgress,
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
