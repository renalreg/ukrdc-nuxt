<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <GenericModalSlot
      v-if="$auth.hasScope('write:workitems')"
      ref="addCommentModal"
    >
      <div class="text-left">
        <div class="mb-4">Add Work Item comment</div>
        <textarea
          v-model="customComment"
          rows="3"
          class="max-w-lg shadow-sm block w-full mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        ></textarea>
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

    <GenericModalSlot v-if="$auth.hasScope('write:workitems')" ref="mergeModal">
      <div class="text-left">
        <div class="mb-4">Merge and close the Work Item</div>
        <div>
          <label
            for="merge-comments"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Comments
          </label>
          <textarea
            id="merge-comments"
            v-model="customComment"
            name="merge-comments"
            rows="3"
            class="max-w-lg shadow-sm block w-full mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          ></textarea>
        </div>
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
      v-if="$auth.hasScope('write:workitems')"
      ref="unlinkModal"
    >
      <div class="text-left">
        <div class="mb-4">Unlink and close the Work Item</div>
        <div>
          <label
            for="unlink-comments"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Comments
          </label>
          <textarea
            id="unlink-comments"
            v-model="customComment"
            name="unlink-comments"
            rows="3"
            class="max-w-lg shadow-sm block w-full mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          ></textarea>
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

    <!-- Header card  -->
    <workitemsSummaryCardPlaceholder
      v-if="isEmptyObject(record)"
      :item="record"
    />
    <workitemsSummaryCard v-else class="mb-4" :item="record" />

    <div
      v-if="$auth.hasScope('write:workitems') && record.status !== 3"
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8"
    >
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          @click="$refs.addCommentModal.show()"
        >
          <!-- Heroicon name: solid/pencil -->
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
          Comment
        </genericButtonPrimary>
      </div>
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          colour="green"
          @click="$refs.mergeModal.show()"
        >
          <!-- Heroicon name: solid/link -->
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clip-rule="evenodd"
            />
          </svg>
          Merge
        </genericButtonPrimary>
      </div>
      <div>
        <genericButtonPrimary
          class="inline-flex items-center justify-center w-full"
          colour="red"
          @click="$refs.unlinkModal.show()"
        >
          <!-- Heroicon name: solid/x-circle -->
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          Unlink
        </genericButtonPrimary>
      </div>
    </div>

    <!-- Related WorkItems  -->
    <GenericCard v-if="relatedRecords.length > 0" class="mb-8">
      <!-- Card header -->
      <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Related Work Items
        </h3>
      </div>
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
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Proposed Link
      </h3>

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

      <GenericItemPaginator
        v-if="allMasterRecords.length > 1"
        v-model="relatedMasterRecordsIndex"
        class="bg-white shadow rounded-md pl-6 mt-2"
        :total="allMasterRecords.length"
        item-label="Master Record"
      />
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

      <GenericItemPaginator
        v-if="relatedPersons.length > 1"
        v-model="relatedRecordsIndex"
        class="bg-white shadow rounded-md pl-6 mt-2"
        :total="relatedPersons.length"
        item-label="Record"
      />
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
