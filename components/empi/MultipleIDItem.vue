<template>
  <div>
    <div class="flex items-center gap-2 border-b p-4">
      <div class="flex-grow pl-2">
        <div>
          <TextH2 v-if="heading"> {{ heading }} </TextH2>
          <TextL1 v-if="group && group.groupId">Record Group {{ group.groupId }}</TextL1>
        </div>
      </div>
      <div class="flex-shrink">
        <div v-if="!fetchInProgress">
          <GenericButtonMini
            v-if="group.records.length == 2"
            :to="{
              path: '/empi/merge',
              query: {
                superseded: group.records[0].masterRecord.id,
                superseding: group.records[1].masterRecord.id,
                callback: $route.fullPath,
              },
            }"
            >Start Merge</GenericButtonMini
          >
          <GenericButtonMini v-else :disabled="true">Can't automatically merge more than two records</GenericButtonMini>
        </div>
      </div>
    </div>

    <ul class="divide-y divide-gray-200">
      <div
        v-for="item in group.records"
        :key="`record-${group.groupId}-${item.masterRecord.id}`"
        class="hover:bg-gray-50"
      >
        <SkeleListItem v-if="fetchInProgress" />
        <NuxtLink v-else :to="`/masterrecords/${item.masterRecord.id}`">
          <MasterrecordsListItem
            :item="item.masterRecord"
            :details-label="item.lastUpdated ? 'Last checked' : null"
            :details-value="item.lastUpdated ? formatDate(item.lastUpdated) : null"
          />
        </NuxtLink>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'

import { MultipleUKRDCIDsGroup } from '@/interfaces/datahealth'

export default defineComponent({
  props: {
    group: {
      type: Object as () => MultipleUKRDCIDsGroup,
      required: true,
    },
    fetchInProgress: {
      type: Boolean,
      required: false,
      default: false,
    },
    heading: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup() {
    return {
      formatDate,
    }
  },
})
</script>
