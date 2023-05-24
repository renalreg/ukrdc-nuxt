<template>
  <div>
    <div v-if="!isEmptyObject(record)" class="grid grid-cols-3">
      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Demographics</h4>
        <PatientRecordSummaryDemographics :record="record" />
      </div>

      <div v-if="full" class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">History</h4>
        <PatientRecordSummaryHistory :record="record" />
      </div>

      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Patient Numbers</h4>
        <PatientRecordSummaryNumbers :record="record" />
      </div>

      <div v-if="record.pvdata" class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">RRT Information</h4>
        <PatientRecordSummaryPVData :record="record" />
      </div>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.patient.addresses && record.patient.addresses.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Addresses</h4>
      <PatientRecordSummaryAddresses :record="record" />
    </div>

    <div
      v-if="!isEmptyObject(record) && record.programMemberships && record.programMemberships.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Program Memberships</h4>
      <PatientRecordSummaryMemberships :record="record" />
    </div>

    <div v-if="full && !isEmptyObject(record) && record.patient.familydoctor" class="col-span-3 mb-4">
      <h4 class="mb-3">Family Doctor</h4>
      <PatientRecordSummaryFamilyDoctor :record="record" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseBadge from "~/components/base/BaseBadge.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import PatientRecordSummaryAddresses from "~/components/patientrecord/summary/PatientRecordSummaryAddresses.vue";
import PatientRecordSummaryDemographics from "~/components/patientrecord/summary/PatientRecordSummaryDemographics.vue";
import PatientRecordSummaryHistory from "~/components/patientrecord/summary/PatientRecordSummaryHistory.vue";
import PatientRecordSummaryNumbers from "~/components/patientrecord/summary/PatientRecordSummaryNumbers.vue";
import PatientRecordSummaryPVData from "~/components/patientrecord/summary/PatientRecordSummaryPVData.vue";
import PostCodeLink from "~/components/PostCodeLink.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";
import PatientRecordSummaryMemberships from "~/components/patientrecord/summary/PatientRecordSummaryMemberships.vue";
import PatientRecordSummaryFamilyDoctor from "~/components/patientrecord/summary/PatientRecordSummaryFamilyDoctor.vue";

export default defineComponent({
  components: {
    PatientRecordSummaryFamilyDoctor,
    PatientRecordSummaryMemberships,
    PatientRecordSummaryAddresses,
    PatientRecordSummaryPVData,
    PatientRecordSummaryNumbers,
    PatientRecordSummaryHistory,
    PatientRecordSummaryDemographics,
    BaseCard,
    BaseBadge,
    PostCodeLink,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
    full: {
      type: Boolean,
      required: false,
      default: false,
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

<style lang="postcss" scoped></style>
