<template>
  <div>
    <LoadingContainer :loading="!observations">
      <TextP v-if="observations && observations.length <= 0" class="text-center">No observations on record</TextP>
      <div v-else>
        <GenericSelect v-model="selectedCodeString" class="mb-4">
          <option :value="null">All Observations</option>
          <option v-for="item in availableCodes" :key="item">
            {{ item }}
          </option>
        </GenericSelect>

        <!-- Small data card display -->
        <div class="lg:hidden">
          <PatientrecordsObservationCard
            v-for="(item, index) in observations"
            :key="`${item.observationCode}-${index}-card`"
            :item="item"
          />
        </div>
        <!-- Large table display -->
        <GenericTable class="mb-4 hidden lg:block">
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
          <tbody class="divide-y divide-gray-200 bg-white">
            <PatientrecordsObservationTableRow
              v-for="(item, index) in observations"
              :key="`${item.observationCode}-${index}`"
              :item="item"
            />
          </tbody>
        </GenericTable>

        <div v-if="observations && observations.length > 0">
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
    </LoadingContainer>
  </div>
</template>

<script lang="ts">
import { ObservationSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import usePagination from "~/helpers/query/usePagination";
import { arrayQuery } from "@/helpers/utils/queryUtils";
import { formatDate } from "@/helpers/utils/dateUtils";

import useApi from "~/helpers/useApi";

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { page, total, size } = usePagination();
    const { patientRecordsApi } = useApi();

    // Data refs

    const observations = ref<ObservationSchema[]>();

    const availableCodes = ref([] as string[]);
    const selectedCodes = ref((arrayQuery(route.query.code) || []) as string[]);

    // Data fetching

    function fetchObservations() {
      patientRecordsApi
        .getPatientObservations({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
          code: selectedCodes.value,
        })
        .then((response) => {
          observations.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;
        });

      // If we don't already have a list of available codes, fetch one
      if (availableCodes.value.length === 0) {
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

    watch([page, selectedCodes], () => {
      fetchObservations();
    });

    // Observation code filter

    const selectedCodeString = computed({
      get: () => selectedCodes.value[0] || "",
      set: (newCode: string) => {
        selectedCodes.value = [newCode];

        // Reset page when we change the filter
        const newQuery = {
          page: "1",
          code: selectedCodes.value,
        };
        router.push({
          path: route.path,
          query: newQuery,
        });
      },
    });

    return {
      page,
      size,
      total,
      observations,
      availableCodes,
      selectedCodeString,
      formatDate,
    };
  },
});
</script>
