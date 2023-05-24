<template>
  <div>
    <div v-if="!isEmptyObject(record)" class="grid grid-cols-3">
      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Demographics</h4>
        <PatientRecordSummaryDemographics :record="record" />
      </div>

      <div class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">History</h4>
        <PatientRecordSummaryHistory :record="record" />
      </div>

      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Patient Numbers</h4>
        <PatientRecordSummaryNumbers class="patient-infocard-ul" :record="record" />
      </div>

      <div v-if="record.pvdata" class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">RRT Information</h4>
        <PatientRecordSummaryPVData :record="record" />
      </div>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.patient && record.patient.addresses && record.patient.addresses.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Addresses</h4>
      <PatientRecordSummaryAddresses class="patient-infocard-ul" :record="record" />
    </div>

    <div
      v-if="!isEmptyObject(record) && record.programMemberships && record.programMemberships.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Program Memberships</h4>
      <PatientRecordSummaryMemberships class="patient-infocard-ul" :record="record" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import PatientRecordSummaryAddresses from "~/components/patientrecord/summary/PatientRecordSummaryAddresses.vue";
import PatientRecordSummaryDemographics from "~/components/patientrecord/summary/PatientRecordSummaryDemographics.vue";
import PatientRecordSummaryHistory from "~/components/patientrecord/summary/PatientRecordSummaryHistory.vue";
import PatientRecordSummaryMemberships from "~/components/patientrecord/summary/PatientRecordSummaryMemberships.vue";
import PatientRecordSummaryNumbers from "~/components/patientrecord/summary/PatientRecordSummaryNumbers.vue";
import PatientRecordSummaryPVData from "~/components/patientrecord/summary/PatientRecordSummaryPVData.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    PatientRecordSummaryMemberships,
    PatientRecordSummaryAddresses,
    PatientRecordSummaryPVData,
    PatientRecordSummaryNumbers,
    PatientRecordSummaryHistory,
    PatientRecordSummaryDemographics,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup() {
    return {
      formatDate,
      formatGender,
      isEmptyObject,
    };
  },
});
</script>

<style lang="postcss" scoped>
.patient-infocard-ul {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3;
}
</style>
