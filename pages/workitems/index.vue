<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Work Items</h1>
    </div>

    <div class="mb-4">
      <div class="mb-2 flex items-center">
        <GenericCheckbox v-model="statuses" label="Open" :value="1" />
        <GenericCheckbox v-model="statuses" label="WIP" :value="2" />
        <GenericCheckbox v-model="statuses" label="Closed" :value="3" />
      </div>
      <GenericDateRange v-model="range" />
    </div>

    <div v-if="workitems.length > 0">
      <GenericCard>
        <!-- Skeleton results -->
        <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
          <SkeleListItem v-for="n in 10" :key="n" />
        </ul>
        <!-- Real results -->
        <ul v-else class="divide-y divide-gray-200">
          <workitemsListItem
            v-for="item in workitems"
            :key="item.id"
            :item="item"
          />
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  useRoute,
  useRouter,
  useFetch,
  useContext,
  computed,
} from '@nuxtjs/composition-api'

import usePagination from '@/mixins/usePagination'
import useDateRange from '@/mixins/useDateRange'

import { WorkItemShort } from '@/interfaces/workitem'

interface WorkItemPage {
  items: WorkItemShort[]
  total: number
  page: number
  size: number
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const { $axios, $config } = useContext()
    const { page, total, size } = usePagination()
    const { range, since, until } = useDateRange()

    const workitems = ref([] as WorkItemShort[])

    const selectedStatuses = ref((route.value.query.status || [1]) as number[])
    const statuses = computed({
      get: () => {
        return selectedStatuses.value
      },
      set(newStatuses: number[]) {
        selectedStatuses.value = newStatuses

        const newQuery = Object.assign({}, route.value.query, {
          status: selectedStatuses.value,
        })
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })

    const { fetch } = useFetch(async () => {
      // Fetch the dashboard response from our API server
      let path = `${$config.apiBase}/empi/workitems/?page=${page.value}&size=${size.value}`
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
      // Pass selected statuses to the API
      for (const status of selectedStatuses.value) {
        path = path + `&status=${status}`
      }
      const res: WorkItemPage = await $axios.$get(path)
      workitems.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size
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
      workitems,
      statuses,
    }
  },
  head: {
    title: 'Work Items',
  },
})
</script>

<style></style>
