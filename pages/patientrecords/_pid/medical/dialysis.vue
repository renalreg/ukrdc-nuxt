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
              <!-- Info tooltip-->
              <td>
                <BaseInfoTooltip>
                  <div class="sensitive">
                    <p><b>ID: </b>{{ session.id }}</p>
                    <br />
                    <div class="grid grid-cols-2">
                      <div><b>QHD19: </b>{{ session.qhd19 || "None" }}</div>
                      <div><b>QHD20: </b>{{ session.qhd20 || "None" }}</div>
                      <div><b>QHD21: </b>{{ session.qhd21 || "None" }}</div>
                      <div><b>QHD22: </b>{{ session.qhd22 || "None" }}</div>
                      <div><b>QHD30: </b>{{ session.qhd30 || "None" }}</div>
                      <div><b>QHD31: </b>{{ session.qhd31 || "None" }}</div>
                      <div><b>QHD32: </b>{{ session.qhd32 || "None" }}</div>
                      <div><b>QHD33: </b>{{ session.qhd33 || "None" }}</div>
                    </div>
                    <br />
                    <p><b>Clinician: </b>{{ session.cliniciandesc ?? session.cliniciancode }}</p>
                    <p><b>Entered by: </b>{{ session.enteredbydesc ?? session.enteredbycode }}</p>
                  </div>
                </BaseInfoTooltip>
              </td>
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
import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import CodeTitle from "~/components/CodeTitle.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseInfoTooltip,
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
