<template>
  <GenericCard>
    <GenericCardContent>
      <GenericDl>
        <GenericDi>
          <TextDt>Last Updated</TextDt>
          <TextDd>
            {{ item.lastUpdated ? formatDate(item.lastUpdated) : 'Never' }}
          </TextDd>
        </GenericDi>
        <GenericDi>
          <TextDt>Last Updated By</TextDt>
          <TextDd class="mt-1 text-sm text-gray-900">
            {{ item.updatedBy ? item.updatedBy : 'N/A' }}
          </TextDd>
        </GenericDi>
        <GenericDi class="sm:col-span-2">
          <TextDt>Comments</TextDt>
          <TextDd class="mt-1 text-sm text-gray-900">
            {{ item.updateDescription ? item.updateDescription : 'None' }}
          </TextDd>
        </GenericDi>
      </GenericDl>
    </GenericCardContent>
  </GenericCard>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import { WorkItem } from '@/interfaces/workitem'

export default Vue.extend({
  mixins: [dateUtilsMixin],
  props: {
    item: {
      type: Object as () => WorkItem,
      required: true,
    },
  },
})
</script>
