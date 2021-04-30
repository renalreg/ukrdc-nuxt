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
        <genericButton @click="$refs.addCommentModal.hide()"
          >Cancel</genericButton
        >
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
        <genericButton @click="$refs.mergeModal.hide()"> Cancel </genericButton>
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
        <GenericButton @click="$refs.unlinkModal.hide()">
          Cancel
        </GenericButton>
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
    <div v-if="!isEmptyObject(record)" class="mb-6">
      <TextH1> Work Item {{ record.id }} {{ statusString }} </TextH1>
      <TextL1>
        {{ record.description }}
      </TextL1>
    </div>

    <workitemsSummaryCardPlaceholder
      v-if="isEmptyObject(record)"
      :item="record"
    />
    <workitemsSummaryCard v-else class="mb-4" :item="record" />

    <div
      v-if="$hasPermission('ukrdc:workitems:write') && record.status !== 3"
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8"
    >
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          @click="$refs.addCommentModal.show()"
        >
          <IconPencil />
          Comment
        </genericButtonPrimary>
      </div>
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          colour="green"
          @click="$refs.mergeModal.show()"
        >
          <IconLink />
          Merge
        </genericButtonPrimary>
      </div>
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          colour="red"
          @click="$refs.unlinkModal.show()"
        >
          <IconXCircle />
          Unlink
        </genericButtonPrimary>
      </div>
    </div>

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
          v-if="allMasterRecords[relatedMasterRecordsIndex]"
          :to="`/masterrecords/${allMasterRecords[relatedMasterRecordsIndex].id}`"
        >
          <masterrecordsRecordCard
            class="border-2 border-indigo-500"
            :record="allMasterRecords[relatedMasterRecordsIndex]"
            :label="`Master record ${relatedMasterRecordsIndex + 1} of ${
              allMasterRecords.length
            }`"
          />
        </NuxtLink>

        <div
          v-else
          class="rounded-md bg-red-50 text-sm font-medium text-red-800 p-4"
        >
          No valid master record found
        </div>
      </div>

      <GenericCard v-if="allMasterRecords.length > 1" class="pl-4 mt-2">
        <GenericItemPaginator
          v-model="relatedMasterRecordsIndex"
          :total="allMasterRecords.length"
          item-label="Master Record"
        />
      </GenericCard>
    </div>

    <div v-if="relatedPersons.length > 0" class="mb-8">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Compare Records
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
import Vue from 'vue'

import { Person } from '@/interfaces/persons'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { WorkItem } from '@/interfaces/workitem'
import { modalInterface } from '@/interfaces/modal'
import { MirthMessageResponse } from '@/interfaces/mirth'
import { MasterRecord } from '@/interfaces/masterrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      record: {} as WorkItem,
      relatedRecords: [] as WorkItem[],
      relatedPersons: [] as Person[],
      relatedMasterRecords: [] as MasterRecord[],
      relatedRecordsIndex: 0,
      relatedMasterRecordsIndex: 0,
      customComment: '',
    }
  },
  async fetch() {
    // Get the main record data
    const path = `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}/`
    const res: WorkItem = await this.$axios.$get(path)
    this.record = res
    this.customComment = res.updateDescription

    // Use the record links to load related data concurrently
    const [
      relatedRecordsRes,
      relatedPersonsRes,
      relatedMasterRecordsRes,
    ] = await Promise.all([
      this.$axios.$get(this.record.links.related),
      this.$axios.$get(this.record.masterRecord.links.persons),
      this.$axios.$get(this.record.masterRecord.links.related),
    ])

    this.relatedRecords = relatedRecordsRes
    this.relatedMasterRecords = relatedMasterRecordsRes

    // Exclude the WorkItems Person record from our related Persons array
    this.relatedPersons = []
    for (const relatedPerson of relatedPersonsRes) {
      if (relatedPerson.id !== this.record.personId) {
        this.relatedPersons.push(relatedPerson)
      }
    }
  },
  head() {
    return {
      title: 'Work Item',
    }
  },
  computed: {
    allMasterRecords(): MasterRecord[] {
      if (this.record.masterRecord) {
        return [this.record.masterRecord].concat(this.relatedMasterRecords)
      } else {
        return this.relatedMasterRecords
      }
    },
    statusString(): string {
      if (this.record.status === 1) {
        return ''
      } else if (this.record.status === 2) {
        return '(WIP)'
      } else if (this.record.status === 3) {
        return '(Closed)'
      } else {
        return '(Unknown status)'
      }
    },
  },
  methods: {
    async updateWorkItemComment() {
      const path = `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}/`
      await this.$axios.$put(path, {
        comment: this.customComment,
      })

      const el = this.$refs.addCommentModal as modalInterface
      el.toggle()
      this.$fetch()
      this.$toast.show({
        type: 'success',
        title: 'Success',
        message: 'Comment added',
        classTimeout: 'bg-green-600',
      })
    },
    mergeWorkItem() {
      this.actionWorkItem(
        `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}/merge`
      )
      const el = this.$refs.mergeModal as modalInterface
      el.toggle()
    },
    unlinkWorkItem() {
      this.actionWorkItem(
        `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}/unlink`
      )
      const el = this.$refs.unlinkModal as modalInterface
      el.toggle()
    },
    actionWorkItem(postPath: string) {
      this.$axios
        .$post(postPath)
        .then((res: MirthMessageResponse) => {
          if (res.status === 'success') {
            this.$axios
              .$post(
                `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}/close`,
                {
                  comment: this.customComment,
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
          this.$toast.show({
            type: 'danger',
            title: 'Error',
            message: error.response.data.detail,
            timeout: 10,
            classTimeout: 'bg-red-600',
          })
        })
        .finally(() => {
          this.$fetch()
        })
    },
  },
})
</script>
