<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div v-if="$fetchState.pending">Loading...</div>
    <div v-else>
      <!-- Header card  -->
      <workitemsSummaryCard class="mb-8" :item="record" />

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
      relatedRecords: [] as WorkItem[],
      relatedPersons: [] as Person[],
      relatedIndex: 0,
    }
  },
  async fetch() {
    // Get the main record data
    const path = `/api/empi/workitems/${this.$route.params.id}`
    const res: WorkItem = await this.$axios.$get(path)
    this.record = res

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
})
</script>
