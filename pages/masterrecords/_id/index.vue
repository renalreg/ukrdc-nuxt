<template>
  <div>
    <!-- Description list -->
    <BaseCard class="mb-4">
      <BaseCardContent>
        <BaseDescriptionListGrid>
          <BaseDescriptionListGridItem>
            <dt>Full Name</dt>
            <dd>
              <div class="flex items-center gap-2">
                <div class="sensitive capitalize">
                  {{ record.givenname?.toLowerCase() }} {{ record.surname?.toLowerCase() }}
                </div>
                <TracingBadge v-if="tracingRecord" :verified="nameMatchesTracing" />
              </div>
            </dd>
          </BaseDescriptionListGridItem>

          <BaseDescriptionListGridItem>
            <dt>Gender</dt>
            <dd>
              <div class="flex items-center gap-2">
                <div class="sensitive">{{ record.gender ? formatGender(record.gender) : "Unknown gender" }}</div>
                <TracingBadge v-if="tracingRecord" :verified="tracingRecord.patient?.gender === record.gender" />
              </div>
            </dd>
          </BaseDescriptionListGridItem>

          <BaseDescriptionListGridItem>
            <dt>Date of Birth</dt>
            <dd>
              <div class="flex items-center gap-2">
                <div class="sensitive">{{ formatDate(record.dateOfBirth, false) }}</div>
                <TracingBadge v-if="tracingRecord" :verified="birthTimeMatchesTracing" />
              </div>
            </dd>
          </BaseDescriptionListGridItem>

          <BaseDescriptionListGridItem>
            <dt class="font-medium text-gray-500">National ID</dt>
            <dd>
              <div class="flex items-center gap-2">
                <div class="sensitive">{{ record.nationalid }}</div>
                <TracingBadge
                  v-if="tracingRecord && record.nationalidType !== 'UKRDC'"
                  :verified="tracingRecord.localpatientid.trim() === record.nationalid.trim()"
                />
              </div>
            </dd>
          </BaseDescriptionListGridItem>

          <BaseDescriptionListGridItem>
            <dt>ID Type</dt>
            <dd>{{ record.nationalidType }}</dd>
          </BaseDescriptionListGridItem>

          <BaseDescriptionListGridItem>
            <dt>Last Updated</dt>
            <dd>{{ formatDate(record.lastUpdated) }}</dd>
          </BaseDescriptionListGridItem>
        </BaseDescriptionListGrid>
      </BaseCardContent>
    </BaseCard>

    <!-- Record message banners -->
    <LatestMessageAlert :message="latestMessage" :is-loading="latestMessageIsLoading" />

    <!-- Related Patient Records card -->
    <BaseCard class="!overflow-visible">
      <BaseCardHeader>
        <h2>Patient Records</h2>
      </BaseCardHeader>
      <PatientRecordsGroupedList v-if="patientRecords" :records="patientRecords" @refresh="refreshRecords" />
      <ul v-else class="divide-y divide-gray-300">
        <BaseSkeleListItem v-for="n in 5" :key="n" />
      </ul>
    </BaseCard>

    <!-- Related Master Records card -->
    <BaseCard class="mt-4">
      <BaseCardHeader>
        <h2>Linked Master Records</h2>
      </BaseCardHeader>
      <ul v-if="relatedRecords" class="divide-y divide-gray-300">
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
            <MasterRecordsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <ul v-else class="divide-y divide-gray-300">
        <BaseSkeleListItem v-for="n in 2" :key="n" />
      </ul>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import {
  MasterRecordSchema,
  MasterRecordStatisticsSchema,
  MinimalMessageSchema,
  PatientRecordSummarySchema,
} from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import MasterRecordsListItem from "~/components/MasterRecordsListItem.vue";
import AlertFileLatest from "~/components/messages/AlertFileLatest.vue";
import PatientRecordsGroupedList from "~/components/patientrecord/PatientRecordsGroupedList.vue";
import TracingBadge from "~/components/TracingBadge.vue";
import useApi from "~/composables/useApi";
import { formatGender } from "~/helpers/codeUtils";
import { datesAreEqual, formatDate } from "~/helpers/dateUtils";
import { isTracing } from "~/helpers/recordUtils";

export default defineComponent({
  components: {
    LatestMessageAlert: AlertFileLatest,
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
    BaseSkeleListItem,
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
    TracingBadge,
    MasterRecordsListItem,
    PatientRecordsGroupedList,
  },
  props: {
    record: {
      type: Object as () => MasterRecordSchema,
      required: true,
    },
    stats: {
      type: Object as () => MasterRecordStatisticsSchema,
      required: false,
      default: null,
    },
  },

  setup(props) {
    const { masterRecordsApi } = useApi();

    // Data refs

    const relatedRecords = ref<MasterRecordSchema[]>();
    const patientRecords = ref<PatientRecordSummarySchema[]>();

    const latestMessage = ref<MinimalMessageSchema>();
    const latestMessageIsLoading = ref(true);

    // Data fetching
    function fetchRelatedRecordData() {
      masterRecordsApi
        .getMasterRecordPatientrecords({
          recordId: props.record.id,
        })
        .then((response) => {
          patientRecords.value = response.data;
        });

      masterRecordsApi
        .getMasterRecordRelated({
          recordId: props.record.id,
        })
        .then((response) => {
          relatedRecords.value = response.data;
        });

      masterRecordsApi
        .getMasterRecordLatestMessage({
          recordId: props.record.id,
        })
        .then((response) => {
          latestMessage.value = response.data;
          latestMessageIsLoading.value = false;
        });
    }

    onMounted(() => {
      fetchRelatedRecordData();
    });

    function refreshRecords() {
      // Wait 1 second before refreshing.
      // Some operations like new memberships or deleted records can take a while to propagate,
      // so we wait a second to give the server a chance to catch up.
      setTimeout(fetchRelatedRecordData, 1000);
    }

    // Tracing record matching

    const tracingRecord = computed<PatientRecordSummarySchema | null>(() => {
      const tracings = patientRecords.value?.filter(isTracing);
      if (!tracings || (tracings && tracings.length < 1)) {
        return null;
      }
      return tracings[0];
    });

    function givenNameMatchesTracing() {
      if (tracingRecord.value && tracingRecord.value.patient) {
        for (const name of tracingRecord.value.patient.names) {
          if (props.record.givenname?.toLowerCase() === name.given.toLowerCase()) {
            return true;
          }
        }
      }
      return false;
    }

    function surnameMatchesTracing() {
      if (tracingRecord.value && tracingRecord.value.patient) {
        for (const name of tracingRecord.value.patient.names) {
          if (props.record.surname?.toLowerCase() === name.family.toLowerCase()) {
            return true;
          }
        }
      }
      return false;
    }

    const birthTimeMatchesTracing = computed(() => {
      if (tracingRecord.value && tracingRecord.value.patient) {
        if (datesAreEqual(props.record.dateOfBirth, tracingRecord.value.patient.birthTime)) {
          return true;
        }
      }
      return false;
    });

    const nameMatchesTracing = computed(() => {
      return givenNameMatchesTracing() && surnameMatchesTracing();
    });

    return {
      patientRecords,
      relatedRecords,
      tracingRecord,
      latestMessage,
      latestMessageIsLoading,
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
