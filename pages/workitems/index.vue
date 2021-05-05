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
      <div>
        <client-only>
          <v-date-picker
            v-model="range"
            :model-config="modelConfig"
            color="indigo"
            is-range
          >
            <template #default="{ inputValue, inputEvents }">
              <div class="flex items-center">
                <input
                  type="text"
                  :value="inputValue.start"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  v-on="inputEvents.start"
                />
                <svg
                  class="w-4 h-4 mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <input
                  type="text"
                  :value="inputValue.end"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  v-on="inputEvents.end"
                />
              </div>
            </template>
          </v-date-picker>
        </client-only>
        <p v-if="!since" class="text-xs italic mt-1">Filter by date</p>
      </div>
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

import { singleQuery } from '@/utilities/queryUtils'
import { todayString, DateRange } from '@/utilities/dateUtils'

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

    const since = ref((singleQuery(route.value.query.since) || null) as string)
    const until = ref(
      (singleQuery(route.value.query.until) || todayString(0)) as string
    )
    const range = computed({
      get: () => {
        return {
          start: since.value,
          end: since.value,
        }
      },
      set(newRange: DateRange) {
        since.value = newRange.start
        until.value = newRange.end

        const newQuery = Object.assign({}, route.value.query, {
          since: since.value,
          until: until.value,
        })
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })

    const modelConfig = {
      start: {
        type: 'string',
        mask: 'YYYY-MM-DD',
      },
      end: {
        type: 'string',
        mask: 'YYYY-MM-DD',
      },
    }

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
      since,
      until,
      workitems,
      statuses,
      range,
      modelConfig,
    }
  },
  head: {
    title: 'Work Items',
  },
})
</script>

<style></style>
