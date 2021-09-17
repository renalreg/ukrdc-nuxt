<template>
  <div>
    <!-- Description list -->
    <GenericCard class="mb-4">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Full Name</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div class="capitalize">{{ record.givenname.toLowerCase() }} {{ record.surname.toLowerCase() }}</div>
                <TracingBadge v-if="tracingRecord" :verified="nameMatchesTracing" />
              </div>
            </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Gender</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div>{{ formatGender(record.gender) }}</div>
                <TracingBadge v-if="tracingRecord" :verified="tracingRecord.patient.gender === record.gender" />
              </div>
            </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Date of Birth</TextDt>
            <TextDd>
              <div class="flex items-center gap-2">
                <div>{{ formatDate(record.dateOfBirth, (t = false)) }}</div>
                <TracingBadge v-if="tracingRecord" :verified="tracingRecord.patient.birthTime === record.dateOfBirth" />
              </div>
            </TextDd>
          </GenericDi>

          <GenericDi>
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
          </GenericDi>

          <GenericDi>
            <TextDt>ID Type</TextDt>
            <TextDd>{{ record.nationalidType }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Last Updated</TextDt>
            <TextDd>{{ formatDate(record.lastUpdated) }} </TextDd>
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <!-- Record message banners -->
    <div v-if="!fetchPending">
      <div v-if="latestMessage">
        <GenericAlertError v-if="latestMessage.msgStatus === 'ERROR'" class="mb-4" :message="latestMessageInfo" />
        <GenericAlertInfo v-else class="mb-4" :message="latestMessageInfo" />
      </div>
      <div v-else>
        <GenericAlertWarning class="mb-4" :message="latestMessageInfo" />
      </div>
    </div>

    <!-- Related Patient Records card -->
    <GenericCard class="overflow-visible">
      <GenericCardHeader>
        <TextH2> Patient Records </TextH2>
      </GenericCardHeader>
      <ul v-if="fetchPending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 5" :key="n" />
      </ul>
      <PatientrecordsGroupedList v-else :records="patientRecords" @refresh="refreshRecords" />
    </GenericCard>

    <!-- Related Master Records card -->
    <GenericCard class="mt-4">
      <GenericCardHeader>
        <TextH2> Linked Master Records </TextH2>
      </GenericCardHeader>
      <ul v-if="fetchPending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 2" :key="n" />
      </ul>
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in relatedRecords" :key="item.id" class="hover:bg-gray-50">
          <NuxtLink :to="`/masterrecords/${item.id}`">
            <MasterrecordsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'
import { isTracing } from '@/helpers/utils/recordUtils'

import fetchMasterRecords from '@/helpers/fetch/fetchMasterRecords'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { PatientRecordSummary } from '@/interfaces/patientrecord'
import { MinimalMessage } from '~/interfaces/messages'

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
      fetchMasterRecords()

    // Data refs

    const relatedRecords = ref<MasterRecord[]>()
    const patientRecords = ref<PatientRecordSummary[]>()
    const latestMessage = ref<MinimalMessage | null>()

    // Data fetching
    const fetchPending = ref(true)

    async function fetchRelatedRecordData() {
      fetchPending.value = true

      // Load related data concurrently
      const [latestMessageResponse, relatedRecordsResponse, patientRecordsResponse] = await Promise.all([
        fetchMasterRecordLatestMessage(props.record),
        fetchMasterRecordRelated(props.record),
        fetchMasterRecordPatientRecords(props.record),
      ])

      latestMessage.value = latestMessageResponse
      relatedRecords.value = relatedRecordsResponse
      patientRecords.value = patientRecordsResponse

      fetchPending.value = false
    }

    onMounted(() => {
      fetchRelatedRecordData()
    })

    function refreshRecords() {
      fetchRelatedRecordData()
    }

    // Tracing record matching

    const tracingRecord = computed<PatientRecordSummary | null>(() => {
      const tracings = patientRecords.value?.filter(isTracing)
      if (!tracings || (tracings && tracings.length < 1)) {
        return null
      }
      return tracings[0]
    })

    function givenNameMatchesTracing() {
      if (!tracingRecord.value) {
        return false
      }
      for (const name of tracingRecord.value.patient.names) {
        if (props.record.givenname.toLowerCase() === name.given.toLowerCase()) {
          return true
        }
      }
      return false
    }

    function surnameMatchesTracing() {
      if (!tracingRecord.value) {
        return false
      }
      for (const name of tracingRecord.value.patient.names) {
        if (props.record.surname.toLowerCase() === name.family.toLowerCase()) {
          return true
        }
      }
      return false
    }

    const nameMatchesTracing = computed(() => {
      return givenNameMatchesTracing() && surnameMatchesTracing()
    })

    // Dynamic UI elements

    const latestMessageInfo = computed(() => {
      if (!latestMessage.value) {
        return 'No new patient data received in the last year'
      }
      if (latestMessage.value.msgStatus === 'ERROR') {
        return `Latest file ${latestMessage.value.filename} failed from ${latestMessage.value.facility} on ${formatDate(
          latestMessage.value.received,
          false
        )}`
      }
      return `Latest file ${latestMessage.value.filename} recieved from ${latestMessage.value.facility} on ${formatDate(
        latestMessage.value.received,
        false
      )}`
    })

    return {
      fetchPending,
      patientRecords,
      relatedRecords,
      tracingRecord,
      latestMessage,
      latestMessageInfo,
      refreshRecords,
      formatGender,
      formatDate,
      nameMatchesTracing,
    }
  },
})
</script>

<style></style>
