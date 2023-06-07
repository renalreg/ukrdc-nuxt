<template>
  <div class="sensitive grid grid-cols-3 gap-4">
    <div class="col-span-3 lg:col-span-2">
      <BaseCard>
        <BaseCardHeader>
          <h2>Diagnoses</h2>
        </BaseCardHeader>
        <ul class="divide-y divide-gray-300">
          <li v-for="diagnosis in diagnoses" :key="diagnosis.id">
            <div class="flex gap-4">
              <div>
                <h5 class="truncate">Creation Date</h5>
                <p class="sensitive mt-2 truncate">
                  {{ formatDate(diagnosis.creationDate, true) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </BaseCard>
    </div>
    <div class="col-span-3 flex flex-col gap-4 lg:col-span-1">
      <BaseCard>
        <BaseCardHeader>
          <h2>Renal Diagnoses</h2>
        </BaseCardHeader>
        <ul class="divide-y divide-gray-300">
          <li v-for="renalDiagnosis in renalDiagnoses" :key="renalDiagnosis.pid">
            <div class="flex gap-4">
              <div>
                <h5 class="truncate">Creation Date</h5>
                <p class="sensitive mt-2 truncate">
                  {{ formatDate(renalDiagnosis.creationDate, true) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <BaseCardHeader>
          <h2>Cause of Death</h2>
        </BaseCardHeader>
        <ul class="divide-y divide-gray-300">
          <li v-for="causeOfDeath in causesOfDeath" :key="causeOfDeath.pid">
            <div class="flex gap-4">
              <div>
                <h5 class="truncate">Creation Date</h5>
                <p class="sensitive mt-2 truncate">
                  {{ formatDate(causeOfDeath.creationDate, true) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { formatDate } from "~/helpers/dateUtils";
import {
  ExtendedCauseOfDeathSchema,
  ExtendedDiagnosisSchema,
  ExtendedRenalDiagnosisSchema,
  PatientRecordSchema,
} from "@ukkidney/ukrdc-axios-ts";

import useApi from "~/composables/useApi";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import PatientRecordsGroupedList from "~/components/patientrecord/PatientRecordsGroupedList.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import MembershipStatusBadge from "~/components/MembershipStatusBadge.vue";

export default defineComponent({
  components: {
    MembershipStatusBadge,
    SendingFacilityLink,
    PatientRecordsGroupedList,
    BaseCard,
    BaseSkeleListItem,
    BaseCardHeader,
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
    const diagnoses = ref<ExtendedDiagnosisSchema[]>();
    const renalDiagnoses = ref<ExtendedRenalDiagnosisSchema[]>();
    const causesOfDeath = ref<ExtendedCauseOfDeathSchema[]>();

    // Data fetching
    onMounted(() => {
      patientRecordsApi
        .getPatientDiagnosis({
          pid: props.record.pid,
        })
        .then((response) => {
          diagnoses.value = response.data;
        });

      patientRecordsApi
        .getPatientRenalDiagnosis({
          pid: props.record.pid,
        })
        .then((response) => {
          renalDiagnoses.value = response.data;
        });

      patientRecordsApi
        .getPatientCauseOfDeath({
          pid: props.record.pid,
        })
        .then((response) => {
          causesOfDeath.value = response.data;
        });
    });

    return {
      formatDate,
      diagnoses,
      renalDiagnoses,
      causesOfDeath,
    };
  },
});
</script>
