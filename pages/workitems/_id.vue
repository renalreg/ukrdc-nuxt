<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <GenericModalSlot
      v-if="$hasPermission('ukrdc:workitems:write')"
      ref="addCommentModal"
    >
      <div class="text-left">
        <div class="mb-4">Add Work Item comment</div>
        <FormTextArea v-model="customComment" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <genericButton @click="addCommentModal.hide()">Cancel</genericButton>
        <genericButtonPrimary
          class="ml-2"
          type="submit"
          @click="updateWorkItemComment()"
        >
          Save
        </genericButtonPrimary>
      </div>
    </GenericModalSlot>

    <GenericModalSlot
      v-if="$hasPermission('ukrdc:workitems:write')"
      ref="mergeModal"
    >
      <div class="text-left">
        <div class="mb-4">Merge and close the Work Item</div>

        <FormLabel>
          Comments
          <FormTextArea v-model="customComment" rows="3"></FormTextArea>
        </FormLabel>
      </div>

      <div class="flex justify-end">
        <genericButton @click="mergeModal.hide()"> Cancel </genericButton>
        <genericButtonPrimary
          type="submit"
          class="ml-2"
          @click="mergeWorkItem()"
        >
          Merge and Close
        </genericButtonPrimary>
      </div>
    </GenericModalSlot>

    <GenericModalSlot
      v-if="$hasPermission('ukrdc:workitems:write')"
      ref="unlinkModal"
    >
      <div class="text-left">
        <div class="mb-4">Unlink and close the Work Item</div>
        <div>
          <FormLabel>
            Comments
            <FormTextArea v-model="customComment" rows="3"></FormTextArea>
          </FormLabel>
        </div>
      </div>

      <div class="flex justify-end">
        <GenericButton @click="unlinkModal.hide()"> Cancel </GenericButton>
        <genericButtonPrimary
          type="submit"
          class="ml-3"
          colour="red"
          @click="unlinkWorkItem()"
        >
          Unlink and Close
        </genericButtonPrimary>
      </div>
    </GenericModalSlot>

    <!-- Header -->
    <div class="mb-6">
      <TextH1 v-if="!isEmptyObject(record)">
        Work Item {{ record.id }} {{ statusString }}
      </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
      <TextL1 v-if="!isEmptyObject(record)">
        {{ record.description }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <GenericCard>
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Last Updated</TextDt>
            <TextDd v-if="!isEmptyObject(record)">
              {{
                record.lastUpdated ? formatDate(record.lastUpdated) : 'Never'
              }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Last Updated By</TextDt>
            <TextDd v-if="!isEmptyObject(record)">
              {{ record.updatedBy ? record.updatedBy : 'N/A' }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi class="sm:col-span-2">
            <TextDt>Comments</TextDt>
            <TextDd v-if="!isEmptyObject(record)">
              {{ record.updateDescription ? record.updateDescription : 'None' }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <div
      v-if="$hasPermission('ukrdc:workitems:write') && record.status !== 3"
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8"
    >
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          @click="addCommentModal.show()"
        >
          <IconPencil />
          Comment
        </genericButtonPrimary>
      </div>
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          colour="green"
          @click="mergeModal.show()"
        >
          <IconLink />
          Merge
        </genericButtonPrimary>
      </div>
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          colour="red"
          @click="unlinkModal.show()"
        >
          <IconXCircle />
          Unlink
        </genericButtonPrimary>
      </div>
    </div>

    <!-- Related errors card -->
    <GenericCard
      v-if="relatedErrors && relatedErrors.length > 0"
      class="mt-4 mb-8"
    >
      <GenericCardHeader>
        <TextH2> Related Errors </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <errorsListItem
          v-for="item in relatedErrors"
          :key="item.id"
          :item="item"
        />
      </ul>
      <GenericPaginator
        class="bg-white border-t border-gray-200"
        :page="relatedErrorsPage"
        :size="relatedErrorsSize"
        :total="relatedErrorsTotal"
        @next="page++"
        @prev="page--"
      />
    </GenericCard>

    <!-- Related WorkItems  -->
    <GenericCard v-if="relatedRecords.length > 0" class="mb-8">
      <!-- Card header -->
      <GenericCardHeader>
        <TextH2> Related Work Items </TextH2>
      </GenericCardHeader>
      <!-- Results list -->
      <ul class="divide-y divide-gray-200">
        <workitemsListItem
          v-for="item in relatedRecords"
          :key="item.id"
          :item="item"
        />
      </ul>
    </GenericCard>

    <div class="mb-8">
      <TextH2 class="mb-4"> Proposed Link </TextH2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <personsRecordCard
          v-if="record.person"
          class="border-2 border-red-500"
          :record="record.person"
          label="Incoming"
          :highlight="Object.keys(record.attributes)"
        />
        <div
          v-else
          class="rounded-md bg-red-50 text-sm font-medium text-red-800 p-4"
        >
          No valid person record found
        </div>
        <NuxtLink
          v-if="record.masterRecord"
          :to="`/masterrecords/${record.masterRecord.id}`"
        >
          <masterrecordsRecordCard
            class="border-2 border-indigo-500"
            :record="record.masterRecord"
            label="Master record"
          />
        </NuxtLink>

        <div
          v-else
          class="rounded-md bg-red-50 text-sm font-medium text-red-800 p-4"
        >
          No valid master record found
        </div>
      </div>
    </div>

    <div v-if="relatedPersons.length > 0" class="mb-8">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Compare Records
      </h3>

      <div
        v-if="relatedPersons.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <personsRecordCard
          v-if="record.person"
          class="border-2 border-red-500"
          :record="record.person"
          label="Incoming"
          :full="true"
          :highlight="Object.keys(record.attributes)"
        />
        <div
          v-else
          class="rounded-md bg-red-50 text-sm font-medium text-red-800 p-4"
        >
          No valid person record found
        </div>
        <personsRecordCard
          :record="relatedPersons[relatedRecordsIndex]"
          :label="`Related record ${relatedRecordsIndex + 1} of ${
            relatedPersons.length
          }`"
          :full="true"
          :highlight="Object.keys(record.attributes)"
        />
      </div>

      <GenericCard v-if="relatedPersons.length > 1" class="pl-4 mt-2">
        <GenericItemPaginator
          v-model="relatedRecordsIndex"
          :total="relatedPersons.length"
          item-label="Record"
      /></GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  useFetch,
  useContext,
  computed,
  watch,
} from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'
import { isEmptyObject } from '@/utilities/objectUtils'

import { Person } from '@/interfaces/persons'
import { WorkItem } from '@/interfaces/workitem'
import { modalInterface } from '@/interfaces/modal'
import { MirthMessageResponse } from '@/interfaces/mirth'
import { Message } from '@/interfaces/errors'

export default defineComponent({
  setup() {
    // Dependencies
    const route = useRoute()
    const { $axios, $config, $toast } = useContext()

    // Work item record data
    const record = ref({} as WorkItem)

    // Related errors data
    const relatedErrors = ref([] as Message[])
    const relatedErrorsPage = ref(0)
    const relatedErrorsSize = ref(5)
    const relatedErrorsTotal = ref(0)

    // Related persons data
    const relatedRecords = ref([] as WorkItem[])
    const relatedPersons = ref([] as Person[])

    // Related record paginator data
    const relatedRecordsIndex = ref(0)

    // Workitem status data
    const customComment = ref('')

    const statusString = computed(() => {
      if (record.value.status === 1) {
        return ''
      } else if (record.value.status === 2) {
        return '(WIP)'
      } else if (record.value.status === 3) {
        return '(Closed)'
      } else {
        return '(Unknown status)'
      }
    })

    // Template refs
    const addCommentModal = ref<modalInterface>()
    const mergeModal = ref<modalInterface>()
    const unlinkModal = ref<modalInterface>()

    // Data fetching
    const { fetch } = useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/empi/workitems/${route.value.params.id}/`
      const res: WorkItem = await $axios.$get(path)
      record.value = res
      customComment.value = res.updateDescription

      // Use the record links to load related data concurrently
      const [relatedRecordsRes, relatedPersonsRes] = await Promise.all([
        $axios.$get(record.value.links.related),
        $axios.$get(record.value.masterRecord.links.persons),
        updateRelatedErrors(),
      ])

      // Set related workitems
      relatedRecords.value = relatedRecordsRes

      // Exclude the WorkItems Person record from our related Persons array
      relatedPersons.value = []
      if (record.value.person && relatedPersonsRes) {
        for (const relatedPerson of relatedPersonsRes) {
          if (relatedPerson.id !== record.value.person.id) {
            relatedPersons.value.push(relatedPerson)
          }
        }
      }
    })

    async function updateRelatedErrors(): Promise<void> {
      console.log('Updating related errors')
      const res = await $axios.$get(
        record.value.links.errors +
          `?page=${relatedErrorsPage.value}&size=${relatedErrorsSize.value}`
      )
      // Set related errors
      relatedErrors.value = res.items
      relatedErrorsPage.value = res.page
      relatedErrorsSize.value = res.size
      relatedErrorsTotal.value = res.total
    }

    watch(relatedErrorsPage, () => {
      updateRelatedErrors()
    })

    // Workitem actions
    async function updateWorkItemComment() {
      const path = `${$config.apiBase}/empi/workitems/${route.value.params.id}/`
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

    function mergeWorkItem() {
      actionWorkItem(
        `${$config.apiBase}/empi/workitems/${route.value.params.id}/merge`
      )
      const el = mergeModal.value as modalInterface
      el.toggle()
    }

    function unlinkWorkItem() {
      actionWorkItem(
        `${$config.apiBase}/empi/workitems/${route.value.params.id}/unlink`
      )
      const el = unlinkModal.value as modalInterface
      el.toggle()
    }

    function actionWorkItem(postPath: string) {
      $axios
        .$post(postPath)
        .then((res: MirthMessageResponse) => {
          if (res.status === 'success') {
            $axios
              .$post(
                `${$config.apiBase}/empi/workitems/${route.value.params.id}/close`,
                {
                  comment: customComment.value,
                }
              )
              .catch((error) => {
                // Re-throw error so parent .catch can handle it
                throw error
              })
          }
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
        })
        .finally(() => {
          fetch()
        })
    }

    return {
      record,
      relatedRecords,
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
      relatedPersons,
      formatDate,
      formatGender,
      isEmptyObject,
      relatedRecordsIndex,
      customComment,
      statusString,
      addCommentModal,
      mergeModal,
      unlinkModal,
      updateWorkItemComment,
      mergeWorkItem,
      unlinkWorkItem,
    }
  },
  head: {
    title: 'Work Item',
  },
})
</script>
