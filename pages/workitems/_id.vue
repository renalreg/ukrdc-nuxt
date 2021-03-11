<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div v-if="$fetchState.pending">Loading...</div>
    <div v-else>
      <!-- Header card  -->
      <div class="bg-white shadow overflow-hidden rounded-md mb-8">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Work Item {{ record.id }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ record.description }}
          </p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{
                  record.lastUpdated ? formatDate(record.lastUpdated) : 'Never'
                }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Last Updated By</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ record.updatedBy ? record.updatedBy : 'N/A' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Comments</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{
                  record.updateDescription ? record.updateDescription : 'None'
                }}
              </dd>
            </div>
          </dl>
        </div>
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
          <masterrecordsRecordCard
            v-if="record.masterRecord"
            class="border-2 border-indigo-500"
            :record="record.masterRecord"
            label="Master Record"
          />
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
            class="border-2 border-red-500"
            :record="record.person"
            label="Incoming"
          />
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { WorkItem } from '@/interfaces/workitems'
import { Person } from '@/interfaces/persons'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  data() {
    return {
      record: {} as WorkItem,
      relatedPersons: [] as Person[],
      relatedIndex: 0,
    }
  },
  async fetch() {
    // Get the main record data
    const path = `/empi/workitems/${this.$route.params.id}`
    const res: WorkItem = await this.$axios.$get(path)
    this.record = res

    // Use the record links to load related data concurrently
    const relatedPersonsRes: Person[] = await this.$axios.$get(
      this.record.masterRecord.links.persons
    )
    this.relatedPersons = relatedPersonsRes
  },
  head() {
    return {
      title: 'Work Item',
    }
  },
})
</script>
