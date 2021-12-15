<template>
  <div>
    <TextP v-if="orders.length <= 0" class="text-center"> No lab orders on record </TextP>
    <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="item in orders" :key="item.id">
        <NuxtLink
          :to="{
            path: `./results`,
            query: { order_id: item.id },
          }"
          class="col-span-1 flex shadow-sm rounded-md"
        >
          <PatientrecordsLaborderCard :item="item" class="w-full" />
        </NuxtLink>
      </li>
    </ul>

    <div v-if="orders.length > 0" class="mt-4">
      <GenericCard>
        <GenericPaginator
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'

import { LabOrderShort } from '@/interfaces/laborder'
import { PatientRecord } from '@/interfaces/patientrecord'
import usePagination from '~/helpers/query/usePagination'
import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute()
    const { page, total, size } = usePagination()
    const { fetchPatientRecordLabOrdersPage } = fetchPatientRecords()

    // Data refs
    size.value = 18 // Fetch a multiple of our row length
    const orders = ref([] as LabOrderShort[])

    // Data fetching

    async function fetchOrders() {
      const ordersPage = await fetchPatientRecordLabOrdersPage(props.record, page.value || 1, size.value)
      orders.value = ordersPage.items
      total.value = ordersPage.total
      page.value = ordersPage.page
      size.value = ordersPage.size
    }

    onMounted(() => {
      fetchOrders()
    })

    watch(route, () => {
      fetchOrders()
    })

    return { page, size, total, orders, formatDate }
  },
})
</script>
