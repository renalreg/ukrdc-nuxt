<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h2 class="mb-2">Unknown UKRDC Presence Report</h2>
      <p>
        List of patients with no treatment items or programme memberships to explain the presence of the record in the
        UKRDC.
      </p>
      <p>Excludes patients with a known date of death prior to 5 years ago from the time of query.</p>
      <p v-if="records" class="mt-2">
        <b>{{ total }}</b> records currently match this condition.
      </p>
    </div>

    <!-- If loading -->
    <div v-if="fetchInProgress">
      <BaseCard>
        <!-- Skeleton results -->
        <ul class="divide-y divide-gray-300">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
      </BaseCard>
    </div>
    <div v-else>
      <BaseCard>
        <!-- Real results -->
        <ul class="divide-y divide-gray-300">
          <div v-for="record in records" :key="`record-${record.pid}`" class="hover:bg-gray-50">
            <PatientRecordsListItem
              :item="record"
              :show-manage-menu="false"
              :show-sender="false"
              :prefer-ni-over-mrn="true"
            />
          </div>
        </ul>

        <BasePaginator
          class="border-t border-gray-200 bg-white"
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import PatientRecordsListItem from "~/components/patientrecord/PatientRecordsListItem.vue";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
    PatientRecordsListItem,
  },
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },
  setup(props) {
    const { page, total, size } = usePagination();
    const { facilitiesApi } = useApi();

    // Data refs
    const fetchInProgress = ref(false);
    const records = ref<PatientRecordSummarySchema[]>();

    // Data fetching
    function getRecords() {
      fetchInProgress.value = true;

      facilitiesApi
        .getFacilityReportsCc001({
          code: props.facility.id,
          page: page.value || 1,
          size: size.value,
        })
        .then((response) => {
          records.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;

          fetchInProgress.value = false;
        });
    }

    onMounted(() => {
      getRecords();
    });

    watch(page, () => {
      getRecords();
    });

    return {
      records,
      fetchInProgress,
      page,
      total,
      size,
    };
  },
});
</script>
