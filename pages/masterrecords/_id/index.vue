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
                <TracingBadge v-if="tracingRecord" :verified="tracingRecord.localpatientid === record.nationalid" />
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

    <!-- Related Patient Records card -->
    <div v-if="!$fetchState.pending">
      <div v-if="latestMessage">
        <GenericAlertError v-if="latestMessage.msgStatus === 'ERROR'" class="mb-4" :message="latestMessageInfo" />
        <GenericAlertInfo v-else class="mb-4" :message="latestMessageInfo" />
      </div>
      <div v-else>
        <GenericAlertWarning class="mb-4" :message="latestMessageInfo" />
      </div>
    </div>

    <GenericCard>
      <GenericCardHeader>
        <TextH2> Patient Records </TextH2>
      </GenericCardHeader>
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 5" :key="n" />
      </ul>
      <PatientrecordsGroupedList v-else :records="patientRecords" @refresh="refreshRecords" />
    </GenericCard>

    <!-- Related Master Records card -->
    <GenericCard class="mt-4">
      <GenericCardHeader>
        <TextH2> Linked Master Records </TextH2>
      </GenericCardHeader>
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
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
import { defineComponent, ref, useFetch, useContext, computed } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'
import { isTracing } from '@/utilities/recordUtils'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { PatientRecord } from '@/interfaces/patientrecord'
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
    const { $axios } = useContext()

    const relatedRecords = ref([] as MasterRecord[])
    const patientRecords = ref([] as PatientRecord[])
    const latestMessage = ref<MinimalMessage>()

    const tracingRecord = computed<PatientRecord | null>(() => {
      const tracings = patientRecords.value.filter(isTracing)
      if (tracings.length < 1) {
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

    const { fetch } = useFetch(async () => {
      // Use the record links to load related data concurrently
      const [latestMessageResponse, relatedRecordsResponse, patientRecordsResponse] = await Promise.all([
        $axios.$get(props.record.links.latestMessage),
        $axios.$get(props.record.links.related),
        $axios.$get(props.record.links.patientrecords),
      ])

      if (latestMessageResponse) {
        latestMessage.value = latestMessageResponse
      }

      relatedRecords.value = relatedRecordsResponse
      patientRecords.value = patientRecordsResponse
    })

    function refreshRecords() {
      console.log('Refreshing Patient Records...')
      fetch()
    }

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
    }
  },
})
</script>

<style></style>
