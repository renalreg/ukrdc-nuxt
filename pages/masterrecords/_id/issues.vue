<template>
  <div>
    <div v-if="stats && stats.errors == 0 && stats.workitems == 0 && stats.ukrdcids == 1" class="text-center">
      <TextP>No issues on record</TextP>
    </div>

    <!-- Multiple UKRDC IDs -->
    <GenericCard v-if="ukrdcIdGroup" class="mb-4">
      <empiMultipleIDItem :group="ukrdcIdGroup" heading="Multiple UKRDC IDs" />
    </GenericCard>

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
import { MultipleUKRDCIDsGroup } from '@/interfaces/datahealth'

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
    const { fetchMasterRecordRelated, fetchMasterRecordMessagesPage, fetchMasterRecordWorkItems } = fetchMasterRecords()
    const { hasPermission } = usePermissions()

    // Data refs
    const workItems = ref([] as WorkItem[])

    const relatedErrors = ref([] as Message[])
    const relatedErrorsPage = ref(1)
    const relatedErrorsSize = ref(5)
    const relatedErrorsTotal = ref(0)

    const ukrdcIdGroup = ref<MultipleUKRDCIDsGroup>()
    const hasMultipleUKRDCIDs = ref(false)

    // Data fetching

    async function fetchWorkItems() {
      // Use the record links to load related data concurrently
      if (hasPermission('ukrdc:workitems:read')) {
        workItems.value = await fetchMasterRecordWorkItems(props.record)
      }
    }

    async function updateRelatedErrors() {
      const res = await fetchMasterRecordMessagesPage(
        props.record,
        relatedErrorsPage.value || 1,
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

    function fetchMultipleUKRDCIds() {
      // If we haven't already fetched the multiple records, and multiple records exist
      if (!hasMultipleUKRDCIDs.value && props.stats?.ukrdcids > 1) {
        // Stop the request from triggering again
        hasMultipleUKRDCIDs.value = true

        fetchMasterRecordRelated(props.record, false, 'UKRDC').then((records) => {
          // Create a "synthetic" MultipleUKRDCIDsGroup
          // We do this so that we can re-use the component used in the EMPI Data Health page
          const multipleIdsGroup = {
            groupId: null,
            records: [],
          } as MultipleUKRDCIDsGroup

          for (const record of records) {
            multipleIdsGroup.records.push({
              lastUpdated: null,
              masterRecord: record,
            })
          }
          ukrdcIdGroup.value = multipleIdsGroup
        })
      }
    }

    onMounted(async () => {
      fetchMultipleUKRDCIds()
      fetchWorkItems()
      await updateRelatedErrors()
    })

    watch(relatedErrorsPage, () => {
      updateRelatedErrors()
    })

    watch(
      () => props.stats,
      () => {
        fetchMultipleUKRDCIds()
      }
    )

    return {
      workItems,
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
      ukrdcIdGroup,
      formatGender,
      formatDate,
    }
  },
})
</script>

<style></style>
