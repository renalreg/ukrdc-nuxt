<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <ModalSlot v-if="$auth.hasScope('write:workitems')" ref="addCommentModal">
      <div class="text-left">
        <div class="mb-4">Add Work Item comment</div>
        <textarea
          v-model="customComment"
          rows="3"
          class="max-w-lg shadow-sm block w-full mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$refs.addCommentModal.hide()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="updateWorkItemComment()"
        >
          Save
        </button>
      </div>
    </ModalSlot>

    <ModalSlot v-if="$auth.hasScope('write:workitems')" ref="mergeModal">
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
        <button
          type="button"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$refs.mergeModal.hide()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="mergeWorkItem()"
        >
          Merge and Close
        </button>
      </div>
    </ModalSlot>

    <ModalSlot v-if="$auth.hasScope('write:workitems')" ref="unlinkModal">
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
        <button
          type="button"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$refs.unlinkModal.hide()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="unlinkWorkItem()"
        >
          Unlink and Close
        </button>
      </div>
    </ModalSlot>

    <!-- Header card  -->
    <workitemsSummaryCardPlaceholder
      v-if="isEmptyObject(record)"
      class="mb-4"
      :item="record"
    />
    <workitemsSummaryCard v-else class="mb-4" :item="record" />

    <div
      v-if="$auth.hasScope('write:workitems') && record.status !== 3"
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
    >
      <div>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 w-full border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        </button>
      </div>
      <div>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 w-full border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
        </button>
      </div>
      <div>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 w-full border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
        </button>
      </div>
    </div>

    <!-- Related WorkItems  -->
    <div
      v-if="relatedRecords.length > 0"
      class="bg-white shadow overflow-hidden rounded-md mb-8"
    >
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
    </div>

    <div class="mb-8">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Proposed Link
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <personsRecordCard
          v-if="record.person"
          class="border-2 border-red-500"
          :record="record.person"
          label="Incoming"
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
            label="Master Record"
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <personsRecordCard
          v-if="record.person"
          class="border-2 border-red-500"
          :record="record.person"
          label="Incoming"
        />
        <div
          v-else
          class="rounded-md bg-red-50 text-sm font-medium text-red-800 p-4"
        >
          No valid person record found
        </div>
        <personsRecordCard
          :record="relatedPersons[relatedIndex]"
          :label="`Related record ${relatedIndex + 1} of ${
            relatedPersons.length
          }`"
        />
      </div>

      <nav
        v-if="relatedPersons.length > 1"
        class="bg-white shadow overflow-hidden rounded-md flex items-center justify-between px-2 py-2 mt-2"
        aria-label="Pagination"
      >
        <div class="hidden sm:block">
          <p class="text-sm text-gray-700 ml-2">
            Record
            <span class="font-medium">{{ relatedIndex + 1 }}</span>
            of
            <span class="font-medium">{{ relatedPersons.length }}</span>
          </p>
        </div>
        <div class="flex-1 flex justify-between sm:justify-end">
          <button
            :class="{ invisible: relatedIndex <= 0 }"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            @click="relatedIndex = relatedIndex - 1"
          >
            Previous
          </button>
          <button
            :class="{ invisible: relatedIndex >= relatedPersons.length - 1 }"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 sm:ml-2"
            @click="relatedIndex = relatedIndex + 1"
          >
            Next
          </button>
        </div>
      </nav>
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

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      record: {} as WorkItem,
      relatedRecords: [] as WorkItem[],
      relatedPersons: [] as Person[],
      relatedIndex: 0,
      customComment: '',
    }
  },
  async fetch() {
    // Get the main record data
    const path = `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}`
    const res: WorkItem = await this.$axios.$get(path)
    this.record = res
    this.customComment = res.updateDescription

    // Use the record links to load related data concurrently
    const [relatedRecordsRes, relatedPersonsRes] = await Promise.all([
      this.$axios.$get(this.record.links.related),
      this.$axios.$get(this.record.masterRecord.links.persons),
    ])

    this.relatedRecords = relatedRecordsRes

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
  methods: {
    async updateWorkItemComment() {
      const path = `${this.$config.apiBase}/empi/workitems/${this.$route.params.id}`
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
