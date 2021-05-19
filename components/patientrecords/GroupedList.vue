<template>
  <ul class="divide-y divide-gray-200">
    <div v-if="groupedRecords.data.length > 0" class="bg-gray-50 pl-3 py-1">
      <TextH4>Data feeds</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.data"
      :key="item.pid"
      :item="item"
    />

    <div v-if="groupedRecords.surveys.length > 0" class="bg-gray-50 pl-3 py-1">
      <TextH4>Survey feeds</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.surveys"
      :key="item.pid"
      :item="item"
    />

    <div v-if="groupedRecords.migrated.length > 0" class="bg-gray-50 pl-3 py-1">
      <TextH4>Historic Migrated Data</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.migrated"
      :key="item.pid"
      :item="item"
    />

    <div
      v-if="groupedRecords.memberships.length > 0"
      class="bg-gray-50 pl-3 py-1"
    >
      <TextH4>Membership Records</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.memberships"
      :key="item.pid"
      :item="item"
    />
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { PatientRecordShort } from '@/interfaces/patientrecord'

import {
  isData,
  isSurvey,
  isMigrated,
  isMembership,
} from '@/utilities/recordUtils'

interface PRGroups {
  data: PatientRecordShort[]
  surveys: PatientRecordShort[]
  migrated: PatientRecordShort[]
  memberships: PatientRecordShort[]
}

export default defineComponent({
  props: {
    records: {
      type: Array as () => PatientRecordShort[],
      required: true,
    },
  },
  setup(props) {
    const groupedRecords = computed<PRGroups>(() => {
      if (!props.records) {
        return {
          data: [],
          surveys: [],
          migrated: [],
          memberships: [],
        } as PRGroups
      }

      return {
        data: props.records.filter(isData),
        surveys: props.records.filter(isSurvey),
        migrated: props.records.filter(isMigrated),
        memberships: props.records.filter(isMembership),
      } as PRGroups
    })

    return {
      groupedRecords,
    }
  },
})
</script>
