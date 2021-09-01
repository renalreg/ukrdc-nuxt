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
      <ul v-if="!workitems" class="divide-y divide-gray-200">
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
import { defineComponent, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'

import { WorkItem } from '@/interfaces/workitem'
import usePagination from '~/helpers/query/usePagination'

import useQuery from '~/helpers/query/useQuery'
import useFacilities from '~/helpers/useFacilities'
import useSortBy from '~/helpers/query/useSortBy'

import fetchWorkItems from '~/helpers/fetch/fetchWorkItems'

export default defineComponent({
  setup() {
    const route = useRoute()

    const { page, total, size } = usePagination()
    const { arrayQuery } = useQuery()
    const { facilities, facilityIds, facilityLabels, selectedFacility, fetchFacilities } = useFacilities()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()
    const { fetchWorkItemsPage } = fetchWorkItems()

    // Data refs

    const workitems = ref<WorkItem[]>()
    const statuses = arrayQuery('status', ['1'], true)

    // Data fetching

    async function fetchWorkitems() {
      const results = await fetchWorkItemsPage(
        page.value || 0,
        size.value,
        orderBy.value || 'desc',
        statuses.value,
        selectedFacility.value
      )

      workitems.value = results.items
      total.value = results.total
      page.value = results.page
      size.value = results.size
    }

    onMounted(() => {
      fetchWorkitems()
      fetchFacilities()
    })

    watch(route, () => {
      fetchWorkitems()
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
