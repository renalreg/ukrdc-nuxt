<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div>
      <!-- Work items alert -->
      <div
        v-if="workItems && workItems.length > 0"
        class="rounded-md bg-yellow-50 p-4 mb-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Heroicon name: solid/exclamation -->
            <svg
              class="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              {{ workItems.length }} open workitem(s) found
            </h3>
          </div>
        </div>
      </div>

      <masterrecordsRecordCardPlaceholder v-if="isEmptyObject(record)" />
      <masterrecordsRecordCard v-else :record="record" />

      <GenericCard v-if="workItems && workItems.length > 0" class="mt-4">
        <!-- Card header -->
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Open Work Items
          </h3>
        </div>
        <!-- Real results -->
        <ul class="divide-y divide-gray-200">
          <workitemsListItem
            v-for="item in workItems"
            :key="item.id"
            :item="item"
          />
        </ul>
      </GenericCard>

      <!-- Related Records card -->
      <GenericCard class="mt-4">
        <!-- Card header -->
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Patient Records
          </h3>
        </div>
        <!-- Real results -->
        <ul class="divide-y divide-gray-200">
          <patientrecordsListItem
            v-for="item in patientRecords"
            :key="item.pid"
            :item="item"
          />
        </ul>
      </GenericCard>

      <!-- Related Records card -->
      <GenericCard class="mt-4">
        <!-- Card header -->
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Linked Master Records
          </h3>
        </div>
        <!-- Real results -->
        <ul class="divide-y divide-gray-200">
          <masterrecordsListItem
            v-for="item in relatedRecords"
            :key="item.id"
            :item="item"
          />
        </ul>
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { MasterRecord } from '~/interfaces/masterrecord'
import { WorkItem } from '~/interfaces/workitem'
import { PatientRecordShort } from '~/interfaces/patientrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      record: {} as MasterRecord,
      relatedRecords: [] as MasterRecord[],
      workItems: [] as WorkItem[],
      patientRecords: [] as PatientRecordShort[],
    }
  },
  async fetch() {
    // Get the main record data
    const path = `${this.$config.apiBase}/empi/masterrecords/${this.$route.params.id}`
    const res: MasterRecord = await this.$axios.$get(path)
    this.record = res

    // Use the record links to load related data concurrently
    const [relatedRecords, workItems, patientRecords] = await Promise.all([
      this.$axios.$get(this.record.links.related),
      this.$auth.hasScope('write:empi')
        ? this.$axios.$get(this.record.links.workitems)
        : null,
      this.$axios.$get(this.record.links.patientrecords),
    ])

    this.relatedRecords = relatedRecords
    this.workItems = workItems
    this.patientRecords = patientRecords
  },
  head() {
    return {
      title: 'Master Records',
    }
  },
})
</script>

<style></style>
