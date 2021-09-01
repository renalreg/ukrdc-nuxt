<template>
  <div>
    <div class="mb-4 flex flex-col">
      <div class="flex gap-2 flex-row-reverse">
        <GenericButtonMini @click="toggleOrder">
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
            <ErrorsListItem :show-patient-filter="false" :item="item" />
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
import { defineComponent, onMounted, ref, useContext, useRoute, watch } from '@nuxtjs/composition-api'
import { Message } from '~/interfaces/messages'
import { MasterRecord, MasterRecordStatistics } from '~/interfaces/masterrecord'
import usePagination from '~/helpers/query/usePagination'
import useSortBy from '~/helpers/query/useSortBy'

interface MessagePage {
  items: Message[]
  total: number
  page: number
  size: number
}

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

    const { $axios } = useContext()
    const { page, total, size } = usePagination()
    const { orderAscending, orderBy, toggleOrder } = useSortBy()

    // Data refs

    const messages = ref<Message[]>()

    // Data fetching

    async function fetchMessages() {
      // Fetch the dashboard response from our API server
      const path = `${props.record.links.messages}?page=${page.value}&size=${size.value}&sort_by=received&order_by=${orderBy.value}`
      const res: MessagePage = await $axios.$get(path)

      messages.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size
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
      messages,
      orderAscending,
      orderBy,
      toggleOrder,
    }
  },
})
</script>
