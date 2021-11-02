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
        <div v-for="item in workItems" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>

    <!-- Related errors card -->
    <GenericCard v-if="relatedErrors && relatedErrors.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Record Errors </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in relatedErrors" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <GenericPaginator
        class="bg-white border-t border-gray-200"
        :jump-to-top="false"
        :page="relatedErrorsPage"
        :size="relatedErrorsSize"
        :total="relatedErrorsTotal"
        @next="relatedErrorsPage++"
        @prev="relatedErrorsPage--"
        @jump="relatedErrorsPage = $event"
      />
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'

import { MasterRecord, MasterRecordStatistics } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'

import usePermissions from '~/helpers/usePermissions'
import { Message } from '~/interfaces/messages'
import fetchMasterRecords from '@/helpers/fetch/fetchMasterRecords'

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
    const { fetchMasterRecordMessagesPage, fetchMasterRecordWorkItems } = fetchMasterRecords()
    const { hasPermission } = usePermissions()

    // Data refs
    const workItems = ref([] as WorkItem[])

    const relatedErrors = ref([] as Message[])
    const relatedErrorsPage = ref(1)
    const relatedErrorsSize = ref(5)
    const relatedErrorsTotal = ref(0)

    // Data fetching

    async function fetchWorkItems() {
      // Use the record links to load related data concurrently
      if (hasPermission('ukrdc:workitems:read')) {
        workItems.value = await fetchMasterRecordWorkItems(props.record)
      }
    }

    async function updateRelatedErrors(): Promise<void> {
      const res = await fetchMasterRecordMessagesPage(
        props.record,
        relatedErrorsPage.value || 0,
        relatedErrorsSize.value,
        'desc',
        ['ERROR'], // Status filter
        null, // Since filter
        null // Until filter
      )
      // Set related errors
      relatedErrors.value = res.items
      relatedErrorsPage.value = res.page
      relatedErrorsSize.value = res.size
      relatedErrorsTotal.value = res.total
    }

    onMounted(async () => {
      fetchWorkItems()
      await updateRelatedErrors()
    })

    watch(relatedErrorsPage, () => {
      updateRelatedErrors()
    })

    return {
      workItems,
      formatGender,
      formatDate,
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
    }
  },
})
</script>

<style></style>
