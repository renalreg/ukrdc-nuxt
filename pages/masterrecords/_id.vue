<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div v-if="record" class="mb-6">
      <h1
        v-if="record.givenname"
        class="text-2xl font-bold text-gray-900 capitalize"
      >
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </h1>
      <p class="text-sm font-medium text-gray-500">
        {{ record.nationalidType }} record
      </p>
    </div>

    <!-- Work items alert -->
    <GenericAlertWarning
      class="mb-4"
      :message="`${workItems.length} open workitem(s) found`"
    />

    <!-- Description list -->
    <GenericCard class="mb-8 p-6">
      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">National ID</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ record.nationalid }}
          </dd>
        </div>

        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">ID Type</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ record.nationalidType }}
          </dd>
        </div>

        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Gender</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ formatGender(record.gender) }}
          </dd>
        </div>

        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ formatDate(record.birthTime, (t = false)) }}
          </dd>
        </div>

        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ formatDate(record.lastUpdated) }}
          </dd>
        </div>

        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Effective Date</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ formatDate(record.effectiveDate) }}
          </dd>
        </div>
      </dl>
    </GenericCard>

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
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'
import { PatientRecordShort } from '@/interfaces/patientrecord'

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
    const path = `${this.$config.apiBase}/empi/masterrecords/${this.$route.params.id}/`
    const res: MasterRecord = await this.$axios.$get(path)
    this.record = res

    // Use the record links to load related data concurrently
    const [relatedRecords, workItems, patientRecords] = await Promise.all([
      this.$axios.$get(this.record.links.related),
      this.$hasPermission('ukrdc:empi:write')
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
