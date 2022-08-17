<template>
  <div>
    <!-- Description list -->
    <GenericCard class="mb-4">
      <GenericCardContent>
        <GenericDlGrid>
          <GenericDlGridItem>
            <TextDt>Full Name</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div class="capitalize">{{ record.givenname.toLowerCase() }} {{ record.surname.toLowerCase() }}</div>
                <TracingBadge v-if="tracingRecord" :verified="nameMatchesTracing" />
              </div>
            </TextDd>
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt>Gender</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div>{{ formatGender(record.gender) }}</div>
                <TracingBadge v-if="tracingRecord" :verified="tracingRecord.patient.gender === record.gender" />
              </div>
            </TextDd>
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt>Date of Birth</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div>{{ formatDate(record.dateOfBirth, (t = false)) }}</div>
                <TracingBadge v-if="tracingRecord" :verified="birthTimeMatchesTracing" />
              </div>
            </TextDd>
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt class="font-medium text-gray-500">National ID</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div>{{ record.nationalid }}</div>
                <TracingBadge
                  v-if="tracingRecord && record.nationalidType !== 'UKRDC'"
                  :verified="tracingRecord.localpatientid.trim() === record.nationalid.trim()"
                />
              </div>
            </TextDd>
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt>ID Type</TextDt>
            <TextDd>{{ record.nationalidType }} </TextDd>
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt>Last Updated</TextDt>
            <TextDd>{{ formatDate(record.lastUpdated) }} </TextDd>
          </GenericDlGridItem>
        </GenericDlGrid>
      </GenericCardContent>
    </GenericCard>

    <!-- Record message banners -->
    <div>
      <div v-if="latestMessage === undefined">
        <GenericAlertPlaceholder class="mb-4" />
      </div>
      <div v-if="latestMessage === null">
        <GenericAlertWarning class="mb-4" message="No new patient data received in the last year" />
      </div>
      <div v-if="latestMessage">
        <GenericAlertError v-if="latestMessage.msgStatus === 'ERROR'" class="mb-4" :message="latestMessageInfo" />
        <GenericAlertInfo v-else class="mb-4" :message="latestMessageInfo" />
      </div>
    </div>

    <!-- Related Patient Records card -->
    <GenericCard class="overflow-visible">
      <GenericCardHeader>
        <TextH2> Patient Records </TextH2>
      </GenericCardHeader>
      <PatientrecordsGroupedList
        v-if="patientRecords"
        :master-record="record"
        :records="patientRecords"
        @refresh="refreshRecords"
      />
      <ul v-else class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 5" :key="n" />
      </ul>
    </GenericCard>

    <!-- Related Master Records card -->
    <GenericCard class="mt-4">
      <GenericCardHeader>
        <TextH2> Linked Master Records </TextH2>
      </GenericCardHeader>
      <ul v-if="relatedRecords" class="divide-y divide-gray-200">
        <div
          v-for="item in relatedRecords"
          :key="item.id"
          class=""
          :class="item.id === record.id ? 'bg-gray-50' : 'hover:bg-gray-50'"
        >
          <NuxtLink
            v-tooltip="item.id === record.id ? 'You are currently viewing this record' : null"
            :to="`/masterrecords/${item.id}`"
          >
            <MasterrecordsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <ul v-else class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 2" :key="n" />
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";

import { formatDate, datesAreEqual } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";
import { isTracing } from "@/helpers/utils/recordUtils";

import fetchMasterRecords from "@/helpers/fetch/fetchMasterRecords";

import { MasterRecord, MasterRecordStatistics } from "@/interfaces/masterrecord";
import { PatientRecordSummary } from "@/interfaces/patientrecord";
import { MinimalMessage } from "~/interfaces/messages";

export default defineComponent({
  props: {
    record: {
      type: Object as () => MasterRecord,
      required: true,
    },
    stats: {
      type: Object as () => MasterRecordStatistics,
      required: false,
      default: null,
    },
  },

  setup(props) {
    const { fetchMasterRecordRelated, fetchMasterRecordLatestMessage, fetchMasterRecordPatientRecords } =
      fetchMasterRecords();

    // Data refs

    const relatedRecords = ref<MasterRecord[]>();
    const patientRecords = ref<PatientRecordSummary[]>();
    const latestMessage = ref<MinimalMessage | null | undefined>(undefined);

    // Data fetching
    function fetchRelatedRecordData() {
      fetchMasterRecordPatientRecords(props.record).then((records) => {
        patientRecords.value = records;
      });

      fetchMasterRecordRelated(props.record, false).then((records) => {
        relatedRecords.value = records;
      });

      fetchMasterRecordLatestMessage(props.record).then((message) => {
        latestMessage.value = message;
      });
    }

    onMounted(() => {
      fetchRelatedRecordData();
    });

    function refreshRecords() {
      fetchRelatedRecordData();
    }

    // Tracing record matching

    const tracingRecord = computed<PatientRecordSummary | null>(() => {
      const tracings = patientRecords.value?.filter(isTracing);
      if (!tracings || (tracings && tracings.length < 1)) {
        return null;
      }
      return tracings[0];
    });

    function givenNameMatchesTracing() {
      if (!tracingRecord.value) {
        return false;
      }
      for (const name of tracingRecord.value.patient.names) {
        if (props.record.givenname.toLowerCase() === name.given.toLowerCase()) {
          return true;
        }
      }
      return false;
    }

    function surnameMatchesTracing() {
      if (!tracingRecord.value) {
        return false;
      }
      for (const name of tracingRecord.value.patient.names) {
        if (props.record.surname.toLowerCase() === name.family.toLowerCase()) {
          return true;
        }
      }
      return false;
    }

    const birthTimeMatchesTracing = computed(() => {
      if (!tracingRecord.value) {
        return false;
      }
      if (datesAreEqual(props.record.dateOfBirth, tracingRecord.value.patient.birthTime)) {
        return true;
      }
      return false;
    });

    const nameMatchesTracing = computed(() => {
      return givenNameMatchesTracing() && surnameMatchesTracing();
    });

    // Dynamic UI elements

    const latestMessageInfo = computed(() => {
      if (!latestMessage.value) {
        return null;
      }
      if (latestMessage.value.msgStatus === "ERROR") {
        return `Latest file ${latestMessage.value.filename} failed from ${latestMessage.value.facility} on ${formatDate(
          latestMessage.value.received,
          false
        )}`;
      }
      return `Latest file ${latestMessage.value.filename} recieved from ${latestMessage.value.facility} on ${formatDate(
        latestMessage.value.received,
        false
      )}`;
    });

    return {
      patientRecords,
      relatedRecords,
      tracingRecord,
      latestMessage,
      latestMessageInfo,
      refreshRecords,
      formatGender,
      formatDate,
      nameMatchesTracing,
      birthTimeMatchesTracing,
    };
  },
});
</script>

<style></style>
