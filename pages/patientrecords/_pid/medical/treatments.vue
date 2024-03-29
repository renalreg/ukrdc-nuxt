<template>
  <div class="sensitive">
    <BaseLoadingContainer :loading="!treatments">
      <p v-if="treatments && treatments.length <= 0" class="text-center">No treatments on record</p>
      <div v-else-if="treatments && treatments.length > 0" class="flow-root">
        <!-- New UI-->
        <BaseTable>
          <thead class="bg-gray-50">
            <tr>
              <th scope="col">Facility / QBL05</th>
              <th scope="col">Admit Date</th>
              <th scope="col">Admit Reason</th>
              <th scope="col">Discharge Date</th>
              <th scope="col">Discharge Reason</th>
              <!-- Info tooltip -->
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300 bg-white">
            <tr v-for="treatment in treatments" :key="treatment.id">
              <td class="font-medium">
                <SendingFacilityLink class="inline font-medium" :code="treatment.healthCareFacilityCode" />
                <span v-if="treatment.qbl05" class="inline">/ {{ treatment.qbl05 }}</span>
              </td>
              <!-- Admission-->
              <td>
                {{ treatment.fromTime ? formatDate(treatment.fromTime, false) : "None" }}
              </td>
              <td class="truncate">
                <CodeTitle
                  v-if="treatment.admitReasonCodeStd && treatment.admitReasonCode"
                  :coding-standard="treatment.admitReasonCodeStd"
                  :code="treatment.admitReasonCode"
                />
                <p v-if="treatment.admitReasonDesc">{{ treatment.admitReasonDesc }}</p>
              </td>
              <!-- Discharge-->
              <td>
                {{ treatment.toTime ? formatDate(treatment.toTime, false) : "None" }}
              </td>
              <td>
                <CodeTitle
                  v-if="treatment.dischargeReasonCodeStd && treatment.dischargeReasonCode"
                  :coding-standard="treatment.dischargeReasonCodeStd"
                  :code="treatment.dischargeReasonCode"
                />
                <p v-if="treatment.dischargeReasonDesc">{{ treatment.dischargeReasonDesc }}</p>
                <p
                  v-if="
                    !treatment.dischargeReasonDesc &&
                    !(treatment.dischargeReasonCodeStd && treatment.dischargeReasonCode)
                  "
                >
                  None
                </p>
              </td>
              <!-- Info tooltip-->
              <td>
                <BaseInfoTooltip>
                  <div class="sensitive">
                    <p><b>ID: </b>{{ treatment.id }}</p>
                    <br />
                    <p>
                      <b>Admit reason code: </b>{{ treatment.admitReasonCodeStd }} / {{ treatment.admitReasonCode }}
                    </p>
                    <p>
                      <b>Discharge reason code: </b>{{ treatment.dischargeReasonCodeStd || "None" }} /
                      {{ treatment.dischargeReasonCode || "None" }}
                    </p>
                    <br />
                    <p>
                      <b>Healthcare facility code: </b>{{ treatment.healthCareFacilityCodeStd || "None" }} /
                      {{ treatment.healthCareFacilityCode || "None" }}
                    </p>
                    <p>
                      <b>Discharge location code: </b>{{ treatment.dischargeLocationCodeStd || "None" }} /
                      {{ treatment.dischargeLocationCode || "None" }}
                    </p>
                  </div>
                </BaseInfoTooltip>
              </td>
            </tr>
          </tbody>
        </BaseTable>
      </div>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { PatientRecordSchema, TreatmentSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import CodeTitle from "~/components/CodeTitle.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    CodeTitle,
    SendingFacilityLink,
    BaseTable,
    BaseLoadingContainer,
    BaseInfoTooltip,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { patientRecordsApi } = useApi();

    // Data refs
    const treatments = ref<TreatmentSchema[]>();

    // Data fetching
    onMounted(() => {
      patientRecordsApi
        .getPatientTreatments({
          pid: props.record.pid,
        })
        .then((response) => {
          treatments.value = response.data;
        });
    });

    return {
      formatDate,
      treatments,
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
