<template>
  <div>
    <GenericSearchableSelect
      v-model="selectedService"
      class="mb-4"
      :options="availableServicesIds"
      :labels="availableServicesLabels"
      hint="Select a service..."
    />

    <div class="mb-4 flex flex-grow items-center">
      <NuxtLink :to="'./laborders'">
        <GenericButton>View Orders</GenericButton>
      </NuxtLink>
      <NuxtLink v-if="selectedOrderId" :to="{ query: { order_id: null } }" class="ml-2">
        <GenericButton>Show Results From All Orders</GenericButton>
      </NuxtLink>
    </div>

    <!-- Small data card display -->
    <div class="lg:hidden">
      <GenericCardFlat
        v-for="(item, index) in results"
        :key="`${index}-card`"
        class="grid grid-cols-3 gap-2 mb-4 px-4 py-4"
      >
        <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Type</div>
        <TextP class="col-span-2 font-medium text-gray-900"
          >{{ item.serviceId }} ({{ item.serviceIdDescription }})</TextP
        >
        <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Value</div>
        <TextP class="col-span-2">{{ item.value }} {{ item.valueUnits }}</TextP>
        <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Order ID</div>
        <div class="col-span-2 truncate">
          <NuxtLink :to="{ query: { order_id: item.orderId } }">
            {{ item.orderId }}
          </NuxtLink>
        </div>
        <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Entered On</div>
        <TextP class="col-span-2">{{ formatDate(item.observationTime) }}</TextP>
      </GenericCardFlat>
    </div>
    <!-- Large table display -->
    <GenericTable class="hidden lg:block">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Value
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Order ID
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Entered On
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(item, index) in results" :key="index">
          <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
            {{ item.serviceId }} ({{ item.serviceIdDescription }})
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ item.value }} {{ item.valueUnits }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-500 underline truncate">
            <NuxtLink :to="{ query: { order_id: item.orderId } }">
              {{ item.orderId }}
            </NuxtLink>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-500">
            {{ formatDate(item.observationTime) }}
          </td>
        </tr>
      </tbody>
    </GenericTable>

    <div v-if="results.length > 0" class="mt-4">
      <GenericCard>
        <GenericPaginator :page="page" :size="size" :total="total" @next="page++" @prev="page--" />
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useRoute, watch } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { ResultItem } from '@/interfaces/laborder'
import { formatDate } from '@/helpers/utils/dateUtils'
import usePagination from '~/helpers/query/usePagination'
import useQuery from '~/helpers/query/useQuery'

interface ResultsPage {
  items: ResultItem[]
  total: number
  page: number
  size: number
}

interface ResultService {
  id: string
  description: string
  standard: string
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
    const { stringQuery } = useQuery()

    // Data refs

    const results = ref([] as ResultItem[])

    // Data fetching

    async function fetchResults() {
      let path = `${props.record.links.results}?page=${page.value}&size=${size.value}`

      // Filter by service if it exists
      if (selectedService.value) {
        path = path + `&service_id=${selectedService.value}`
      }

      // Filter by order ID if it exists
      if (selectedOrderId.value) {
        path = path + `&order_id=${selectedOrderId.value}`
      }

      const res: ResultsPage = await $axios.$get(path)
      results.value = res.items
      total.value = res.total
      page.value = res.page
      size.value = res.size

      // If we don't already have a list of available codes, fetch one
      if (availableServicesMap.value.length === 0) {
        availableServicesMap.value = await $axios.$get(props.record.links.resultServices)
      }
    }

    onMounted(() => {
      fetchResults()
    })

    watch(route, () => {
      fetchResults()
    })

    // Result item services

    const availableServicesMap = ref([] as ResultService[])

    const availableServicesIds = computed(() => {
      return availableServicesMap.value.map(({ id }) => id)
    })

    const availableServicesLabels = computed(() => {
      return availableServicesMap.value.map(({ description }) => description)
    })

    const selectedService = stringQuery('service_id', null, true, true)

    // Lab order filter

    const selectedOrderId = stringQuery('order_id', null, true, true)

    return {
      page,
      size,
      total,
      results,
      availableServicesMap,
      availableServicesIds,
      availableServicesLabels,
      selectedService,
      selectedOrderId,
      formatDate,
    }
  },
})
</script>

<style scoped></style>
