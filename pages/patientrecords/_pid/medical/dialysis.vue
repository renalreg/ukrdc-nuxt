<template>
  <div class="sensitive">
    <BaseLoadingContainer :loading="!sessions">
      <p v-if="sessions && sessions.length <= 0" class="text-center">No dialysis sessions on record</p>
      <div v-else>
        <BaseTable>
          <thead class="bg-gray-50">
            <tr>
              <th scope="col">Procedure Time</th>
              <th scope="col">Type</th>
              <th scope="col">Entered At</th>
              <th scope="col">QHD20</th>
              <th scope="col">QHD21</th>
              <th scope="col">QHD31</th>
              <!-- Info tooltip -->
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300 bg-white">
            <tr v-for="session in sessions" :key="session.id">
              <!-- Procedure time-->
              <td>
                {{ session.proceduretime ? formatDate(session.proceduretime, true) : "None" }}
              </td>
              <!-- Procedure type-->
              <td class="truncate">
                <CodeTitle
                  v-if="session.proceduretypecodestd && session.proceduretypecode"
                  :coding-standard="session.proceduretypecodestd"
                  :code="session.proceduretypecode"
                />
                <p v-if="session.proceduretypedesc">{{ session.proceduretypedesc }}</p>
              </td>
              <!-- Entered at -->
              <td class="font-medium">
                <SendingFacilityLink class="font-medium" :code="session.enteredatcode" />
              </td>
              <!-- Attributes-->
              <td>{{ session.qhd20 ?? "None" }}</td>
              <td>{{ session.qhd21 ?? "None" }}</td>
              <td>{{ session.qhd31 ?? "None" }}</td>
            </tr>
          </tbody>
        </BaseTable>

        <div v-if="sessions && sessions.length > 0" class="mt-4">
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
import { DialysisSessionSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";
import CodeTitle from "~/components/CodeTitle.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";

export default defineComponent({
  components: {
    SendingFacilityLink,
    CodeTitle,
    BaseCard,
    BaseLoadingContainer,
    BaseTable,
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

    const sessions = ref<DialysisSessionSchema[]>();

    // Data fetching

    function fetchResults() {
      patientRecordsApi
        .getPatientDialysisSessions({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
        })
        .then((response) => {
          sessions.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
        });
    }

    // Data lifecycle

    onMounted(() => {
      fetchResults();
    });

    watch([page], () => {
      fetchResults();
    });

    return {
      page,
      size,
      total,
      formatDate,
      sessions,
    };
  },
});
</script>

<style scoped lang="postcss">
th {
  @apply px-6 py-3;
}
td {
  @apply whitespace-nowrap px-6 py-4;
}
</style>
