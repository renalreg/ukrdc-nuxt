<template>
  <BaseLoadingContainer :loading="!(diagnoses && renalDiagnoses && causesOfDeath)">
    <div class="sensitive grid grid-cols-3 gap-4">
      <div class="col-span-3 lg:col-span-2">
        <BaseCard>
          <BaseCardHeader>
            <h2>Diagnoses</h2>
          </BaseCardHeader>
          <ul class="divide-y divide-gray-300">
            <PatientRecordDiagnosisListItem v-for="diagnosis in diagnoses" :key="diagnosis.id" :item="diagnosis" />
          </ul>
        </BaseCard>
      </div>
      <div class="col-span-3 flex flex-col gap-4 lg:col-span-1">
        <BaseCard>
          <BaseCardHeader>
            <h2>Renal Diagnoses</h2>
          </BaseCardHeader>
          <ul class="divide-y divide-gray-300">
            <PatientRecordDiagnosisListItem
              v-for="renalDiagnosis in renalDiagnoses"
              :key="renalDiagnosis.pid"
              :item="renalDiagnosis"
              :small="true"
            />
          </ul>
        </BaseCard>
        <BaseCard>
          <BaseCardHeader>
            <h2>Cause of Death</h2>
          </BaseCardHeader>
          <ul class="divide-y divide-gray-300">
            <PatientRecordCauseOfDeathListItem
              v-for="causeOfDeath in causesOfDeath"
              :key="causeOfDeath.pid"
              :item="causeOfDeath"
              :small="true"
            />
          </ul>
        </BaseCard>
      </div>
    </div>
  </BaseLoadingContainer>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import {
  ExtendedCauseOfDeathSchema,
  ExtendedDiagnosisSchema,
  ExtendedRenalDiagnosisSchema,
  PatientRecordSchema,
} from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import PatientRecordCauseOfDeathListItem from "~/components/patientrecord/medical/PatientRecordCauseOfDeathListItem.vue";
import PatientRecordDiagnosisListItem from "~/components/patientrecord/medical/PatientRecordDiagnosisListItem.vue";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseLoadingContainer,
    PatientRecordCauseOfDeathListItem,
    PatientRecordDiagnosisListItem,
    BaseCard,
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
