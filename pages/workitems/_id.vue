<template>
  <div>
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

    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
      <!-- Work Item Details -->
      <GenericCard class="mb-8">
        <GenericCardHeader><TextH2>Details</TextH2></GenericCardHeader>
        <GenericCardContent>
          <GenericDl>
            <GenericDi>
              <TextDt>Last Updated</TextDt>
              <TextDd v-if="record">
                {{ record.lastUpdated ? formatDate(record.lastUpdated) : 'Never' }}
              </TextDd>
              <SkeleText v-else class="h-6 w-full" />
            </GenericDi>
            <GenericDi>
              <TextDt>Last Updated By</TextDt>
              <TextDd v-if="record">
                {{ record.updatedBy ? record.updatedBy : 'N/A' }}
              </TextDd>
              <SkeleText v-else class="h-6 w-full" />
            </GenericDi>
            <GenericDi class="sm:col-span-2">
              <TextDt>Comments</TextDt>
              <TextDd v-if="record">
                {{ record.updateDescription ? record.updateDescription : 'None' }}
              </TextDd>
              <SkeleText v-else class="h-6 w-full" />
            </GenericDi>
          </GenericDl>
        </GenericCardContent>
      </GenericCard>
      <!-- Work Item Advice -->
      <GenericCard class="mb-8">
        <GenericCardHeader><TextH2>Advice</TextH2></GenericCardHeader>
        <GenericCardContent>
          <ul>
            <li v-for="(adviceIndex, index) in workItemAdvices" :key="`advice${index}`" class="mb-2">
              {{ advicesMap[adviceIndex] }}
            </li>
          </ul>
        </GenericCardContent>
      </GenericCard>
    </div>

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
            callback: $route.fullPath,
          },
        }"
        class="inline-flex items-center justify-center w-full"
        colour="yellow"
      >
        <IconMiniExternalLink />
        Merge Master Records
      </GenericButton>
    </div>

    <!-- WorkItem Collection  -->
    <GenericCard v-if="record && record.collection.length > 0" class="mb-8">
      <!-- Card header -->
      <GenericCardHeader>
        <TextH2> Related Work Items </TextH2>
        <TextL2>Work Items for the same patient, raised by the same event</TextL2>
      </GenericCardHeader>
      <!-- Results list -->
      <ul class="divide-y divide-gray-200">
        <div v-for="item in record.collection" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>

    <TextH2 class="mb-4">Compare Records</TextH2>

    <!-- Compare records cards -->
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

    <!-- Compare persons cards -->
    <div v-if="record && record.destination.persons.length > 0" class="mb-8">
      <div v-if="record.destination.persons.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <personsRecordCard
          v-if="record.incoming.person"
          class="border-2 border-red-500"
          :record="record.person"
          label="Incoming Person Record"
          :full="true"
          :highlight="Object.keys(record.attributes)"
        />
        <WorkitemsAttributeRecordCard
          v-else-if="!isEmptyObject(record.attributes)"
          class="border-2 border-green-500"
          :record="record.attributes"
          label="Incoming Attributes"
          :highlight="Object.keys(record.attributes)"
          :full="true"
        />
        <div v-else class="rounded-md bg-red-50 font-medium text-red-800 p-4">No incoming Person record</div>
        <personsRecordCard
          :record="record.destination.persons[relatedPersonsIndex]"
          :label="`Related Person Record ${relatedPersonsIndex + 1} of ${record.destination.persons.length}`"
          :full="true"
          :highlight="Object.keys(record.attributes)"
        />
      </div>
      <GenericCard v-if="record.destination.persons.length > 1" class="pl-4 mt-2">
        <GenericItemPaginator
          v-model="relatedPersonsIndex"
          :total="record.destination.persons.length"
          item-label="Record"
      /></GenericCard>
    </div>

    <!-- Related errors card -->
    <ErrorsMiniList v-if="record" class="mt-4 mb-8" :errors-url="record.links.messages" :size="5" />

    <!-- Related WorkItems  -->
    <GenericCard v-if="relatedWorkItems.length > 0" class="mb-8">
      <!-- Card header -->
      <GenericCardHeader>
        <TextH2>Other Open Work Items</TextH2>
        <TextL2>Open Work Items for the same patient</TextL2>
      </GenericCardHeader>
      <!-- Results list -->
      <ul class="divide-y divide-gray-200">
        <div v-for="item in relatedWorkItems" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useFetch, useContext, computed, useMeta } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'
import { isEmptyObject } from '@/utilities/objectUtils'
import { delay } from '@/utilities/timeUtils'

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
    const relatedWorkItems = ref([] as WorkItem[])

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
    const availableActions = computed<AvailableActions>(() => {
      return {
        // We can always comment and close?
        close: true,
        comment: true,
        // We can only merge if we have an incoming Master Record, and both
        // incoming and destination records are UKRDC type
        merge:
          record.value &&
          record.value.type !== 9 &&
          record.value.incoming.masterRecords.length > 0 &&
          record.value.destination.masterRecord.nationalidType === 'UKRDC',
        // Currently Unlink never makes sense, so ignore for now. Maybe remove entirely?
        unlink: false,
      } as AvailableActions
    })
    const closeMessageOverride = ref<String>()

    const advicesMap = {
      0: 'No advice available.',
      1: 'This Work Item is already closed.',
      2: 'Related Work Items labelled UKRDC should be resolved first. See below.',
      3: 'No new incoming Master Records. This Work Item can probably be closed.',
      4: 'You may need to use DemoGraphicGenerator.exe to issue a demographic update before closing this Work Item.',
      5: 'Check incoming and destination records, then merge the two records if the link is valid.',
    }
    const workItemAdvices = computed(() => {
      const advices: number[] = []
      // If we have a Work Item record
      if (record.value) {
        // If the Work Item is already closed
        if (record.value.status === 3) {
          // Advise that the Work Item is already closed
          advices.push(1)
        }
        // If the Work Item is part of a collection
        if (record.value.collection.length > 0) {
          // For each related Work Item in the collection
          for (const relatedItem of record.value.collection) {
            // If the related Work Item is a mergable UKRDC Work Item
            if (relatedItem.masterRecord.nationalidType === 'UKRDC' && relatedItem.status !== 3) {
              // Advise that the UKRDC item should be resolved first
              advices.push(2)
              break
            }
          }
        }
        // For type 6 or 7 work items
        if (record.value.type === 6 || record.value.type === 7) {
          // If there are no incoming Master Records
          if (record.value.incoming.masterRecords.length === 0) {
            if (record.value.status !== 3) {
              // Advise that the workitem is probably ready to be closed
              advices.push(3)
            }
          } else {
            // Advise that a demographic update may be required
            advices.push(4)
          }
        }
        // For type 3 or 4 work items
        else if (record.value.type === 3 || record.value.type === 4) {
          // If there are no incoming Master Records
          if (record.value.incoming.masterRecords.length === 0) {
            if (record.value.status !== 3) {
              // Advise that the workitem is probably ready to be closed
              advices.push(3)
            }
            // If records are mergable (i.e. both are UKRDC records)
          } else if (availableActions.value.merge) {
            // Advise that records could be merged
            advices.push(5)
          }
        }
      }

      // Advise if there is no advice available...
      if (advices.length === 0) {
        advices.push(0)
      }

      return advices
    })

    // Template refs
    const addCommentModal = ref<modalInterface>()
    const closeModal = ref<modalInterface>()

    // Data fetching
    const { fetch } = useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/v1/workitems/${route.value.params.id}/`
      const res: WorkItemExtended = await $axios.$get(path)
      record.value = res
      customComment.value = res.updateDescription

      // Check if the workitem has already been actioned and is ready to be closed
      if (
        record.value?.status === 1 &&
        record.value?.destination.masterRecord.nationalidType === 'UKRDC' &&
        record.value?.incoming.masterRecords.length <= 0
      ) {
        closeMessageOverride.value =
          'It looks like the incoming Master Record for this Work Item has been merged. Close the Work Item?'
        closeModal.value?.show()
      }

      // Use the record links to load related data concurrently
      relatedWorkItems.value = await $axios.$get(record.value.links.related)
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
      relatedWorkItems,
      relatedRecordsIndex,
      relatedPersonsIndex,
      customComment,
      statusString,
      availableActions,
      addCommentModal,
      closeModal,
      closeMessageOverride,
      workItemAdvices,
      advicesMap,
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
