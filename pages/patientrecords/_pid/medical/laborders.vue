<template>
  <div>
    <p v-if="orders.length <= 0" class="text-center">No lab orders on record</p>
    <ul class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      <li v-for="item in orders" :key="item.id">
        <NuxtLink
          :to="{
            path: `./results`,
            query: { order_id: item.id },
          }"
          class="col-span-1 flex rounded-md shadow-sm"
        >
          <PatientRecordLabOrderCard :item="item" class="w-full" />
        </NuxtLink>
      </li>
    </ul>

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
import PatientRecordLabOrderCard from "~/components/patientrecord/medical/PatientRecordLabOrderCard.vue";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BasePaginator,
    PatientRecordLabOrderCard,
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