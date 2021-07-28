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
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
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
import { defineComponent, ref, useContext, useFetch, useRoute, watch } from '@nuxtjs/composition-api'
import { Message } from '~/interfaces/messages'
import { MasterRecord, MasterRecordStatistics } from '~/interfaces/masterrecord'
import usePagination from '~/mixins/usePagination'
import useSortBy from '~/mixins/useSortBy'

// TODO: Move to a common page interface
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

    const messages = ref([] as Message[])

    const { fetch } = useFetch(async () => {
      // Fetch the dashboard response from our API server
      const path = `${props.record.links.messages}?page=${page.value}&size=${size.value}&sort_by=received&order_by=${orderBy.value}`
      const res: MessagePage = await $axios.$get(path)
      messages.value = res.items
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
      messages,

      orderAscending,
      orderBy,
      toggleOrder,
    }
  },
})
</script>
