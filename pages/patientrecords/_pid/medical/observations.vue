<template>
  <div class="sensitive">
    <BaseLoadingContainer :loading="!observations">
      <p v-if="observations && observations.length <= 0" class="text-center">No observations on record</p>
      <div v-else>
        <BaseSelectSearchable
          v-model="selectedCode"
          class="mb-4"
          :options="availableCodes"
          hint="Select an observation type..."
        />

        <BaseTable class="mb-4">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                Value
              </th>
              <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                Entered At
              </th>
              <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                Entered On
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500"
              ></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300 bg-white">
            <PatientrecordObservationRow
              v-for="(item, index) in observations"
              :key="`${item.observationCode}-${index}`"
              :item="item"
            />
          </tbody>
        </BaseTable>

        <div v-if="observations && observations.length > 0">
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
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { ObservationSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelectSearchable from "~/components/base/BaseSelectSearchable.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import PatientrecordObservationRow from "~/components/patientrecord/medical/PatientRecordObservationRow.vue";
import usePagination from "~/composables/query/usePagination";
import useQuery from "~/composables/query/useQuery";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseLoadingContainer,
    BaseTable,
    BasePaginator,
    BaseSelectSearchable,
    PatientrecordObservationRow,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { page, total, size } = usePagination();
    const { stringQuery } = useQuery();
    const { patientRecordsApi } = useApi();

    // Data refs

    const observations = ref<ObservationSchema[]>();

    const availableCodes = ref([] as string[]);
    const selectedCode = stringQuery("code", null, true, true);

    // Data fetching

    function fetchObservations() {
      patientRecordsApi
        .getPatientObservations({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
          code: selectedCode.value ? [selectedCode.value] : undefined,
        })
        .then((response) => {
          observations.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
        });

      // If we don't already have a list of available codes, fetch one
      if (availableCodes.value && availableCodes.value.length === 0) {
        patientRecordsApi
          .getPatientObservationCodes({
            pid: props.record.pid,
          })
          .then((response) => {
            availableCodes.value = response.data;
          });
      }
    }

    onMounted(() => {
      fetchObservations();
    });

    watch([page, selectedCode], () => {
      fetchObservations();
    });

    return {
      page,
      size,
      total,
      observations,
      availableCodes,
      selectedCode,
      formatDate,
    };
  },
});
</script>
