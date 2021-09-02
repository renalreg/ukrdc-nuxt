<template>
  <ul class="divide-y divide-gray-200">
    <div v-if="groupedRecords.data.length > 0" class="bg-gray-50 pl-4 sm:pl-6 py-1">
      <TextH4>Data feeds</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.data"
      :key="item.pid + '_data'"
      :item="item"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.surveys.length > 0" class="bg-gray-50 pl-4 sm:pl-6 py-1">
      <TextH4>Survey feeds</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.surveys"
      :key="item.pid + '_survey'"
      :item="item"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.migrated.length > 0" class="bg-gray-50 pl-4 sm:pl-6 py-1">
      <TextH4>Historic Migrated Data</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.migrated"
      :key="item.pid + '_mig'"
      :item="item"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.memberships.length > 0" class="bg-gray-50 pl-4 sm:pl-6 py-1">
      <TextH4>Membership Records</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.memberships"
      :key="item.pid + '_membership'"
      :item="item"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.tracing.length > 0" class="bg-gray-50 pl-4 sm:pl-6 py-1">
      <TextH4>Tracing Records</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.tracing"
      :key="item.pid + '_tracing'"
      :item="item"
      @deleted="$emit('refresh')"
    />
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'

import { isData, isMembership, isMigrated, isSurvey, isTracing } from '@/helpers/utils/recordUtils'

interface PRGroups {
  data: PatientRecord[]
  surveys: PatientRecord[]
  migrated: PatientRecord[]
  memberships: PatientRecord[]
  tracing: PatientRecord[]
}

export default defineComponent({
  props: {
    records: {
      type: Array as () => PatientRecord[],
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
          tracing: [],
        } as PRGroups
      }

      return {
        data: props.records.filter(isData),
        surveys: props.records.filter(isSurvey),
        migrated: props.records.filter(isMigrated),
        memberships: props.records.filter(isMembership),
        tracing: props.records.filter(isTracing),
      } as PRGroups
    })

    return {
      groupedRecords,
    }
  },
})
</script>
