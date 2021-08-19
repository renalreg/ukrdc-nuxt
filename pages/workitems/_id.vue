<template>
  <div>
    <!-- Modals -->
    <GenericModalSlot v-if="hasPermission('ukrdc:workitems:write')" ref="addCommentModal">
      <div class="text-left">
        <div class="mb-4">Add Work Item comment</div>
        <FormTextArea v-model="customComment" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <genericButton @click="addCommentModal.hide()">Cancel</genericButton>
        <GenericButton class="ml-2" type="submit" @click="updateWorkItemComment()"> Save </GenericButton>
      </div>
    </GenericModalSlot>

    <GenericModalSlot v-if="hasPermission('ukrdc:workitems:write')" ref="closeModal">
      <div class="text-left">
        <div class="mb-4">{{ closeMessageOverride ? closeMessageOverride : 'Close the Work Item' }}</div>

        <div>
          <FormLabel>
            Comments
            <FormTextArea v-model="customComment" rows="3"></FormTextArea>
          </FormLabel>
        </div>
      </div>

      <div class="flex justify-end">
        <GenericButton @click="closeModal.hide()"> Cancel </GenericButton>
        <GenericButton type="submit" class="ml-3" colour="red" @click="closeWorkItem()">
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
      v-if="hasPermission('ukrdc:workitems:write') && record && record.status !== 3"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <GenericButton
        v-if="availableActions.comment"
        colour="indigo"
        class="inline-flex items-center justify-center w-full"
        @click="addCommentModal.show()"
      >
        <IconPencil />
        Comment
      </GenericButton>

      <GenericButton
        v-if="availableActions.close"
        class="inline-flex items-center justify-center w-full"
        colour="green"
        @click="closeModal.show()"
      >
        <IconCheckCircle />
        Close
      </GenericButton>

      <GenericButton
        v-if="record && availableActions.merge"
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

    <!-- Work Item Trigger -->
    <div v-if="record" class="flex">
      <TextH2 class="flex-grow mb-4">Work Item Trigger</TextH2>
      <div class="flex-shrink">
        <GenericButtonMini @click="showDestinationPersons = !showDestinationPersons">
          {{ showDestinationPersons ? 'Show Destination Master Record' : 'Show Related Person Records' }}
        </GenericButtonMini>
      </div>
    </div>

    <div v-if="record && record.destination.persons.length > 0" class="mb-8">
      <div v-if="record.destination.persons.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Type 9 incoming attribute card -->
        <WorkitemsAttributeRecordCard
          v-if="record.type === 9"
          class="border-2 border-green-500"
          :record="record.attributes"
          label="Incoming Attributes"
          :highlight="Object.keys(record.attributes)"
        />
        <!-- Else incoming person card -->
        <personsRecordCard
          v-else-if="record.incoming.person"
          class="border-2 border-red-500"
          :record="record.person"
          :label="`Incoming Person Record ${record.incoming.person.id}`"
          :highlight="Object.keys(record.attributes)"
        />
        <!-- Missing incoming person card -->
        <div v-else class="rounded-md bg-red-50 font-medium text-red-800 p-4">No incoming Person record</div>
        <!-- Destination person card -->
        <personsRecordCard
          v-if="showDestinationPersons"
          :record="record.destination.persons[relatedPersonsIndex]"
          :label="`Related Person Record ${relatedPersonsIndex + 1} of ${record.destination.persons.length}`"
          :highlight="Object.keys(record.attributes)"
        />
        <NuxtLink v-else :to="`/masterrecords/${record.destination.masterRecord.id}`">
          <masterrecordsRecordCard
            class="border-2 border-indigo-500"
            :record="record.destination.masterRecord"
            :label="`Destination Master Record ${record.destination.masterRecord.id}`"
          />
        </NuxtLink>
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
          <!-- Type 9 incoming attribute card -->
          <WorkitemsAttributeRecordCard
            v-if="record.type === 9"
            class="border-2 border-green-500"
            :record="record.attributes"
            label="Incoming Attributes"
            :highlight="Object.keys(record.attributes)"
          />
          <!-- Incoming records card -->
          <NuxtLink
            v-else-if="record.incoming.masterRecords.length > 0"
            :to="`/masterrecords/${record.incoming.masterRecords[relatedRecordsIndex].id}`"
          >
            <masterrecordsRecordCard
              class="border-2 border-indigo-500"
              :record="record.incoming.masterRecords[relatedRecordsIndex]"
              :label="`Incoming Master Record ${relatedRecordsIndex + 1} of ${record.incoming.masterRecords.length}`"
            />
          </NuxtLink>
          <!-- Empty incoming records card -->
          <div v-else class="rounded-md bg-red-50 font-medium text-red-800 p-4">No new incoming Master Records</div>
          <NuxtLink v-if="record.destination.masterRecord" :to="`/masterrecords/${record.destination.masterRecord.id}`">
            <masterrecordsRecordCard
              class="border-2 border-indigo-500"
              :record="record.destination.masterRecord"
              label="Destination Master Record"
            />
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

    <!-- Related errors card -->
    <ErrorsMiniList v-if="record" class="mt-4 mb-8" :errors-url="record.links.messages" :size="5" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useFetch, useContext, computed, useMeta } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'
import { isEmptyObject } from '@/utilities/objectUtils'
import { delay } from '@/utilities/timeUtils'
import { workItemIsMergable } from '@/utilities/workItemUtils'

import { WorkItem, WorkItemExtended } from '@/interfaces/workitem'
import { modalInterface } from '@/interfaces/modal'

import usePermissions from '~/mixins/usePermissions'

interface AvailableActions {
  close: boolean
  comment: boolean
  merge: boolean
  unlink: boolean
}

export default defineComponent({
  fetchOnServer: false,

  setup() {
    // Dependencies
    const route = useRoute()
    const { $axios, $config, $toast } = useContext()
    const { hasPermission } = usePermissions()

    // Head
    const { title } = useMeta()
    title.value = `Work Item ${route.value.params.id}`

    // Work item record data
    const record = ref<WorkItemExtended>()

    // Related persons data
    const workItemCollection = ref([] as WorkItem[])

    // Related record paginator data
    const relatedRecordsIndex = ref(0)
    const relatedPersonsIndex = ref(0)

    // Workitem status data
    const customComment = ref('')

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

    // Dynamic UI
    const showDestinationPersons = ref(false)
    const availableActions = computed<AvailableActions>(() => {
      return {
        // We can always comment and close?
        close: true,
        comment: true,
        // We can only merge if we have an incoming Master Record, and both
        // incoming and destination records are UKRDC type
        merge: workItemIsMergable(record.value),
        // Currently Unlink never makes sense, so ignore for now. Maybe remove entirely?
        unlink: false,
      } as AvailableActions
    })
    const closeMessageOverride = ref<String>()

    // Template refs
    const addCommentModal = ref<modalInterface>()
    const closeModal = ref<modalInterface>()

    // Trigger dynamic modals
    function checkMerged() {
      if (
        record.value?.status === 1 &&
        record.value?.destination.masterRecord.nationalidType === 'UKRDC' &&
        record.value?.incoming.masterRecords.length <= 0 &&
        route.value.query.justMerged === 'true'
      ) {
        closeMessageOverride.value =
          'It looks like the incoming Master Record for this Work Item has been merged. Close the Work Item?'
        closeModal.value?.show()
      }
    }

    // Data fetching
    const { fetch } = useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/v1/workitems/${route.value.params.id}/`
      const res: WorkItemExtended = await $axios.$get(path)
      record.value = res
      customComment.value = res.updateDescription

      // Check if the workitem has already been merged and is ready to be closed
      checkMerged()

      workItemCollection.value = await $axios.$get(record.value.links.collection)
    })

    // Workitem actions
    async function updateWorkItemComment() {
      const path = `${$config.apiBase}/v1/workitems/${route.value.params.id}/`
      await $axios.$put(path, {
        comment: customComment.value,
      })

      const el = addCommentModal.value as modalInterface
      el.toggle()
      fetch()
      $toast.show({
        type: 'success',
        title: 'Success',
        message: 'Comment added',
        classTimeout: 'bg-green-600',
      })
    }

    function closeWorkItem() {
      // Close a workitem with a comment
      $axios
        .$post(`${$config.apiBase}/v1/workitems/${route.value.params.id}/close`, {
          comment: customComment.value,
        })
        .catch((error) => {
          console.log(error.response.data.detail)
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
            fetch()
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
      showDestinationPersons,
      updateWorkItemComment,
      closeWorkItem,
      hasPermission,
    }
  },
  head: {
    title: 'Work Item',
  },
})
</script>
