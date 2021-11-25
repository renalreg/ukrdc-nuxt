<template>
  <div>
    <GenericModalConfirm
      ref="deleteResultAlert"
      title="Delete Result Item"
      message="Are you sure you want to delete this result item?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm="deleteResultItem"
      @cancel="cancelDeleteResultItem"
    />

    <GenericModalConfirm
      ref="deleteOrderAlert"
      title="Delete Lab Order"
      message="Are you sure you want to delete this lab order and all associated result items?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm="deleteLabOrder"
    />

    <GenericDateRange v-model="dateRange" class="mb-4" />
    <GenericSearchableSelect
      v-model="selectedService"
      class="mb-4"
      :options="availableServicesIds"
      :labels="availableServicesLabels"
      hint="Select a service..."
    />

    <div class="mb-4 flex flex-grow items-center gap-2">
      <NuxtLink :to="'./laborders'">
        <GenericButton>View Orders</GenericButton>
      </NuxtLink>
      <NuxtLink v-if="selectedOrderId" :to="{ query: { order_id: null } }">
        <GenericButton>Show Results From All Orders</GenericButton>
      </NuxtLink>
      <GenericButton v-if="selectedOrderId && selectedOrder" colour="red" @click="deleteOrderAlert.show()"
        >Delete Lab Order</GenericButton
      >
    </div>

    <!-- Small data card display -->
    <div class="lg:hidden">
      <PatientrecordsResultCard
        v-for="(item, index) in results"
        :key="`${index}-card`"
        :item="item"
        @delete="showDeleteResultItemModal"
      />
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
            Observation Time
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <PatientrecordsResultRow
          v-for="(item, index) in results"
          :key="index"
          :item="item"
          @delete="showDeleteResultItemModal"
        />
      </tbody>
    </GenericTable>

    <div v-if="results.length > 0" class="mt-4">
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
import { computed, defineComponent, onMounted, ref, useContext, useRoute, watch } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { LabOrder, ResultItem } from '@/interfaces/laborder'

import { formatDate } from '@/helpers/utils/dateUtils'

import usePagination from '~/helpers/query/usePagination'
import useQuery from '~/helpers/query/useQuery'
import useDateRange from '~/helpers/query/useDateRange'

import fetchPatientRecords, { ResultService } from '~/helpers/fetch/fetchPatientRecords'
import { modalInterface } from '~/interfaces/modal'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute()
    const { $toast } = useContext()
    const { page, total, size } = usePagination()
    const { makeDateRange } = useDateRange()
    const { stringQuery } = useQuery()
    const {
      fetchPatientRecordResultsPage,
      fetchPatientRecordResultServices,
      deletePatientRecordResultItem,
      fetchPatientRecordLabOrder,
      deletePatientRecordLabOrder,
    } = fetchPatientRecords()

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

    const selectedOrder = ref<LabOrder>()

    async function fetchLabOrder() {
      if (selectedOrderId.value) {
        selectedOrder.value = await fetchPatientRecordLabOrder(props.record, selectedOrderId.value)
      }
    }

    // Data deletion

    const deleteResultAlert = ref<modalInterface>()
    const deleteOrderAlert = ref<modalInterface>()

    const itemToDelete = ref<ResultItem | null>(null)

    function showDeleteResultItemModal(item: ResultItem) {
      itemToDelete.value = item
      deleteResultAlert.value?.show()
    }

    function cancelDeleteResultItem() {
      itemToDelete.value = null
      deleteResultAlert.value?.hide()
    }

    async function deleteResultItem() {
      if (itemToDelete.value) {
        await deletePatientRecordResultItem(itemToDelete.value)
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'Result Item deleted',
          timeout: 10,
          classTimeout: 'bg-green-600',
        })
        await fetchResults()
        itemToDelete.value = null
        deleteResultAlert.value?.hide()
      }
    }

    async function deleteLabOrder() {
      if (selectedOrder.value) {
        await deletePatientRecordLabOrder(selectedOrder.value)
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'Lab Order deleted',
          timeout: 10,
          classTimeout: 'bg-green-600',
        })
        selectedOrderId.value = null
        await fetchResults()
        await fetchLabOrder()
        deleteOrderAlert.value?.hide()
      }
    }

    onMounted(() => {
      fetchResults()
      fetchLabOrder()
    })

    watch(route, () => {
      fetchResults()
      fetchLabOrder()
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
      deleteResultAlert,
      deleteOrderAlert,
      itemToDelete,
      showDeleteResultItemModal,
      cancelDeleteResultItem,
      deleteResultItem,
      deleteLabOrder,
      availableServicesMap,
      availableServicesIds,
      availableServicesLabels,
      selectedService,
      selectedOrderId,
      selectedOrder,
      formatDate,
    }
  },
})
</script>

<style scoped></style>
