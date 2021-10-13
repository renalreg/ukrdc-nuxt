<template>
  <div>
    <div class="mb-4 flex flex-col">
      <div class="flex gap-2 flex-row">
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
      <ul v-if="!messages" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in messages" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :show-patient-filter="false" :item="item" />
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

import { nowString } from '@/helpers/utils/dateUtils'
import usePagination from '~/helpers/query/usePagination'
import useSortBy from '~/helpers/query/useSortBy'

import fetchMasterRecords from '@/helpers/fetch/fetchMasterRecords'

import { Message } from '~/interfaces/messages'
import { MasterRecord, MasterRecordStatistics } from '~/interfaces/masterrecord'
import useDateRange from '~/helpers/query/useDateRange'

export default defineComponent({
  props: {
    record: {
      type: Object as () => MasterRecord,
      required: true,
    },
    stats: {
      type: Object as () => MasterRecordStatistics,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const route = useRoute()

    const { page, total, size } = usePagination()
    const { makeDateRange } = useDateRange()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()
    const { fetchMasterRecordMessagesPage } = fetchMasterRecords()

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-365), nowString(0), true)

    // Data refs
    const messages = ref<Message[]>()

    // Data fetching

    async function fetchMessages() {
      const messagesPage = await fetchMasterRecordMessagesPage(
        props.record,
        page.value || 0,
        size.value,
        orderBy.value,
        [], // Status filter
        dateRange.value.start,
        dateRange.value.end
      )

      messages.value = messagesPage.items
      total.value = messagesPage.total
      page.value = messagesPage.page
      size.value = messagesPage.size
    }

    onMounted(() => {
      fetchMessages()
    })

    watch(route, () => {
      fetchMessages()
    })

    return {
      page,
      total,
      size,
      dateRange,
      messages,
      orderAscending,
      orderBy,
      toggleOrder,
    }
  },
})
</script>
