<template>
  <div>
    <div class="mb-4 flex flex-col">
      <div class="flex flex-row gap-2">
        <GenericDateRange v-model="dateRange" class="flex-1" />
        <GenericButtonMini class="flex-none" @click="toggleOrder">
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
      <ul v-if="!events" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in events" :key="item.id" :item="item">
          <AuditListItem :item="item" />
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

import { nowString } from '@/helpers/utils/dateUtils'
import usePagination from '~/helpers/query/usePagination'
import useSortBy from '~/helpers/query/useSortBy'
import useDateRange from '~/helpers/query/useDateRange'

import fetchMasterRecords from '@/helpers/fetch/fetchMasterRecords'

import { AuditEvent } from '~/interfaces/audit'
import { MasterRecord } from '~/interfaces/masterrecord'

export default defineComponent({
  props: {
    record: {
      type: Object as () => MasterRecord,
      required: true,
    },
  },
  setup(props) {
    const { page, total, size } = usePagination()
    const { makeDateRange } = useDateRange()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()
    const { fetchMasterRecordAuditPage } = fetchMasterRecords()

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-30), nowString(0), true)

    // Data refs
    const events = ref<AuditEvent[]>()

    // Data fetching

    async function fetchEvents() {
      const eventsPage = await fetchMasterRecordAuditPage(
        props.record,
        page.value || 1,
        size.value,
        orderBy.value,
        dateRange.value.start,
        dateRange.value.end
      )

      events.value = eventsPage.items
      total.value = eventsPage.total
      page.value = eventsPage.page
      size.value = eventsPage.size
    }

    onMounted(() => {
      fetchEvents()
    })

    watch(
      [
        page,
        orderBy,
        () => JSON.stringify(dateRange), // Stringify to watch for actual value changes
      ],
      () => {
        fetchEvents()
      }
    )

    return {
      page,
      total,
      size,
      dateRange,
      events,
      orderAscending,
      orderBy,
      toggleOrder,
    }
  },
})
</script>
