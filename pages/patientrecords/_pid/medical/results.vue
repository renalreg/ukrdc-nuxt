<template>
  <div class="sensitive">
    <BaseModalConfirm
      ref="deleteResultAlert"
      title="Delete Result Item"
      message="Are you sure you want to delete this result item?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm="deleteResultItem"
      @cancel="cancelDeleteResultItem"
    />

    <BaseModalConfirm
      ref="deleteOrderAlert"
      title="Delete Lab Order"
      message="Are you sure you want to delete this lab order and all associated result items?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm="deleteLabOrder"
    />

    <BaseLoadingContainer :loading="!results">
      <div>
        <BaseDateRange v-model="dateRange" class="mb-4" />
        <BaseSelectSearchable
          v-model="selectedService"
          class="mb-4"
          :options="availableServicesIds"
          :labels="availableServicesLabels"
          hint="Select a result type..."
        />

        <p v-if="results && results.length <= 0" class="text-center">No results on record</p>

        <div v-else>
          <div class="mb-4 flex flex-grow items-center gap-2">
            <NuxtLink :to="'./laborders'">
              <BaseButton>View Lab Orders</BaseButton>
            </NuxtLink>
            <NuxtLink v-if="selectedOrderId" :to="{ query: { order_id: null } }">
              <BaseButton>Show Results From All Lab Orders</BaseButton>
            </NuxtLink>
            <BaseButton v-if="selectedOrderId && selectedOrder" colour="red" @click="deleteOrderAlert?.show()"
              >Delete Lab Order</BaseButton
            >
          </div>

          <BaseTable>
            <thead class="bg-gray-50">
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Value</th>
                <th scope="col">Order ID</th>
                <th scope="col">Observation Time</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300 bg-white">
              <PatientRecordResultRow
                v-for="(item, index) in results"
                :key="index"
                :item="item"
                @delete="showDeleteResultItemModal"
              />
            </tbody>
          </BaseTable>

          <div v-if="results && results.length > 0" class="mt-4">
            <BaseCard>
              <BasePaginator
                :page="page"
                :size="size"
                :total="total"
                @next="page++"
                @prev="page--"
                @jump="page = $event"
              />
            </BaseCard>
          </div>
        </div>
      </div>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, watch } from "@nuxtjs/composition-api";
import {
  LabOrderSchema,
  PatientRecordSchema,
  ResultItemSchema,
  ResultItemServiceSchema,
} from "@ukkidney/ukrdc-axios-ts";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseDateRange from "~/components/base/BaseDateRange.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BaseModalConfirm from "~/components/base/BaseModalConfirm.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelectSearchable from "~/components/base/BaseSelectSearchable.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import PatientRecordResultRow from "~/components/patientrecord/medical/PatientRecordResultRow.vue";
import useDateRange from "~/composables/query/useDateRange";
import usePagination from "~/composables/query/usePagination";
import useQuery from "~/composables/query/useQuery";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";
import { ModalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
    BaseLoadingContainer,
    BaseTable,
    BasePaginator,
    BaseDateRange,
    BaseSelectSearchable,
    BaseModalConfirm,
    PatientRecordResultRow,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup(props) {
    const { $toast } = useContext();
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
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
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

    const deleteResultAlert = ref<ModalInterface>();
    const deleteOrderAlert = ref<ModalInterface>();

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

    watch(
      [
        page,
        selectedService,
        selectedOrderId,
        () => JSON.stringify(dateRange.value), // Stringify to watch for actual value changes
      ],
      () => {
        fetchResults();
      },
    );

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

<style scoped lang="postcss">
th {
  @apply px-6 py-3;
}
</style>
