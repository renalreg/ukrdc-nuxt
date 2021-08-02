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
        <div class="mb-4">Close the Work Item</div>

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

    <GenericCard class="mb-8">
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

    <TextH2 class="mb-4">Compare Records</TextH2>

    <!-- Compare records cards -->
    <div v-if="record" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-if="record.incoming.masterRecords.length > 0"
          :to="`/masterrecords/${record.incoming.masterRecords[relatedRecordsIndex].id}`"
        >
          <masterrecordsRecordCard
            class="border-2 border-indigo-500"
            :record="record.incoming.masterRecords[relatedRecordsIndex]"
            :label="`Incoming Master Record ${relatedRecordsIndex + 1} of ${record.incoming.masterRecords.length}`"
          />
        </NuxtLink>
        <WorkitemsAttributeRecordCard
          v-else-if="!isEmptyObject(record.attributes)"
          class="border-2 border-green-500"
          :record="record.attributes"
          label="Incoming Attributes"
          :highlight="Object.keys(record.attributes)"
        />
        <div v-else class="rounded-md bg-red-50 font-medium text-red-800 p-4">No incoming Master Records</div>
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
        <TextH2> Related Work Items </TextH2>
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
