<template>
  <div>
    <!-- Modals -->
    <GenericModalSlot v-if="hasPermission('ukrdc:workitems:write')" ref="addCommentModal">
      <div class="text-left">
        <div class="mb-4">Add Work Item comment</div>
        <FormTextArea v-model="customComment" :max-length="100" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <GenericButton @click="addCommentModal.hide()">Cancel</GenericButton>
        <GenericButton colour="indigo" class="ml-2" type="submit" @click="updateWorkItemComment()">
          Save
        </GenericButton>
      </div>
    </GenericModalSlot>

    <GenericModalSlot v-if="hasPermission('ukrdc:workitems:write')" ref="closeModal">
      <div class="text-left">
        <div class="mb-4">{{ closeMessageOverride ? closeMessageOverride : 'Close the Work Item' }}</div>

        <div>
          <FormLabel>
            Comments
            <FormTextArea v-model="customComment" :max-length="100" rows="3"></FormTextArea>
          </FormLabel>
        </div>
      </div>

      <div class="flex justify-end">
        <GenericButton @click="closeModal.hide()"> Cancel </GenericButton>
        <GenericButton type="submit" class="ml-3" colour="red" @click="handleCloseWorkItem()">
          Close Work Item
        </GenericButton>
      </div>
    </GenericModalSlot>

    <!-- Header -->
    <div class="mb-6">
      <TextH1 v-if="record"> Work Item {{ record.id }} {{ statusString }} </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
      <TextL1 v-if="record">
        {{ record.description }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <!-- Work Item Details -->
      <WorkitemsDetailCard :item="record" />
      <!-- Work Item Advice -->
      <WorkitemsAdviceCard :item="record" :related="workItemCollection" />
    </div>

    <!-- Action Buttons -->
    <div
      v-if="hasPermission('ukrdc:workitems:write') && record"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <GenericButton
        v-if="availableActions.comment"
        :primary="true"
        colour="indigo"
        class="inline-flex items-center justify-center w-full"
        @click="addCommentModal.show()"
      >
        <IconPencil />
        Comment
      </GenericButton>

      <GenericButton
        v-if="availableActions.close && record.status !== 3"
        :primary="true"
        class="inline-flex items-center justify-center w-full"
        colour="green"
        @click="closeModal.show()"
      >
        <IconCheckCircle />
        Close
      </GenericButton>

      <GenericButton
        v-if="availableActions.merge && record.status !== 3"
        :primary="true"
        tooltip="You will be redirected here after merging"
        :to="{
          path: '/empi/merge',
          query: {
            superseded: record.incoming.masterRecords[relatedRecordsIndex].id,
            superseding: record.destination.masterRecord.id,
            callback: $route.fullPath + '?justMerged=true',
          },
        }"
        class="inline-flex items-center justify-center w-full"
        colour="yellow"
      >
        <IconMiniExternalLink />
        Merge Master Records
      </GenericButton>
    </div>

    <!-- Work Item Trigger -->
    <div v-if="record" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div id="incomingCard">
          <!-- Attribute toggle -->
          <GenericTabToggle
            v-model="showIncomingAttributes"
            true-label="Incoming Attributes"
            false-label="Incoming Person Record"
            class="mb-2"
          />
          <!-- Type 9 incoming attribute card -->
          <WorkitemsAttributeRecordCard
            v-if="showIncomingAttributes"
            :record="record.attributes"
            label="Incoming Attributes"
            :highlight="Object.keys(record.attributes)"
            :full="showDestinationPersons"
          />
          <!-- Else incoming person card -->
          <personsRecordCard
            v-else-if="record.incoming.person"
            :record="record.person"
            :label="`Incoming Person Record ${record.incoming.person.id}`"
            :highlight="Object.keys(record.attributes)"
            :full="showDestinationPersons"
          />
          <!-- Missing incoming person card -->
          <div v-else class="rounded-md bg-red-50 font-medium text-red-800 p-4">No incoming Person record</div>
        </div>

        <div id="destinationCard">
          <!-- Destination toggle -->
          <GenericTabToggle
            v-model="showDestinationPersons"
            true-label="Related Person Records"
            false-label="Destination Master Record"
            class="mb-2"
          />
          <!-- Destination person card -->
          <personsRecordCard
            v-if="showDestinationPersons && record.destination.persons.length > 0"
            :record="record.destination.persons[relatedPersonsIndex]"
            :label="`Related Person Record ${relatedPersonsIndex + 1} of ${record.destination.persons.length}`"
            :highlight="Object.keys(record.attributes)"
            :full="true"
          />
          <!-- Destination record card -->
          <NuxtLink
            v-else-if="record.destination.masterRecord"
            :to="`/masterrecords/${record.destination.masterRecord.id}`"
          >
            <masterrecordsRecordCard
              :record="record.destination.masterRecord"
              :label="`Destination Master Record ${record.destination.masterRecord.id}`"
            />
          </NuxtLink>
          <!-- Missing destination record card -->
          <div v-else class="rounded-md bg-red-50 text-red-800 p-4">
            <p class="font-medium">Destination record no longer exists</p>
            <p>The record may have been merged or delete already</p>
          </div>
        </div>
      </div>
      <GenericCard v-if="showDestinationPersons && record.destination.persons.length > 1" class="pl-4 mt-2">
        <GenericItemPaginator
          v-model="relatedPersonsIndex"
          :total="record.destination.persons.length"
          item-label="Record"
      /></GenericCard>
    </div>

    <!-- Proposed Merge -->
    <div v-if="availableActions.merge">
      <TextH2 class="mb-4">Proposed Merge</TextH2>

      <div v-if="record" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Incoming records card -->
          <NuxtLink
            v-if="record.incoming.masterRecords.length > 0"
            :to="`/masterrecords/${record.incoming.masterRecords[relatedRecordsIndex].id}`"
          >
            <masterrecordsRecordCard
              :record="record.incoming.masterRecords[relatedRecordsIndex]"
              :label="`Incoming Master Record ${relatedRecordsIndex + 1} of ${record.incoming.masterRecords.length}`"
            />
          </NuxtLink>
          <!-- Empty incoming records card -->
          <div v-else class="rounded-md bg-red-50 font-medium text-red-800 p-4">No new incoming Master Records</div>
          <NuxtLink v-if="record.destination.masterRecord" :to="`/masterrecords/${record.destination.masterRecord.id}`">
            <masterrecordsRecordCard :record="record.destination.masterRecord" label="Destination Master Record" />
          </NuxtLink>
        </div>
        <GenericCard v-if="record.incoming.masterRecords.length > 1" class="pl-4 mt-2">
          <GenericItemPaginator
            v-model="relatedRecordsIndex"
            :total="record.incoming.masterRecords.length"
            item-label="Record"
        /></GenericCard>
      </div>
    </div>

    <!-- Related Work Items  -->
    <GenericCard v-if="workItemCollection.length > 0" class="mb-8">
      <!-- Card header -->
      <GenericCardHeader>
        <TextH2>Related Work Items</TextH2>
        <TextL2>Work Items for the same patient, raised by the same event</TextL2>
      </GenericCardHeader>
      <!-- Results list -->
      <ul class="divide-y divide-gray-200">
        <div v-for="item in workItemCollection" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>

    <!-- Related errors card -->
    <WorkitemsRelatedErrorsList v-if="record" class="mt-4 mb-8" :workitem="record" :size="5" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useMeta, useRoute } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'
import { isEmptyObject } from '@/helpers/utils/objectUtils'
import { delay } from '@/helpers/utils/timeUtils'
import { workItemIsMergable } from '@/helpers/utils/workItemUtils'

import { WorkItem, WorkItemExtended } from '@/interfaces/workitem'
import { modalInterface } from '@/interfaces/modal'

import usePermissions from '~/helpers/usePermissions'
import fetchWorkItems from '~/helpers/fetch/fetchWorkItems'

interface AvailableActions {
  close: boolean
  comment: boolean
  merge: boolean
  unlink: boolean
}

export default defineComponent({
  setup() {
    // Dependencies
    const route = useRoute()
    const { $toast } = useContext()
    const { hasPermission } = usePermissions()
    const { fetchWorkItem, closeWorkItem, putWorkItemComment, fetchWorkItemCollection } = fetchWorkItems()

    // Head
    const { title } = useMeta()
    title.value = `Work Item ${route.value.params.id}`

    // Work item record data
    const record = ref<WorkItemExtended>()
    const customComment = ref('')

    // Related persons data
    const workItemCollection = ref([] as WorkItem[])

    // Related record paginator data
    const relatedRecordsIndex = ref(0)
    const relatedPersonsIndex = ref(0)

    // Data fetching

    async function getWorkItem() {
      record.value = await fetchWorkItem(route.value.params.id)
      workItemCollection.value = await fetchWorkItemCollection(record.value)

      // Apply existing comment
      customComment.value = record.value?.updateDescription || ''

      // Check if the workitem has already been merged and is ready to be closed
      checkMerged()
    }

    onMounted(() => {
      getWorkItem()
    })

    // Trigger dynamic modals

    function checkMerged() {
      if (
        record.value?.status === 1 &&
        record.value?.destination.masterRecord?.nationalidType === 'UKRDC' &&
        record.value?.incoming.masterRecords.length <= 0 &&
        route.value.query.justMerged === 'true'
      ) {
        closeMessageOverride.value =
          'It looks like the incoming Master Record for this Work Item has been merged. Close the Work Item?'
        closeModal.value?.show()
      }
    }

    // Dynamic UI

    const statusString = computed(() => {
      if (record.value?.status === 1) {
        return ''
      } else if (record.value?.status === 2) {
        return '(WIP)'
      } else if (record.value?.status === 3) {
        return '(Closed)'
      } else {
        return '(Unknown status)'
      }
    })

    const showIncomingAttributes = ref(false)

    const showDestinationPersons = ref(false)

    const availableActions = computed<AvailableActions>(() => {
      return {
        // We can always comment and close?
        close: true,
        comment: true,
        // We can only merge if we have an incoming Master Record, and both
        // incoming and destination records are UKRDC type
        merge: record.value ? workItemIsMergable(record.value) : false,
        // Currently Unlink never makes sense, so ignore for now. Maybe remove entirely?
        unlink: false,
      } as AvailableActions
    })

    const closeMessageOverride = ref<String>()

    // Template refs
    const addCommentModal = ref<modalInterface>()
    const closeModal = ref<modalInterface>()

    // Workitem actions
    function updateWorkItemComment() {
      putWorkItemComment(route.value.params.id, customComment.value)
        .then(() => {
          $toast.show({
            type: 'success',
            title: 'Success',
            message: 'Comment added',
            classTimeout: 'bg-green-600',
          })
        })
        .catch((error) => {
          $toast.show({
            type: 'danger',
            title: 'Error',
            message: error.response.data.detail,
            timeout: 10,
            classTimeout: 'bg-red-600',
          })
          throw error
        })
        .finally(() => {
          // Delay fetch to allow JTRACE time to process
          delay(1000).then(() => {
            getWorkItem()
          })
        })

      const el = addCommentModal.value as modalInterface
      el.toggle()
    }

    function handleCloseWorkItem() {
      closeWorkItem(route.value.params.id, customComment.value)
        .then(() => {
          $toast.show({
            type: 'success',
            title: 'Success',
            message: 'Work Item closed',
            classTimeout: 'bg-green-600',
          })
        })
        .catch((error) => {
          $toast.show({
            type: 'danger',
            title: 'Error',
            message: error.response.data.detail,
            timeout: 10,
            classTimeout: 'bg-red-600',
          })
          throw error
        })
        .finally(() => {
          // Delay fetch to allow JTRACE time to process
          delay(1000).then(() => {
            getWorkItem()
          })
        })

      const el = closeModal.value as modalInterface
      el.toggle()
    }

    return {
      record,
      formatDate,
      formatGender,
      isEmptyObject,
      workItemCollection,
      relatedRecordsIndex,
      relatedPersonsIndex,
      customComment,
      statusString,
      availableActions,
      addCommentModal,
      closeModal,
      closeMessageOverride,
      showIncomingAttributes,
      showDestinationPersons,
      updateWorkItemComment,
      handleCloseWorkItem,
      hasPermission,
    }
  },
  head: {
    title: 'Work Item',
  },
})
</script>
