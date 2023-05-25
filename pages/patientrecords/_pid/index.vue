<template>
  <div>
    <!-- Demographics header-->
    <PatientRecordSummaryDemographics class="col-span-3 mb-4" :record="record" />
    <!-- Record message banners -->
    <NuxtLink :to="`/patientrecords/${record.pid}/messages`">
      <LatestMessageAlert :message="latestMessage" :is-loading="latestMessageIsLoading" />
    </NuxtLink>

    <!-- Main content container-->
    <div class="grid grid-cols-3 gap-4">
      <!-- Record summary -->
      <div class="col-span-3 md:col-span-1">
        <!-- Record history -->
        <div class="mb-4">
          <PatientRecordSummaryHistory :record="record" />
        </div>
        <!-- Record numbers -->
        <div class="mb-4">
          <h4 class="mb-3">Patient Numbers</h4>
          <PatientRecordSummaryNumbers class="patient-infocard-ul" :record="record" />
        </div>
        <!-- PV Data -->
        <div v-if="record.pvdata" class="col-span-3 mb-4 sm:col-span-2">
          <h4 class="mb-3">RRT Information</h4>
          <PatientRecordSummaryPVData :record="record" />
        </div>
        <!-- Addresses-->
        <div v-if="record.patient && record.patient.addresses && record.patient.addresses.length > 0" class="mb-4">
          <h4 class="mb-3">Addresses</h4>
          <PatientRecordSummaryAddresses class="patient-infocard-ul" :record="record" />
        </div>
        <!-- Programme memberships-->
        <div v-if="record.programMemberships && record.programMemberships.length > 0" class="mb-4">
          <h4 class="mb-3">Program Memberships</h4>
          <PatientRecordSummaryMemberships class="patient-infocard-ul" :record="record" />
        </div>
        <!-- Family doctor-->
        <div v-if="record.patient && record.patient.familydoctor" class="mb-4">
          <h4 class="mb-3">Family Doctor</h4>
          <PatientRecordSummaryFamilyDoctor class="patient-infocard-ul" :record="record" />
        </div>
      </div>
      <!-- Related records -->
      <div class="col-span-3 md:col-span-2">
        <BaseCard class="!overflow-visible">
          <BaseCardHeader>
            <h2>Related Records</h2>
            <p class="label">All records, including data feeds and memberships, for this patient</p>
          </BaseCardHeader>
          <PatientRecordsGroupedList v-if="related" :records="related" @refresh="refreshRecords" />
          <ul v-else class="divide-y divide-gray-300">
            <BaseSkeleListItem v-for="n in 5" :key="n" />
          </ul>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { MinimalMessageSchema, PatientRecordSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import LatestMessageAlert from "~/components/messages/AlertFileLatest.vue";
import PatientRecordsGroupedList from "~/components/patientrecord/PatientRecordsGroupedList.vue";
import PatientRecordSummaryAddresses from "~/components/patientrecord/summary/PatientRecordSummaryAddresses.vue";
import PatientRecordSummaryDemographics from "~/components/patientrecord/summary/PatientRecordSummaryDemographics.vue";
import PatientRecordSummaryFamilyDoctor from "~/components/patientrecord/summary/PatientRecordSummaryFamilyDoctor.vue";
import PatientRecordSummaryHistory from "~/components/patientrecord/summary/PatientRecordSummaryHistory.vue";
import PatientRecordSummaryMemberships from "~/components/patientrecord/summary/PatientRecordSummaryMemberships.vue";
import PatientRecordSummaryNumbers from "~/components/patientrecord/summary/PatientRecordSummaryNumbers.vue";
import PatientRecordSummaryPVData from "~/components/patientrecord/summary/PatientRecordSummaryPVData.vue";
import useApi from "~/composables/useApi";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    PatientRecordSummaryFamilyDoctor,
    PatientRecordSummaryMemberships,
    PatientRecordSummaryAddresses,
    PatientRecordSummaryPVData,
    PatientRecordSummaryNumbers,
    PatientRecordSummaryHistory,
    BaseCard,
    BaseCardHeader,
    BaseSkeleListItem,
    PatientRecordsGroupedList,
    LatestMessageAlert,
    PatientRecordSummaryDemographics,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { ukrdcRecordGroupApi, patientRecordsApi } = useApi();

    // Data refs

    const related = ref<PatientRecordSummarySchema[]>();

    const latestMessage = ref<MinimalMessageSchema>();
    const latestMessageIsLoading = ref(true);

    // Data fetching

    function fetchRecordData() {
      // Get related records
      ukrdcRecordGroupApi
        .getUkrdcidRecords({
          ukrdcid: props.record.ukrdcid,
        })
        .then((response) => {
          related.value = response.data;
        });

      // Get latest message data
      patientRecordsApi
        .getPatientRecordLatestMessage({
          pid: props.record.pid,
        })
        .then((response) => {
          latestMessage.value = response.data;
          latestMessageIsLoading.value = false;
        });
    }

    function refreshRecords() {
      // Wait 1 second before refreshing.
      // Some operations like new memberships or deleted records can take a while to propagate,
      // so we wait a second to give the server a chance to catch up.
      setTimeout(fetchRecordData, 1000);
    }

    onMounted(() => {
      fetchRecordData();
    });

    return {
      related,
      latestMessage,
      latestMessageIsLoading,
      refreshRecords,
      formatDate,
      formatGender,
      isEmptyObject,
    };
  },
});
</script>

<style lang="postcss" scoped>
.patient-infocard-ul {
  @apply grid grid-cols-1 gap-4 xl:grid-cols-2;
}
</style>
