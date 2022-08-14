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

    <LoadingContainer :loading="!results">
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
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
              Type
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
              Value
            </th>
            <th
              scope="col"
              class="px-6 py-3 pl-16 text-left text-sm font-medium uppercase tracking-wider text-gray-500"
            >
              Order ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
              Observation Time
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500"></th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <PatientrecordsResultRow
            v-for="(item, index) in results"
            :key="index"
            :item="item"
            @delete="showDeleteResultItemModal"
          />
        </tbody>
      </GenericTable>

      <div v-if="results && results.length > 0" class="mt-4">
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
    </LoadingContainer>
  </div>
</template>

<script lang="ts">
import {
  LabOrderSchema,
  PatientRecordSchema,
  ResultItemSchema,
  ResultItemServiceSchema,
} from "@ukkidney/ukrdc-axios-ts";

import { formatDate } from "@/helpers/utils/dateUtils";

import usePagination from "~/helpers/query/usePagination";
import useQuery from "~/helpers/query/useQuery";
import useDateRange from "~/helpers/query/useDateRange";

import { modalInterface } from "~/interfaces/modal";
import useApi from "~/helpers/useApi";

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup(props) {
    const { $toast } = useNuxtApp();
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { stringQuery } = useQuery();
    const { patientRecordsApi } = useApi();

    // Set initial date dateRange
    const dateRange = makeDateRange(null, null, true, false);

    // Data refs

    const results = ref<ResultItemSchema[]>();

    // Data fetching

    function fetchResults() {
      patientRecordsApi
        .getPatientResults({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
          serviceId: selectedService.value ? [selectedService.value] : undefined,
          orderId: selectedOrderId.value ? [selectedOrderId.value] : undefined,
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
        })
        .then((response) => {
          results.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;
        });

      // If we don't already have a list of available codes, fetch one
      if (availableServicesMap.value.length === 0) {
        patientRecordsApi
          .getPatientResultServices({
            pid: props.record.pid,
          })
          .then((response) => {
            availableServicesMap.value = response.data;
          });
      }
    }

    const selectedOrder = ref<LabOrderSchema>();

    function fetchLabOrder() {
      if (selectedOrderId.value) {
        patientRecordsApi
          .getPatientLaborder({
            pid: props.record.pid,
            orderId: selectedOrderId.value,
          })
          .then((response) => {
            selectedOrder.value = response.data;
          });
      }
    }

    // Data deletion

    const deleteResultAlert = ref<modalInterface>();
    const deleteOrderAlert = ref<modalInterface>();

    const itemToDelete = ref<ResultItemSchema | null>(null);

    function showDeleteResultItemModal(item: ResultItemSchema) {
      itemToDelete.value = item;
      deleteResultAlert.value?.show();
    }

    function cancelDeleteResultItem() {
      itemToDelete.value = null;
      deleteResultAlert.value?.hide();
    }

    function deleteResultItem() {
      if (itemToDelete.value) {
        patientRecordsApi
          .deletePatientResultDelete({
            pid: props.record.pid,
            resultitemId: itemToDelete.value.id,
          })
          .then(() => {
            $toast.show({
              type: "success",
              title: "Success",
              message: "Result Item deleted",
              timeout: 10,
              classTimeout: "bg-green-600",
            });
            fetchResults();
            itemToDelete.value = null;
            deleteResultAlert.value?.hide();
          });
      }
    }

    function deleteLabOrder() {
      if (selectedOrder.value) {
        patientRecordsApi
          .deletePatientLaborderDelete({
            pid: props.record.pid,
            orderId: selectedOrder.value.id,
          })
          .then(() => {
            $toast.show({
              type: "success",
              title: "Success",
              message: "Lab Order deleted",
              timeout: 10,
              classTimeout: "bg-green-600",
            });
            selectedOrderId.value = null;
            fetchResults();
            fetchLabOrder();
            deleteOrderAlert.value?.hide();
          });
      }
    }

    // Result item services

    const availableServicesMap = ref([] as ResultItemServiceSchema[]);

    const availableServicesIds = computed(() => {
      return availableServicesMap.value.map(({ id }) => id);
    });

    const availableServicesLabels = computed(() => {
      return availableServicesMap.value.map(({ description }) => description);
    });

    const selectedService = stringQuery("service_id", null, true, true);

    // Lab order filter

    const selectedOrderId = stringQuery("order_id", null, true, true);

    // Data lifecycle

    onMounted(() => {
      fetchResults();
      fetchLabOrder();
    });

    watch([page, selectedService, selectedOrderId, dateRange], () => {
      fetchResults();
    });

    watch(selectedOrderId, () => {
      fetchLabOrder();
    });

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
    };
  },
});
</script>

<style scoped></style>
