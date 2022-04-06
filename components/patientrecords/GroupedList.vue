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
      :show-pkb-sync="hasPKBMembership"
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
      :show-pkb-sync="hasPKBMembership"
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
      :show-pkb-sync="hasPKBMembership"
      @deleted="$emit('refresh')"
    />

    <div class="flex items-center bg-gray-50 py-1 pl-4 sm:pl-6">
      <TextH4 class="flex-grow">Membership Records</TextH4>
      <div v-if="hasPermission('ukrdc:memberships:create')" class="mr-2 flex-grow-0">
        <PatientrecordsMembershipsMenu :master-record="masterRecord" :show-create-pkb-membership="!hasPKBMembership" />
      </div>
    </div>
    <div v-if="groupedRecords.memberships.length < 1" class="py-2 pl-4 sm:pl-6">
      <TextP>No membership records</TextP>
    </div>
    <div v-else>
      <patientrecordsListItem
        v-for="item in groupedRecords.memberships"
        :key="item.pid + '_membership'"
        :item="item"
        @deleted="$emit('refresh')"
      />
    </div>

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
import { computed, defineComponent } from "@nuxtjs/composition-api";

import { PatientRecordSummary } from "@/interfaces/patientrecord";

import usePermissions from "~/helpers/usePermissions";
import { isData, isMembership, isMigrated, isSurvey, isTracing } from "@/helpers/utils/recordUtils";
import { MasterRecord } from "~/interfaces/masterrecord";

interface PRGroups {
  data: PatientRecordSummary[];
  surveys: PatientRecordSummary[];
  migrated: PatientRecordSummary[];
  memberships: PatientRecordSummary[];
  tracing: PatientRecordSummary[];
}

export default defineComponent({
  props: {
    masterRecord: {
      type: Object as () => MasterRecord,
      required: true,
    },
    records: {
      type: Array as () => PatientRecordSummary[],
      required: true,
    },
  },
  setup(props) {
    const { hasPermission } = usePermissions();

    const groupedRecords = computed<PRGroups>(() => {
      if (!props.records) {
        return {
          data: [],
          surveys: [],
          migrated: [],
          memberships: [],
          tracing: [],
        } as PRGroups;
      }

      return {
        data: props.records.filter(isData),
        surveys: props.records.filter(isSurvey),
        migrated: props.records.filter(isMigrated),
        memberships: props.records.filter(isMembership),
        tracing: props.records.filter(isTracing),
      } as PRGroups;
    });

    const hasPVMembership = computed(() => {
      return props.records.some((r) => r.sendingfacility === "PV");
    });

    const hasPKBMembership = computed(() => {
      return props.records.some((r) => r.sendingfacility === "PKB");
    });

    const hasRADARMembership = computed(() => {
      return props.records.some((r) => r.sendingextract === "RADAR");
    });

    return {
      groupedRecords,
      hasPVMembership,
      hasPKBMembership,
      hasRADARMembership,
      hasPermission,
    };
  },
});
</script>
