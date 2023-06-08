<template>
  <div>
    <p v-if="orders.length <= 0" class="text-center">No lab orders on record</p>

    <BaseTable v-else>
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
            Order ID
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
            Collection Time
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300 bg-white">
        <PatientRecordLabOrderRow v-for="(item, index) in orders" :key="index" :item="item" />
      </tbody>
    </BaseTable>

    <div v-if="orders.length > 0" class="mt-4">
      <BaseCard>
        <BasePaginator :page="page" :size="size" :total="total" @next="page++" @prev="page--" @jump="page = $event" />
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { LabOrderShortSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import PatientRecordLabOrderRow from "~/components/patientrecord/medical/PatientRecordLabOrderRow.vue";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    PatientRecordLabOrderRow,
    BaseTable,
    BaseCard,
    BasePaginator,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { page, total, size } = usePagination();
    const { patientRecordsApi } = useApi();

    // Data refs
    size.value = 18; // Fetch a multiple of our row length
    const orders = ref([] as LabOrderShortSchema[]);

    // Data fetching

    function fetchOrders() {
      patientRecordsApi
        .getPatientLaborders({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
        })
        .then((response) => {
          orders.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
        });
    }

    onMounted(() => {
      fetchOrders();
    });

    watch(page, () => {
      fetchOrders();
    });

    return { page, size, total, orders, formatDate };
  },
});
</script>
