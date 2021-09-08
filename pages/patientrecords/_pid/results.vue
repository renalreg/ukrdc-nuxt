<template>
  <div>
    <GenericDateRange v-model="dateRange" />
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
      <PatientrecordsResultCard v-for="(item, index) in results" :key="`${index}-card`" :item="item" />
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
        <PatientrecordsResultRow v-for="(item, index) in results" :key="index" :item="item" />
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
import { computed, defineComponent, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { ResultItem } from '@/interfaces/laborder'

import { formatDate } from '@/helpers/utils/dateUtils'

import usePagination from '~/helpers/query/usePagination'
import useQuery from '~/helpers/query/useQuery'
import useDateRange from '~/helpers/query/useDateRange'

import fetchPatientRecords, { ResultService } from '~/helpers/fetch/fetchPatientRecords'

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
    const { makeDateRange } = useDateRange()
    const { stringQuery } = useQuery()
    const { fetchPatientRecordResultsPage, fetchPatientRecordResultServices } = fetchPatientRecords()

    // Set initial date dateRange
    const dateRange = makeDateRange(null, null, true, false)

    // Data refs

    const results = ref([] as ResultItem[])

    // Data fetching

    async function fetchResults() {
      const resultsPage = await fetchPatientRecordResultsPage(
        props.record,
        page.value || 0,
        size.value,
        selectedService.value,
        selectedOrderId.value,
        dateRange.value.start,
        dateRange.value.end
      )
      results.value = resultsPage.items
      total.value = resultsPage.total
      page.value = resultsPage.page
      size.value = resultsPage.size

      // If we don't already have a list of available codes, fetch one
      if (availableServicesMap.value.length === 0) {
        availableServicesMap.value = await fetchPatientRecordResultServices(props.record)
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
      dateRange,
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
