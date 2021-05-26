<template>
  <div>
    <div v-if="stats && stats.errors == 0 && stats.workitems == 0" class="text-center">
      <TextP>No issues on record</TextP>
    </div>
    <!-- Related Work Items card -->
    <GenericCard v-if="workItems && workItems.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Open Work Items </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <workitemsListItem v-for="item in workItems" :key="item.id" :item="item" />
      </ul>
    </GenericCard>

    <!-- Related errors card -->
    <ErrorsMiniList
      v-if="record && record.links"
      class="my-4"
      title="Record Errors"
      :errors-url="record.links.errors"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch, useContext } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'

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
    const { $axios, $hasPermission } = useContext()

    const workItems = ref([] as WorkItem[])

    useFetch(async () => {
      // Use the record links to load related data concurrently
      if ($hasPermission('ukrdc:records:read')) {
        workItems.value = await $axios.$get(props.record.links.workitems)
      }
    })

    return {
      workItems,
      formatGender,
      formatDate,
    }
  },
})
</script>

<style></style>
