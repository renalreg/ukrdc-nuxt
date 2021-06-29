<template>
  <div>
    <!-- Description list -->
    <GenericCard>
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt class="font-medium text-gray-500">National ID</TextDt>
            <TextDd>{{ record.nationalid }}</TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>ID Type</TextDt>
            <TextDd>{{ record.nationalidType }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Gender</TextDt>
            <TextDd>{{ formatGender(record.gender) }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Date of Birth</TextDt>
            <TextDd>{{ formatDate(record.dateOfBirth, (t = false)) }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Last Updated</TextDt>
            <TextDd>{{ formatDate(record.lastUpdated) }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Effective Date</TextDt>
            <TextDd>{{ formatDate(record.effectiveDate) }} </TextDd>
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <!-- Related Patient Records card -->
    <GenericCard class="mt-4">
      <GenericCardHeader>
        <TextH2> Patient Records </TextH2>
      </GenericCardHeader>
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 5" :key="n" />
      </ul>
      <PatientrecordsGroupedList v-else :records="patientRecords" />
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
import { defineComponent, ref, useFetch, useContext } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { PatientRecordShort } from '@/interfaces/patientrecord'

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
    const patientRecords = ref([] as PatientRecordShort[])

    useFetch(async () => {
      // Use the record links to load related data concurrently
      const [relatedRecordsResponse, patientRecordsResponse] = await Promise.all([
        $axios.$get(props.record.links.related),
        $axios.$get(props.record.links.patientrecords),
      ])

      relatedRecords.value = relatedRecordsResponse
      patientRecords.value = patientRecordsResponse
    })

    return {
      patientRecords,
      relatedRecords,
      formatGender,
      formatDate,
    }
  },
})
</script>

<style></style>
