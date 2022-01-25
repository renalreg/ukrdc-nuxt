<template>
  <ul class="divide-y divide-gray-200">
    <div v-if="groupedRecords.data.length > 0" class="bg-gray-50 py-1 pl-4 sm:pl-6">
      <TextH4>Data feeds</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.data"
      :key="item.pid + '_data'"
      :item="item"
      :show-pv-sync="hasPVMembership"
      :show-radar-sync="hasRADARMembership"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.surveys.length > 0" class="bg-gray-50 py-1 pl-4 sm:pl-6">
      <TextH4>Survey feeds</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.surveys"
      :key="item.pid + '_survey'"
      :item="item"
      :show-pv-sync="hasPVMembership"
      :show-radar-sync="hasRADARMembership"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.migrated.length > 0" class="bg-gray-50 py-1 pl-4 sm:pl-6">
      <TextH4>Historic Migrated Data</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.migrated"
      :key="item.pid + '_mig'"
      :item="item"
      :show-pv-sync="hasPVMembership"
      :show-radar-sync="hasRADARMembership"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.memberships.length > 0" class="bg-gray-50 py-1 pl-4 sm:pl-6">
      <TextH4>Membership Records</TextH4>
    </div>
    <patientrecordsListItem
      v-for="item in groupedRecords.memberships"
      :key="item.pid + '_membership'"
      :item="item"
      @deleted="$emit('refresh')"
    />

    <div v-if="groupedRecords.tracing.length > 0" class="bg-gray-50 py-1 pl-4 sm:pl-6">
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

import { PatientRecordSummary } from '@/interfaces/patientrecord'

import { isData, isMembership, isMigrated, isSurvey, isTracing } from '@/helpers/utils/recordUtils'

interface PRGroups {
  data: PatientRecordSummary[]
  surveys: PatientRecordSummary[]
  migrated: PatientRecordSummary[]
  memberships: PatientRecordSummary[]
  tracing: PatientRecordSummary[]
}

export default defineComponent({
  props: {
    records: {
      type: Array as () => PatientRecordSummary[],
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

    const hasPVMembership = computed(() => {
      return props.records.some((r) => r.sendingfacility === 'PV')
    })

    const hasPKBMembership = computed(() => {
      return props.records.some((r) => r.sendingfacility === 'PKB')
    })

    const hasRADARMembership = computed(() => {
      return props.records.some((r) => r.sendingextract === 'RADAR')
    })

    return {
      groupedRecords,
      hasPVMembership,
      hasPKBMembership,
      hasRADARMembership,
    }
  },
})
</script>
