<template>
  <div>
    <GenericCard class="flex items-center p-2 mb-2">
      <div class="flex-grow pl-2">
        <SkeleText v-if="fetchInProgress" class="h-6 w-1/4" />
        <TextL1 v-else>Record Group {{ group.groupId }}</TextL1>
      </div>
      <div class="flex-shrink">
        <div v-if="group.records.length == 2 && !fetchInProgress">
          <GenericButtonMini
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
        </div>
        <div v-else>
          <GenericButtonMini :disabled="true">Start Merge</GenericButtonMini>
        </div>
      </div>
    </GenericCard>

    <GenericCard class="mb-8">
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
              details-label="Last checked"
              :details-value="formatDate(item.lastUpdated)"
            />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>
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
      required: true,
    },
  },
  setup() {
    return {
      formatDate,
    }
  },
})
</script>
