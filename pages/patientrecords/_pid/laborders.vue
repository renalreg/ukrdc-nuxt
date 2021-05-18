<template>
  <div>
    <TextP v-if="orders.length <= 0" class="text-center">
      No lab orders on record
    </TextP>
    <ul
      class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="item in orders" :key="item.id">
        <NuxtLink
          :to="{
            path: `./results`,
            query: { order_id: item.id },
          }"
          class="col-span-1 flex shadow-sm rounded-md"
        >
          <GenericCardMini
            class="w-full px-4 py-2 flex items-center justify-between"
          >
            <div class="flex-1 truncate">
              <TextH3 class="truncate">
                {{ item.id }}
              </TextH3>
              <TextP class="truncate">
                Collected
                {{ formatDate(item.specimenCollectedTime, (t = false)) }}
              </TextP>
            </div>
            <div class="flex-shrink-0">
              <span class="sr-only">Open options</span>
              <IconChevronRight />
            </div>
          </GenericCardMini>
        </NuxtLink>
      </li>
    </ul>

    <div v-if="orders.length > 0" class="mt-4">
      <GenericCard>
        <GenericPaginator
          v-if="!$fetchState.pending"
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
  ref,
  useFetch,
  useContext,
  watch,
  useRoute,
} from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'

import { LabOrderShort } from '@/interfaces/laborder'
import { PatientRecord } from '@/interfaces/patientrecord'
import usePagination from '~/mixins/usePagination'

interface LabOrdersPage {
  items: LabOrderShort[]
  total: number
  page: number
  size: number
}

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute()
    const { $axios } = useContext()
    const { page, total, size } = usePagination()

    const orders = ref([] as LabOrderShort[])

    const { fetch } = useFetch(async () => {
      const path = `${props.record.links.laborders}?page=${page.value}&size=${size.value}`
      const res: LabOrdersPage = await $axios.$get(path)
      orders.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size
    })

    watch(route, () => {
      fetch()
    })

    return { page, size, total, orders, formatDate }
  },
})
</script>
